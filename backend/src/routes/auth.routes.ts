import crypto from "node:crypto";

import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../lib/auth-schemas.js";
import { OAuth2Client } from "google-auth-library";
import { Router } from "express";
import { z } from "zod";

import { hashResetToken, sanitizeUser } from "../lib/auth-utils.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { asyncHandler } from "../middleware/async-handler.js";
import {
  requireAuth,
  type AuthedRequest,
} from "../middleware/auth.middleware.js";
import { User } from "../models/User.model.js";

export const authRouter = Router();

const googleClient = () => {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) return null;
  return new OAuth2Client(id);
};

function issueTokens(user: { id: string; email: string }) {
  return {
    accessToken: signAccessToken({ id: user.id, email: user.email }),
    refreshToken: signRefreshToken({ id: user.id }),
  };
}

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password, name } = parsed.data;
    const existing = await User.findOne({ email });
    if (existing) {
      res
        .status(409)
        .json({ message: "An account with this email already exists." });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name: name?.trim() ?? "",
    });

    const tokens = issueTokens({ id: user.id, email: user.email });
    res.status(201).json({ user: sanitizeUser(user), ...tokens });
  }),
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const tokens = issueTokens({ id: user.id, email: user.email });
    res.json({ user: sanitizeUser(user), ...tokens });
  }),
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email } = parsed.data;
    const user = await User.findOne({ email });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetTokenHash = hashResetToken(rawToken);
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";
      const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`;

      if (process.env.NODE_ENV !== "production") {
        console.info(`[afterglow] Password reset link for ${email}: ${resetUrl}`);
      }
    }

    res.json({
      message:
        "If an account exists for that email, we sent reset instructions.",
    });
  }),
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { token, password } = parsed.data;
    const tokenHash = hashResetToken(token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired reset link." });
      return;
    }

    user.passwordHash = await hashPassword(password);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: "Password updated. You can sign in now." });
  }),
);

authRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const client = googleClient();
    if (!client) {
      res.status(503).json({ message: "Google sign-in is not configured." });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: parsed.data.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(400).json({ message: "Google did not return an email." });
      return;
    }

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const name = payload.name ?? "";
    const picture = payload.picture ?? "";

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        name,
        picture,
      });
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (name && !user.name) user.name = name;
      if (picture && !user.picture) user.picture = picture;
      await user.save();
    }

    const tokens = issueTokens({ id: user.id, email: user.email });
    res.json({ user: sanitizeUser(user), ...tokens });
  }),
);

authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const parsed = z
      .object({ refreshToken: z.string().min(10) })
      .safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Missing refresh token." });
      return;
    }

    try {
      const payload = verifyRefreshToken(parsed.data.refreshToken);
      const user = await User.findById(payload.sub);
      if (!user) {
        res.status(401).json({ message: "Unauthorized." });
        return;
      }

      const tokens = issueTokens({ id: user.id, email: user.email });
      res.json({ user: sanitizeUser(user), ...tokens });
    } catch {
      res.status(401).json({ message: "Invalid refresh token." });
    }
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = (req as AuthedRequest).auth;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  }),
);

import crypto from "node:crypto";

import type { HydratedDocument } from "mongoose";

import type { IUser } from "../models/User.model.js";

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function sanitizeUser(user: HydratedDocument<IUser>) {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "",
    picture: user.picture ?? "",
  };
}

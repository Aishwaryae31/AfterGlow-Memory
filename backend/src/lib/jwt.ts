import jwt from "jsonwebtoken";

const ACCESS_ALG = "HS256" as const;
const REFRESH_ALG = "HS256" as const;

function accessSecret() {
  const s = process.env.JWT_ACCESS_SECRET;
  if (!s) throw new Error("JWT_ACCESS_SECRET is not set");
  return s;
}

function refreshSecret() {
  const s = process.env.JWT_REFRESH_SECRET;
  if (!s) throw new Error("JWT_REFRESH_SECRET is not set");
  return s;
}

export type AccessTokenPayload = {
  sub: string;
  email: string;
  token_use: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  token_use: "refresh";
};

export function signAccessToken(user: { id: string; email: string }) {
  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    token_use: "access",
  };
  return jwt.sign(payload, accessSecret(), {
    algorithm: ACCESS_ALG,
    expiresIn: "15m",
  });
}

export function signRefreshToken(user: { id: string }) {
  const payload: RefreshTokenPayload = { sub: user.id, token_use: "refresh" };
  return jwt.sign(payload, refreshSecret(), {
    algorithm: REFRESH_ALG,
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, accessSecret(), {
    algorithms: [ACCESS_ALG],
  }) as jwt.JwtPayload & AccessTokenPayload;
  if (decoded.token_use !== "access") throw new Error("Invalid token type");
  return decoded as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, refreshSecret(), {
    algorithms: [REFRESH_ALG],
  }) as jwt.JwtPayload & RefreshTokenPayload;
  if (decoded.token_use !== "refresh") throw new Error("Invalid token type");
  return decoded as RefreshTokenPayload;
}

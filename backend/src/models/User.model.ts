import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
      index: true,
    },
    passwordHash: { type: String, default: null },
    name: { type: String, default: "", maxlength: 80 },
    picture: { type: String, default: "" },
    googleId: { type: String, default: null, sparse: true, unique: true },
    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export type UserModel = Model<IUser>;

export const User =
  (mongoose.models.User as UserModel | undefined) ??
  mongoose.model<IUser>("User", userSchema);

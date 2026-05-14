import mongoose from "mongoose";

const defaultUri = "mongodb://127.0.0.1:27017/afterglow";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? defaultUri;

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

export { mongoose };

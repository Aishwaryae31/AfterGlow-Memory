import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaSchema = new Schema(
  {
    publicId: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: {
      type: String,
      required: true,
      enum: ["image", "video", "raw"],
    },
    format: { type: String, default: "" },
    bytes: { type: Number, default: 0 },
    duration: { type: Number, default: undefined },
  },
  { _id: false },
);

const memorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    kind: {
      type: String,
      required: true,
      enum: ["photo", "video", "voice", "text"],
      index: true,
    },
    title: { type: String, required: true, maxlength: 200, trim: true },
    description: { type: String, default: "", maxlength: 8000 },
    /** The remembered moment (calendar) */
    memoryDate: { type: Date, required: true, index: true },
    location: { type: String, default: "", maxlength: 500, trim: true },
    people: { type: [String], default: [] },
    emotions: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    /** Plain text body for `text` memories */
    content: { type: String, default: "", maxlength: 20000 },
    media: { type: mediaSchema, default: undefined },
  },
  { timestamps: true },
);

memorySchema.index({ userId: 1, createdAt: -1 });
memorySchema.index({ userId: 1, memoryDate: -1 });

export type IMemory = InferSchemaType<typeof memorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export type MemoryModel = Model<IMemory>;

export const Memory =
  (mongoose.models.Memory as MemoryModel | undefined) ??
  mongoose.model<IMemory>("Memory", memorySchema);

import { Schema, model } from "mongoose";

const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SiteContent = model("SiteContent", siteContentSchema);

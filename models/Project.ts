import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  category: "dev" | "art";
  tags: string[];
  image: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedAt: string;
  role?: string;
  status?: string;
  client?: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    longDescription: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["dev", "art"],
      required: [true, "Category is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    gallery: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: String,
      required: [true, "completedAt is required"],
    },
    role: { type: String, default: "" },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    client: { type: String, default: "" },
  },
  {
    timestamps: true, // auto-manages createdAt and updatedAt
  },
);

// Prevent model recompilation during hot-reload in development
const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>("Project", ProjectSchema);

export default Project;

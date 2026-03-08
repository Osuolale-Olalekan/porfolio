import mongoose, { Schema, Document, Model } from "mongoose"

export interface IProfile extends Document {
  name: string
  title: string
  bio: string
  avatar: string
  email: string
  location: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    dribbble?: string
    behance?: string
  }
  stats: {
    yearsExperience: number
    projectsCompleted: number
    happyClients: number
  }
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
      default: "",
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      dribbble: { type: String, default: "" },
      behance: { type: String, default: "" },
    },
    stats: {
      yearsExperience: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      happyClients: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
)

const Profile: Model<IProfile> =
  mongoose.models.Profile ?? mongoose.model<IProfile>("Profile", ProfileSchema)

export default Profile
import mongoose, { Schema, Document, Model } from "mongoose"

export interface ISkill extends Document {
  name: string
  category: string
  proficiency: number
  portfolioType: "developer" | "artist" | "both"
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    proficiency: {
      type: Number,
      required: [true, "Proficiency is required"],
      min: [0, "Minimum is 0"],
      max: [100, "Maximum is 100"],
    },
    portfolioType: {
      type: String,
      enum: ["developer", "artist", "both"],
      required: [true, "Portfolio type is required"],
    },
  },
  {
    timestamps: true,
  }
)

const Skill: Model<ISkill> =
  mongoose.models.Skill ?? mongoose.model<ISkill>("Skill", SkillSchema)

export default Skill
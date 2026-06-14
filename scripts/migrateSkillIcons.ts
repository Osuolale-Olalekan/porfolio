// scripts/migrateSkillIcons.ts
import 'dotenv/config'
import { connectDB } from "@/lib/mongodb"
import Skill from "@/models/Skill"

async function run() {
  await connectDB()

  const result = await Skill.updateMany(
    { icon: { $exists: false } }, // only docs missing the field
    { $set: { icon: "" } }
  )

  console.log(`Updated ${result.modifiedCount} skills`)
  process.exit()
}

run()
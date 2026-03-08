import { connectDB } from "@/lib/mongodb"
import Profile, { IProfile } from "@/models/Profile"

function toPlain(doc: IProfile) {
  const obj = doc.toObject({ versionKey: false })
  obj._id = obj._id.toString()
  return obj
}

// There is only one profile document — fetch it directly
export async function getProfile() {
  await connectDB()
  const profile = await Profile.findOne({})
  if (!profile) return null
  return toPlain(profile)
}

export async function updateProfile(updates: Partial<IProfile>) {
  await connectDB()
  // upsert: creates the profile if it doesn't exist yet
  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  )
  return toPlain(profile!)
}
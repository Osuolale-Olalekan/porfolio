// scripts/createAdmin.ts
// import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import Admin from "@/models/Admin"
import { connectDB } from "@/lib/mongodb"

async function run() {
  await connectDB()

  const email = "admin@gmail.com"
  const password = "Abayomi#1"

  const exists = await Admin.findOne({ email })
  if (exists) {
    console.log("Admin already exists")
    process.exit()
  }

  const hashed = await bcrypt.hash(password, 10)

  await Admin.create({
    email,
    password: hashed,
  })

  console.log("Admin created")
  process.exit()
}

run()
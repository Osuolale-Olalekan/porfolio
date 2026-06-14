import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const isIcon = type === "icon"

    const result = await cloudinary.uploader.upload(base64, {
      folder: isIcon ? "portfolio/icons" : "portfolio/projects",
      // For icons: upload as-is, no transformation
      // For project images: gentle resize without cropping
      ...(isIcon
        ? {}
        : {
            transformation: [
              { width: 1200, crop: "limit" }, // only shrinks if wider than 1200px, never crops
            ],
          }),
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error("Cloudinary upload error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}


// import { NextRequest, NextResponse } from "next/server"
// import { v2 as cloudinary } from "cloudinary"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData()
//     const file = formData.get("file") as File

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     // Convert file to base64
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)
//     const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(base64, {
//       folder: "portfolio/projects",
//       transformation: [{ width: 800, height: 600, crop: "fill" }],
//     })

//     return NextResponse.json({ url: result.secure_url })
//   } catch (err) {
//     console.error("Cloudinary upload error:", err)
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 })
//   }
// }
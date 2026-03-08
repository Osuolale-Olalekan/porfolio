"use server"

import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  projectType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    projectType: formData.get("projectType"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { name, email, projectType, message } = parsed.data

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // change after verifying your domain
      to: process.env.EMAIL_FROM!,
      replyTo: email,
      subject: `New message from ${name} — ${projectType ?? "General"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Type:</strong> ${projectType ?? "Not specified"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    })

    return {
      success: true,
      message: "Thanks! I'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Email error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}
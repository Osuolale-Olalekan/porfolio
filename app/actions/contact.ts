"use server"

import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  projectType: z.enum(["development", "illustration", "both", "other"]).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

export type ContactFormState = {
  success: boolean
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
    projectType?: string[]
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    projectType: formData.get("projectType") || undefined,
  }

  const validatedFields = contactSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Simulate sending email or storing in database
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would send an email or store in database here
  console.log("Contact form submitted:", validatedFields.data)

  return {
    success: true,
    message: "Thank you for your message! I'll get back to you soon.",
  }
}

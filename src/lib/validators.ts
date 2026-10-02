import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name').max(80),
    email: z.string().trim().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/\d/, 'Include at least one number'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  })

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().max(20),
  subject: z.string().trim().min(2, 'Choose a subject'),
  message: z.string().trim().min(10, 'Write at least 10 characters').max(2000),
})

export const workshopSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().max(20),
})

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(80),
  phone: z.string().trim().max(20),
  bio: z.string().trim().max(400),
})

export function enrollSchema(requiresRisk: boolean) {
  return z
    .object({
      phone: z.string().trim().min(7, 'Enter a phone number').max(20),
      goal: z.string().trim().max(500),
      agreement: z.boolean(),
      risk: z.boolean(),
    })
    .refine((values) => values.agreement, {
      path: ['agreement'],
      message: 'Confirm that you understand this is a training program',
    })
    .refine((values) => !requiresRisk || values.risk, {
      path: ['risk'],
      message: 'Acknowledge the trading risk statement before enrolling',
    })
}

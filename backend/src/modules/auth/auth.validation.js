const { z } = require("zod");

// Common email schema
const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(5)
  .max(255);

// Password rules:
// - At least 8 characters
// - At least one letter
// - At least one number
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Register validation
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Login validation
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};

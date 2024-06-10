import { z } from 'zod'


// The signUpSchema is a Zod object that defines the structure of the data being validated.
export const signUpSchema = z.object({
    username: z
        .string()
        .min(4, "Username must be atleast 4 characters")
        .max(20, "Username must be no more than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"),

    // .email applies the email validation rule, and if the value is not a valid email address, it displays a custom error message.
    email: z
        .string()
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
});





import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().min(1, "Description cannot be empty"),
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).json({errorMessage: "Method not allowed"})
    }

    try {
        const validateData = formSchema.parse(req.body)

        return res.status(200).json({message:"Form submitted successfully!", data: validateData})
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = Object.keys(error.formErrors.fieldsErrors)?.reduce((acc, key)=> {
                acc[key]=error.formErrors.fieldsErrors[key]?.[0] || "Unknown error"
                return acc
            })
            return res.status(400).json({ errors: error.formErrors.fieldsErrors})
        }
    }
}
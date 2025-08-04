import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ errorMessage: "Method not allowed" });
  }

  try {
    const validatedData = formSchema.parse(req.body);

    return res.status(200).json({
      message: "Form submitted successfully!",
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.reduce((acc, issue) => {
        const key = issue.path[0];
        if (typeof key === "string" && !acc[key]) {
          acc[key] = issue.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return res.status(400).json({ errors });
    }

    return res.status(500).json({ errorMessage: "Internal server error" });
  }
}
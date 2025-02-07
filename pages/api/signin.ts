import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" })

    res.status(200).json({
      name: user.name,
      message: "Authentication successful",
      token,
    })
  } catch (error) {
    console.error("Signin error:", error)
    res.status(500).json({ message: "Error authenticating user" })
  }
}


import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import { headers } from "next/headers"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Butler - Your AI Assistant",
  description: "AI-powered chat application to help with your daily tasks",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get("x-invoke-path") || ""

  const isAuthPage = pathname === "/" || pathname === "/signup"

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <div className="flex flex-col flex-grow">
          {!isAuthPage && <Header />}
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  )
}


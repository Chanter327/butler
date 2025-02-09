import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
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
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <div className={`${inter.className} flex flex-col h-screen overflow-hidden`}>
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  )
}


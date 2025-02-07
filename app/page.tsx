"use client"

import { useState } from "react"
import AuthForm from "./components/AuthForm"

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Butler</h1>
          <p className="mt-2 text-sm text-gray-600">あなたの専属執事、いつでもお手伝いします。</p>
        </div>
        <AuthForm isSignIn={isSignIn} />
        <div className="text-center">
          <button onClick={() => setIsSignIn(!isSignIn)} className="text-sm text-blue-500 hover:text-blue-700">
            {isSignIn ? "アカウントをお持ちでない方はこちら" : "すでにアカウントをお持ちの方はこちら"}
          </button>
        </div>
      </div>
    </div>
  )
}


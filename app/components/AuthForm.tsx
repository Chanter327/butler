"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { API_ROUTES } from "@/config/api"

interface AuthFormProps {
  isSignIn: boolean
}

export default function AuthForm({ isSignIn }: AuthFormProps) {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const endpoint = isSignIn ? API_ROUTES.SIGNIN : API_ROUTES.SIGNUP
    const payload = isSignIn ? { email, password } : { userName, email, password }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: isSignIn ? "サインイン成功" : "サインアップ成功",
          description: data.message,
        })
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        if (data.uid) {
          localStorage.setItem("uid", data.uid)
        }
        if (data.userName) {
          localStorage.setItem("userName", data.userName)
          window.dispatchEvent(new CustomEvent('userNameUpdated', { detail: data.userName }))
        }
        router.push("/dashboard")
      } else {
        throw new Error(data.message || "エラーが発生しました")
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "予期せぬエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center">{isSignIn ? "サインイン" : "サインアップ"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isSignIn && (
          <div>
            <Label htmlFor="userName">ユーザーネーム</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required={!isSignIn}
            />
          </div>
        )}
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "処理中..." : isSignIn ? "サインイン" : "サインアップ"}
        </Button>
      </form>
    </div>
  )
}


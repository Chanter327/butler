"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { API_ROUTES } from "@/config/api"
import { useSelect } from "@/hooks/select"

type Participant = {
  email: string
}

export default function NewChatPage() {
  const [chatName, setChatName] = useState("")
  const [chatType, setChatType] = useSelect("dm")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [newParticipant, setNewParticipant] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const uid = localStorage.getItem("uid")
    if (!uid) {
      toast({
        title: "エラー",
        description: "ユーザー情報が見つかりません。再度サインインしてください。",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [router])

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== "") {
      setParticipants([...participants, { email: newParticipant.trim() }])
      setNewParticipant("")
    }
  }

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const uid = localStorage.getItem("uid")
    if (!uid) {
      toast({
        title: "エラー",
        description: "ユーザー情報が見つかりません。再度サインインしてください。",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    if (chatType === "group" && !chatName.trim()) {
      toast({
        title: "エラー",
        description: "グループチャットの場合は、チャット名を入力してください。",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const payload = {
      type: chatType,
      chatName: chatType === "group" ? chatName : undefined,
      participantsEmails: participants,
      chatCreatorId: uid,
    }

    try {
      const response = await fetch(API_ROUTES.CREATE_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "チャット作成成功",
          description: "新しいチャットが作成されました。",
        })
        router.push("/chat")
      } else {
        throw new Error(data.message || "チャットの作成中にエラーが発生しました")
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
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6">新規チャット作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="chatType">チャットタイプ</Label>
          <Select value={chatType} onValueChange={setChatType}>
            <SelectTrigger>
              <SelectValue placeholder="チャットタイプを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dm">ダイレクトメッセージ</SelectItem>
              <SelectItem value="group">グループチャット</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="chatName">チャット名 (グループチャットのみ)</Label>
          <Input
            id="chatName"
            type="text"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            disabled={chatType === "dm"}
            required={chatType === "group"}
            placeholder={
              chatType === "dm" ? "ダイレクトメッセージではチャット名を設定できません" : "チャット名を入力（必須）"
            }
          />
          {chatType === "group" && (
            <p className="text-sm text-gray-500 mt-1">グループチャットの場合は、チャット名の入力が必須です。</p>
          )}
        </div>
        <div>
          <Label htmlFor="participants">参加者</Label>
          <div className="flex space-x-2">
            <Input
              id="participants"
              type="email"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="参加者のメールアドレスを入力"
            />
            <Button type="button" onClick={handleAddParticipant}>
              追加
            </Button>
          </div>
          <ul className="mt-2 space-y-2">
            {participants.map((participant, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{participant.email}</span>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveParticipant(index)}>
                  削除
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "作成中..." : "チャットを作成"}
        </Button>
      </form>
    </div>
  )
}


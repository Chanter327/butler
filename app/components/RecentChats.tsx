"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { API_ROUTES } from "@/config/api"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Chat = {
  chatId: string
  chatName: string
  updatedAt: string
}

export default function RecentChats() {
  // const chats = [
  //   { id: 1, name: "田中さん", lastMessage: "了解しました。", avatar: "/avatars/tanaka.jpg" },
  //   { id: 2, name: "営業チーム", lastMessage: "明日の会議について", avatar: "/avatars/sales-team.jpg" },
  //   {
  //     id: 3,
  //     name: "AI アシスタント",
  //     lastMessage: "何かお手伝いできることはありますか？",
  //     avatar: "/avatars/ai-assistant.jpg",
  //   },
  // ]

  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentChats = async () => {
      setIsLoading(true)
      setError(null)
      const uid = localStorage.getItem("uid")
      if (!uid) {
        setError("ユーザーIDが見つかりません。再度ログインしてください。")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_ROUTES.GET_RECENT_CHATS}?uid=${uid}`, {
          credentials: "include"
        })
        if (!response.ok) {
          throw new Error("サーバーからのレスポンスが正常ではありません。")
        }
        const data: { chats: Chat[] } = await response.json()
        setChats(data.chats)
      } catch (err) {
        setError("チャット取得中にエラーが発生しました。")
        console.error("Error fetching sumaries:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentChats()
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>再試行</Button>
      </div>
    )
  }

  return (
    <ul className="space-y-4">
      {chats.map((chat) => (
        <li key={chat.chatId} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={""} alt={chat.chatName} />
            <AvatarFallback>{chat.chatName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{chat.chatName}</p>
            <p className="text-xs text-gray-500">最終更新: {formatTimestamp(chat.updatedAt)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}


"use client"

import { useEffect, useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { API_ROUTES } from "@/config/api"
import { useRouter } from "next/navigation"

type Chat = {
  chatId: string
  type: "dm" | "group"
  chatName: string
  lastMessage?: string
  avatar?: string
}

type ChatListProps = {
  type: "dm" | "group"
  onSelectChat: (chatId: string) => void
}

type ApiResponse = {
  chats: Chat[]
}

export default function ChatList({ type, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([])
  const router = useRouter()

  const fetchChats = useCallback(async () => {
    const uid = localStorage.getItem("uid")
    if (!uid) {
      router.push("/")
      return
    }

    try {
      const response = await fetch(`${API_ROUTES.GET_CHATS}?uid=${uid}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data: ApiResponse = await response.json()
        console.log(data)
        if (data && Array.isArray(data.chats)) {
          const validChats = data.chats
            .filter((chat: Chat) => chat.chatId && chat.type === type)
            .map((chat: Chat) => ({
              chatId: chat.chatId,
              type: chat.type,
              chatName: chat.chatName,
              avatar: chat.avatar || "/default-avatar.png",
            }))
          setChats(validChats)
        } else {
          console.error("Received data structure is not as expected:", data)
          setChats([])
        }
      } else {
        console.error("Failed to fetch chats")
        setChats([])
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
      setChats([])
    }
  }, [type, router])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  return (
    <div className="w-[100vw] border-r h-full overflow-hidden flex flex-col sm:w-1/3">
      <div className="flex-1 overflow-y-auto">
      {chats.length > 0 ? (
        <ul className="space-y-2 p-4">
          {chats.map((chat) => (
            <li
              key={chat.chatId}
              className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => onSelectChat(chat.chatId)}
            >
              <Avatar>
                <AvatarImage src={chat.avatar} alt={chat.chatName} />
                <AvatarFallback>{chat.chatName}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-semibold">{chat.chatName}</p>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-4 text-center text-gray-500">チャットはありません</p>
      )}
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, FileText } from "lucide-react"
import { API_ROUTES } from "@/config/api"

type Message = {
  messageId: string
  senderId: string
  content: string
  timestamp: string
  pending?: boolean
}

type ChatAreaProps = {
  chatId: string
}

export default function ChatArea({ chatId }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummaryMode, setIsSummaryMode] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    setIsLoading(true)
    const uid = localStorage.getItem("uid")
    if (!uid) {
      console.error("User ID not found")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_ROUTES.GET_MESSAGES}?chatId=${chatId}&uid=${uid}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("API Response:", data)
        if (data && Array.isArray(data.messages)) {
          const validMessages = data.messages.filter(
            (message: any) => message && typeof message === "object" && "messageId" in message && "senderId" in message,
          )
          setMessages(validMessages)
        } else {
          console.error("Received data structure is not as expected:", data)
        }
      } else {
        console.error("Failed to fetch messages")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }, [chatId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    scrollToBottom()
  }, []) //Corrected useEffect dependency

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const uid = localStorage.getItem("uid")
      if (!uid) {
        console.error("User ID not found")
        return
      }

      const tempMessage: Message = {
        messageId: Date.now().toString(),
        senderId: uid,
        content: newMessage,
        timestamp: new Date().toISOString(),
        pending: true,
      }

      setMessages((prevMessages) => [...prevMessages, tempMessage])
      setNewMessage("")

      try {
        const response = await fetch(API_ROUTES.SEND_MESSAGE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            senderId: uid,
            content: newMessage,
          }),
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          if (data.message && typeof data.message === "object" && "messageId" in data.message) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.messageId === tempMessage.messageId ? { ...data.message, pending: false } : msg,
              ),
            )
            console.log("Message sent successfully:", data.message)
          } else {
            console.error("Received invalid message data:", data)
            setMessages((prevMessages) =>
              prevMessages.map((msg) => (msg.messageId === tempMessage.messageId ? { ...msg, pending: false } : msg)),
            )
          }
        } else {
          console.error("Failed to send message, status:", response.status)
          setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.messageId === tempMessage.messageId ? { ...msg, pending: false } : msg)),
          )
        }
      } catch (error) {
        console.error("Error sending message:", error)
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.messageId === tempMessage.messageId ? { ...msg, pending: false } : msg)),
        )
      }
    }
  }

  const toggleSummaryMode = () => {
    setIsSummaryMode(!isSummaryMode)
    setSelectedMessages([])
  }

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId],
    )
  }

  const handleCreateSummary = async () => {
    if (selectedMessages.length === 0) {
      console.error("No messages selected for summary")
      return
    }

    // TODO: Implement API call to create summary
    console.log("Creating summary for messages:", selectedMessages)

    // Reset summary mode and selected messages
    setIsSummaryMode(false)
    setSelectedMessages([])
  }

  useEffect(() => {
    scrollToBottom()
  }, []) //Corrected useEffect dependency

  if (isLoading && messages.length === 0) {
    return <div className="flex-grow flex items-center justify-center">Loading messages...</div>
  }

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.messageId}
            className={`flex ${message.senderId === localStorage.getItem("uid") ? "justify-end" : "justify-start"}`}
          >
            {isSummaryMode && (
              <Checkbox
                checked={selectedMessages.includes(message.messageId)}
                onCheckedChange={() => toggleMessageSelection(message.messageId)}
                className="mr-2 self-center"
              />
            )}
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.senderId === localStorage.getItem("uid") ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <Avatar>
                <AvatarImage src={`/avatars/${message.senderId}.jpg`} />
                <AvatarFallback>{message.senderId[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg p-3 ${
                  message.senderId === localStorage.getItem("uid")
                    ? message.pending
                      ? "bg-blue-300 text-white"
                      : "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === localStorage.getItem("uid") ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleString()}
                  {message.pending && " (送信中...)"}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={toggleSummaryMode} variant="outline" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            AIによる要約作成
          </Button>
          {isSummaryMode && (
            <Button onClick={handleCreateSummary} variant="primary">
              選択したメッセージを要約
            </Button>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex space-x-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}


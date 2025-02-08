"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, FileText, Edit, Trash2 } from "lucide-react"
import { API_ROUTES } from "@/config/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const useInputFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      const length = inputRef.current.value.length
      inputRef.current.setSelectionRange(length, length)
    }
  }, [])

  return { inputRef, focusInput }
}

type Message = {
  messageId: string
  senderId: string
  // userName: string
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
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [editContent, setEditContent] = useState("")
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { inputRef: editInputRef, focusInput: focusEditInput } = useInputFocus()

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
        if (data && Array.isArray(data.messages)) {
          const validMessages = data.messages.filter(
            (message: any) =>
              message &&
              typeof message === "object" &&
              "messageId" in message &&
              "senderId" in message,
              // "userName" in message,
          )
          setMessages(validMessages)
        } else {
          console.error("Received data structure is not as expected:", data)
          setMessages([])
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
  }, [])

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
        // userName: localStorage.getItem("userName") || "User",
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
          if (data && typeof data === "object" && "messageId" in data) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) => (msg.messageId === tempMessage.messageId ? { ...data, pending: false } : msg)),
            )
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

  const handleDeleteMessage = async (messageId: string) => {
    setDeletingMessageId(messageId)
  }

  const handleEditMessage = async () => {
    if (editingMessage && editContent.trim()) {
      try {
        const response = await fetch(API_ROUTES.EDIT_MESSAGE, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId: editingMessage.messageId,
            newContent: editContent,
          }),
          credentials: "include",
        })

        if (response.ok) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.messageId === editingMessage.messageId ? { ...msg, content: editContent } : msg,
            ),
          )
          setEditingMessage(null)
          setEditContent("")
        } else {
          console.error("Failed to edit message, status:", response.status)
        }
      } catch (error) {
        console.error("Error editing message:", error)
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
    if (editingMessage) {
      focusEditInput()
    }
  }, [editingMessage, focusEditInput])

  if (isLoading && messages.length === 0) {
    return <div className="flex-grow flex items-center justify-center">Loading messages...</div>
  }

  return (
    <div className="flex-grow flex flex-col w-full h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 w-full">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
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
                } group`}
              >
                <Avatar>
                  <AvatarImage src={`/avatars/${message.senderId}.jpg`} />
                  <AvatarFallback>{message.senderId[0].toUpperCase()}</AvatarFallback>
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
                {message.senderId === localStorage.getItem("uid") && !message.pending && (
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingMessage(message)
                        setEditContent(message.content)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">編集</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(message.messageId)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            {isLoading ? "メッセージを読み込み中..." : "メッセージはまだありません"}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t w-full">
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
      <Dialog open={editingMessage !== null} onOpenChange={() => setEditingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>メッセージを編集</DialogTitle>
          </DialogHeader>
          <Input
            ref={editInputRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="メッセージを編集..."
            className="mt-4"
            autoFocus={false}
          />
          <DialogFooter>
            <Button onClick={() => setEditingMessage(null)}>キャンセル</Button>
            <Button onClick={handleEditMessage}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deletingMessageId !== null} onOpenChange={() => setDeletingMessageId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>メッセージを削除</DialogTitle>
          </DialogHeader>
          <p>このメッセージを削除してもよろしいですか？</p>
          <DialogFooter>
            <Button onClick={() => setDeletingMessageId(null)}>キャンセル</Button>
            <Button
              onClick={async () => {
                if (deletingMessageId) {
                  try {
                    const deleteUrl = API_ROUTES.DELETE_MESSAGE.replace(":messageId", deletingMessageId)
                    const response = await fetch(deleteUrl, {
                      method: "DELETE",
                      credentials: "include",
                    })

                    if (response.ok) {
                      setMessages((prevMessages) => prevMessages.filter((msg) => msg.messageId !== deletingMessageId))
                    } else {
                      console.error("Failed to delete message, status:", response.status)
                    }
                  } catch (error) {
                    console.error("Error deleting message:", error)
                  }
                  setDeletingMessageId(null)
                }
              }}
              variant="destructive"
            >
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


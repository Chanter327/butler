"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, FileText, Edit, Trash2, ArrowLeft } from "lucide-react"
import { API_ROUTES } from "@/config/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

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
  senderName: string
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
  const [isSummarizing, setIsSummarizing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { inputRef: editInputRef, focusInput: focusEditInput } = useInputFocus()

  const fetchMessages = useCallback(async () => {
    setIsLoading(true)
    setMessages([]) // Clear messages when fetching new ones
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
            (message: any) =>
              message &&
              typeof message === "object" &&
              "messageId" in message &&
              "senderId" in message &&
              "senderName" in message &&
              "content" in message &&
              "timestamp" in message,
          )
          setMessages(validMessages)
          setTimeout(scrollToBottom, 0)
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
      const userName = localStorage.getItem("userName") || "Unknown User"

      const tempMessage: Message = {
        messageId: Date.now().toString(),
        senderId: uid,
        senderName: userName,
        content: newMessage.trim(),
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
            content: newMessage.trim(),
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
      scrollToBottom()
    }
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

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const deleteUrl = API_ROUTES.DELETE_MESSAGE.replace(":messageId", messageId)
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.messageId !== messageId))
      } else {
        console.error("Failed to delete message, status:", response.status)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    }
    setDeletingMessageId(null)
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
      toast({
        title: "エラー",
        description: "要約するメッセージが選択されていません。",
        variant: "destructive",
      })
      return
    }

    setIsSummarizing(true)

    const uid = localStorage.getItem("uid")
    if (!uid) {
      console.error("User ID not found")
      setIsSummarizing(false)
      return
    }

    const selectedContent = messages
      .filter((msg) => selectedMessages.includes(msg.messageId))
      .map((msg) => `${msg.senderName}: ${msg.content}`)
      .join("\n\n")

    try {
      const response = await fetch(`${API_ROUTES.CREATE_SUMMARY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          content: selectedContent,
        }),
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "要約作成成功",
          description: `要約ID: ${data.summaryId}`,
        })
      } else {
        throw new Error("Failed to create summary")
      }
    } catch (error) {
      console.error("Error creating summary:", error)
      toast({
        title: "エラー",
        description: "要約の作成中にエラーが発生しました。",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
      setIsSummaryMode(false)
      setSelectedMessages([])
    }
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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b md:hidden">
      <Button 
        onClick={() => {
          setMessages([]);
          window.location.reload();
        }} 
        variant="ghost" 
        size="sm" 
        className="flex items-center"
      >
          <ArrowLeft className="mr-2 h-4 w-4" />
          チャット一覧
      </Button>
      </div>
      <div className="flex-grow overflow-y-scroll h-5 w-[100%] p-5 space-y-4 sm:w-[70vw]">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === localStorage.getItem("uid")
          return (
            <div key={message.messageId} className={`mb-4 w-[100%] group relative`}>
              {isSummaryMode && (
                <Checkbox
                  checked={selectedMessages.includes(message.messageId)}
                  onCheckedChange={() => toggleMessageSelection(message.messageId)}
                  className="mr-2 self-start mt-2"
                />
              )}
              {isOwnMessage && !message.pending && (
                <div className="absolute right-0 top-0 transform -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 bg-white p-1 rounded shadow-md">
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
                  <Button variant="ghost" size="icon" onClick={() => setDeletingMessageId(message.messageId)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">削除</span>
                  </Button>
                </div>
              )}
              <div
                className={`flex ${isOwnMessage ? "flex-row-reverse justify-start" : "flex-row"} items-start space-x-2 max-w-[100%]`}
              >
                {!isOwnMessage && (
                  <Avatar className="mt-1">
                    <AvatarFallback>{message.senderName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${isOwnMessage ? "items-end" : "w-[80%]"}`}>
                  {!isOwnMessage && <span className="text-sm text-gray-500 mb-1">{message.senderName}</span>}
                  <div
                    className={`rounded-lg p-3 w-fit max-w-full ${
                      isOwnMessage
                        ? message.pending
                          ? "bg-blue-300 text-white "
                          : "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    {new Date(message.timestamp).toLocaleString()}
                    {message.pending && " (送信中...)"}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={toggleSummaryMode} variant="outline" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            {isSummaryMode ? "選択モードを解除" : "AIによる要約作成"}
          </Button>
          {isSummaryMode && (
            <Button onClick={handleCreateSummary} variant="primary" disabled={isSummarizing}>
              {isSummarizing ? "要約作成中..." : "選択したメッセージを要約"}
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
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-grow resize-none"
            rows={3}
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
          <Textarea
            ref={editInputRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="メッセージを編集..."
            className="mt-4"
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
            <Button onClick={() => deletingMessageId && handleDeleteMessage(deletingMessageId)} variant="destructive">
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


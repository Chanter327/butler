"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import ChatList from "./components/ChatList"
import ChatArea from "./components/ChatArea"

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [chatType, setChatType] = useState<"dm" | "group">("dm")

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId)
  }

  const handleTabChange = (value: string) => {
    setChatType(value as "dm" | "group")
    setSelectedChat(null) // Clear selected chat when switching tabs
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold">チャット</h1>
        <Link href="/chat/new">
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="dm" className="flex-1 flex flex-col" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dm">ダイレクトメッセージ</TabsTrigger>
          <TabsTrigger value="group">グループチャット</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-hidden">
          <TabsContent value="dm" className="h-full">
            <div className="h-full sm:flex">
              <ChatList type="dm" onSelectChat={handleSelectChat} />
              {selectedChat && <ChatArea key={`dm-${selectedChat}`} chatId={selectedChat} />}
            </div>
          </TabsContent>
          <TabsContent value="group" className="h-full">
            <div className="h-full sm:flex">
              <ChatList type="group" onSelectChat={handleSelectChat} />
              {selectedChat && <ChatArea key={`group-${selectedChat}`} chatId={selectedChat} />}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}


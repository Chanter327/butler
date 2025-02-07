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

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">チャット</h1>
        <Link href="/chat/new">
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <Tabs defaultValue="dm" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="dm">ダイレクトメッセージ</TabsTrigger>
          <TabsTrigger value="group">グループチャット</TabsTrigger>
        </TabsList>
        <div className="flex-grow flex overflow-hidden">
          <TabsContent value="dm" className="flex-grow flex">
            <ChatList type="dm" onSelectChat={setSelectedChat} />
            {selectedChat && <ChatArea chatId={selectedChat} />}
          </TabsContent>
          <TabsContent value="group" className="flex-grow flex">
            <ChatList type="group" onSelectChat={setSelectedChat} />
            {selectedChat && <ChatArea chatId={selectedChat} />}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecentChats() {
  const chats = [
    { id: 1, name: "田中さん", lastMessage: "了解しました。", avatar: "/avatars/tanaka.jpg" },
    { id: 2, name: "営業チーム", lastMessage: "明日の会議について", avatar: "/avatars/sales-team.jpg" },
    {
      id: 3,
      name: "AI アシスタント",
      lastMessage: "何かお手伝いできることはありますか？",
      avatar: "/avatars/ai-assistant.jpg",
    },
  ]

  return (
    <ul className="space-y-4">
      {chats.map((chat) => (
        <li key={chat.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={chat.avatar} alt={chat.name} />
            <AvatarFallback>{chat.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{chat.name}</p>
            <p className="text-sm text-gray-500">{chat.lastMessage}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}


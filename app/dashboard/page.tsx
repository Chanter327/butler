import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import RecentChats from "../components/RecentChats"
import RecentTasks from "../components/RecentTasks"
import RecentSummaries from "../components/RecentSummaries"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>最近のチャット</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentChats />
            <Link href="/chat">
              <Button className="w-full mt-4">すべてのチャットを見る</Button>
            </Link>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>タスク</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTasks />
            <Link href="/tasks">
              <Button className="w-full mt-4">すべてのタスクを見る</Button>
            </Link>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>最近の要約</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSummaries />
            <Link href="/summary">
              <Button className="w-full mt-4">すべての要約を見る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


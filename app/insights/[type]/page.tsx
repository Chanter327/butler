import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, PieChart } from "lucide-react"
import Link from "next/link"
import type React from "react" // Import React

type InsightType = "productivity" | "project-progress" | "time-allocation"

const insightData: Record<InsightType, { title: string; icon: React.ElementType; description: string }> = {
  productivity: {
    title: "生産性トレンド",
    icon: LineChart,
    description: "過去30日間の生産性スコアの推移を表示します。",
  },
  "project-progress": {
    title: "プロジェクト進捗",
    icon: BarChart,
    description: "プロジェクトの進捗状況と完了率を表示します。",
  },
  "time-allocation": {
    title: "時間配分",
    icon: PieChart,
    description: "異なるアクティビティに費やされた時間の割合を表示します。",
  },
}

export default function InsightDetailPage({ params }: { params: { type: InsightType } }) {
  const insight = insightData[params.type]
  const Icon = insight.icon

  return (
    <div className="container mx-auto p-4">
      <Link href="/insights">
        <Button variant="ghost" className="mb-4">
          ← 戻る
        </Button>
      </Link>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-3xl">
            <Icon className="h-8 w-8" />
            <span>{insight.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{insight.description}</p>
          <div className="h-80 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">ここに詳細なチャートやデータが表示されます</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


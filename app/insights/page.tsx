import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, BarChart, PieChart } from "lucide-react"
import Link from "next/link"

export default function InsightsPage() {
  const insights = [
    {
      type: "productivity",
      title: "生産性トレンド",
      icon: LineChart,
      date: "2024/12/12",
      summary: "生産性トレンドサマリー",
    },
    {
      type: "project-progress",
      title: "プロジェクト進捗",
      icon: BarChart,
      date: "2024/12/25",
      summary: "プロジェクト進捗サマリー",
    },
    {
      type: "time-allocation",
      title: "時間配分",
      icon: PieChart,
      date: "2024/12/31",
      summary: "異なるアクティビティに費やされた時間の割合",
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">インサイト</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <Link
              key={insight.type}
              href={`/insights/${insight.type}`}
              className="block hover:shadow-lg transition-shadow duration-300"
            >
              <Card className="h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon className="h-6 w-6" />
                    <span>{insight.title}</span>
                  </CardTitle>
                  <span className="text-sm">作成日: {insight.date}</span>
                </CardHeader>
                <CardContent>
                  <p>{insight.summary}</p>
                  <Button variant="outline" className="mt-4 w-full">
                    詳細を見る
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


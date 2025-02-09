"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { API_ROUTES } from "@/config/api"

type Summary = {
  summaryId: string
  uid: string
  content: string
  summary: string
  timestamp: string
  title: string
}

export default function SummaryDetailPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_ROUTES.GET_SUMMARY}?summaryId=${params.id}`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("サーバーからのレスポンスが正常ではありません。")
        }
        const data: Summary = await response.json()
        setSummary(data)
      } catch (err) {
        setError("要約の取得中にエラーが発生しました。")
        console.error("Error fetching summary:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [params.id])

  const parseJsonFromString = (text: string) => {
    try {
      const jsonMatch = text.match(/```json\s*({[\s\S]*?})\s*```/)
      if (!jsonMatch) return { title: "", summary: "" }

      const jsonStr = jsonMatch[1]
      const parsed = JSON.parse(jsonStr)
      return {
        title: parsed.title || "",
        summary: parsed.summary || "",
      }
    } catch (err) {
      console.error("JSON解析エラー:", err)
      return { title: "", summary: "" }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || "要約が見つかりません。"}</p>
        <Button onClick={() => router.push("/summary")}>要約一覧に戻る</Button>
      </div>
    )
  }

  const { title, summary: parsedSummary } = parseJsonFromString(summary.summary)

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => router.push("/summary")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        要約一覧に戻る
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title || "無題"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-500">作成日時: {new Date(summary.timestamp).toLocaleString()}</p>
          <h3 className="text-lg font-semibold mb-2">要約:</h3>
          <p className="mb-6 whitespace-pre-line">{parsedSummary}</p>
          <h3 className="text-lg font-semibold mb-2">元のコンテンツ:</h3>
          <p className="whitespace-pre-line">{summary.content}</p>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { API_ROUTES } from "@/config/api"
import Link from "next/link"

type Summary = {
  summaryId: string
  uid: string
  content: string
  summary: string
  timestamp: string
  title: string
}

export default function SummariesPage() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsLoading(true)
      setError(null)
      const uid = localStorage.getItem("uid")
      if (!uid) {
        setError("ユーザーIDが見つかりません。再度ログインしてください。")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_ROUTES.GET_SUMMARIES}?uid=${uid}`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("サーバーからのレスポンスが正常ではありません。")
        }
        const data: { summaries: Summary[] } = await response.json()
        setSummaries(data.summaries)
      } catch (err) {
        setError("要約の取得中にエラーが発生しました。")
        console.error("Error fetching summaries:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaries()
  }, [])

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

  const truncateSummary = (text: string, maxLength = 70) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>再試行</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <h1 className="text-3xl font-bold p-4">要約一覧</h1>
      <div className="flex-grow overflow-y-auto p-4 pb-8">
        {summaries.length === 0 ? (
          <p className="text-center text-gray-500">要約はまだありません。</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {summaries.map((summary) => {
              const { title, summary: parsedSummary } = parseJsonFromString(summary.summary)
              return (
                <Card key={summary.summaryId} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{title || "無題"}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="mb-2 text-sm text-gray-500">
                      作成日時: {new Date(summary.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm whitespace-pre-line">{truncateSummary(parsedSummary)}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/summary/${summary.summaryId}`} passHref>
                      <Button className="w-full">詳細を見る</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


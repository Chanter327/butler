"use client"

import { FileText } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { API_ROUTES } from "@/config/api"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type Summary = {
  summaryId: string
  uid: string
  content: string
  summary: string
  timestamp: string
  title: string
}

export default function RecentSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentSummaries = async () => {
      setIsLoading(true)
      setError(null)
      const uid = localStorage.getItem("uid")
      if (!uid) {
        setError("ユーザーIDが見つかりません。再度ログインしてください。")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_ROUTES.GET_RECENT_SUMMARIES}?uid=${uid}`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("サーバーからのレスポンスが正常ではありません。")
        }
        const data: { summaries: Summary[] } = await response.json()
        setSummaries(data.summaries)
      } catch (err) {
        setError("要約の取得中にエラーが発生しました。")
        console.error("Error fetching sumaries:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentSummaries()
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
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
    <ul className="space-y-2">
        {summaries.map((summary) => {
          const { title } = parseJsonFromString(summary.summary)
          return (
            <Link href={`/summary/${summary.summaryId}`} key={summary.summaryId} className="block mb-2 border-b border-gray-300">
              <FileText size={16} />
              <p className="text-sm font-bold">{title || "無題"}</p>
              <p className="text-xs text-gray-500">作成日時: {formatTimestamp(summary.timestamp)}</p>
            </Link>
          )
        })}
    </ul>
  )
}


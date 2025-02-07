import { FileText } from "lucide-react"

export default function RecentSummaries() {
  const summaries = [
    { id: 1, title: "週次ミーティングの要約", date: "2023-06-01" },
    { id: 2, title: "プロジェクト進捗レポート", date: "2023-05-28" },
    { id: 3, title: "市場調査結果", date: "2023-05-25" },
  ]

  return (
    <ul className="space-y-2">
      {summaries.map((summary) => (
        <li key={summary.id} className="flex items-center space-x-2">
          <FileText size={16} />
          <span className="text-sm">{summary.title}</span>
          <span className="text-xs text-gray-500">{summary.date}</span>
        </li>
      ))}
    </ul>
  )
}


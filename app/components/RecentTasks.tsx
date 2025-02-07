import { Checkbox } from "@/components/ui/checkbox"

export default function RecentTasks() {
  const tasks = [
    { id: 1, title: "プレゼンテーションの準備", completed: false },
    { id: 2, title: "クライアントとの電話", completed: true },
    { id: 3, title: "週報の提出", completed: false },
  ]

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center space-x-2">
          <Checkbox id={`task-${task.id}`} checked={task.completed} />
          <label
            htmlFor={`task-${task.id}`}
            className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}
          >
            {task.title}
          </label>
        </li>
      ))}
    </ul>
  )
}


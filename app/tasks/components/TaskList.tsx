import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Task } from "../page"

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => onToggle(task.id)} />
            <label htmlFor={task.id} className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
              {task.title}
            </label>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}


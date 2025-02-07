"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TaskList from "./components/TaskList"
import AddTaskDialog from "./components/AddTaskDialog"

export type Task = {
  id: string
  title: string
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "プロジェクト計画書の作成", completed: false },
    { id: "2", title: "クライアントミーティングの準備", completed: true },
    { id: "3", title: "週次レポートの提出", completed: false },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">タスク</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> 新規タスク
          </Button>
        </CardHeader>
        <CardContent>
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </CardContent>
      </Card>
      <AddTaskDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onAdd={addTask} />
    </div>
  )
}


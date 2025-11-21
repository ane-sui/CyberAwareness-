"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Zap } from "lucide-react"

interface QuizCardProps {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
}

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-900 text-green-200",
  Intermediate: "bg-yellow-900 text-yellow-200",
  Advanced: "bg-red-900 text-red-200",
}

export function QuizCard({ id, title, description, difficulty, category }: QuizCardProps) {
  return (
    <Card className="border-slate-700 bg-slate-800 hover:border-blue-600 transition-colors h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              {title}
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1">{category}</CardDescription>
          </div>
          <Badge className={difficultyColors[difficulty] || "bg-slate-700 text-slate-200"}>{difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <p className="text-slate-300 text-sm">{description}</p>
        <Link href={`/quiz/${id}`} className="mt-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Start Challenge
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

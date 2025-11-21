"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Trophy, BarChart3, ArrowLeft } from "lucide-react"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  quizTitle: string
}

export function QuizResults({ score, totalQuestions, quizTitle }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const passed = percentage >= 70

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Perfect Score! Outstanding performance!"
    if (percentage >= 80) return "Excellent! You have strong cybersecurity knowledge."
    if (percentage >= 70) return "Good job! You passed the challenge."
    if (percentage >= 50) return "Not bad, but keep learning to improve."
    return "Keep practicing to strengthen your cybersecurity skills."
  }

  return (
    <Card className="border-slate-700 bg-slate-800 w-full">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          <CardTitle>Quiz Complete!</CardTitle>
        </div>
        <CardDescription className="text-blue-100">{quizTitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{percentage}%</div>
              <div className="text-sm text-blue-100">Score</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {score} out of {totalQuestions}
          </h3>
          <p className="text-slate-300 mb-4">{getPerformanceMessage()}</p>
          <Badge className={passed ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"}>
            {passed ? "Passed" : "Keep Learning"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{score}</div>
            <div className="text-sm text-slate-400">Correct Answers</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">{totalQuestions - score}</div>
            <div className="text-sm text-slate-400">Incorrect Answers</div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View All Challenges
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

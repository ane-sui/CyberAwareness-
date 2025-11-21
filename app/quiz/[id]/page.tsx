"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizResults } from "@/components/quiz-results"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question_text: string
  correct_answer: string
  explanation: string
  answer_options: Array<{
    id: string
    option_text: string
    is_correct: boolean
  }>
}

interface Quiz {
  id: string
  title: string
  description: string
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const supabase = createClient()

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUserId(user.id)

        // Fetch quiz
        const { data: quizData, error: quizError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", quizId)
          .single()

        if (quizError) throw quizError
        setQuiz(quizData)

        // Fetch questions with answer options
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select(
            `
            id,
            question_text,
            correct_answer,
            explanation,
            answer_options (
              id,
              option_text,
              is_correct
            )
          `,
          )
          .eq("quiz_id", quizId)

        if (questionsError) throw questionsError
        setQuestions(questionsData || [])
      } catch (error) {
        console.error("Error fetching quiz data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizData()
  }, [quizId, router])

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz complete - save score
      if (userId && quiz) {
        try {
          const supabase = createClient()
          const percentage = Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100)

          // Save score
          await supabase.from("user_scores").insert({
            user_id: userId,
            quiz_id: quizId,
            score: score + (isCorrect ? 1 : 0),
            total_questions: questions.length,
            percentage: percentage,
          })

          // Update user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("total_score, quizzes_completed")
            .eq("id", userId)
            .single()

          if (profile) {
            await supabase
              .from("profiles")
              .update({
                total_score: (profile.total_score || 0) + (score + (isCorrect ? 1 : 0)),
                quizzes_completed: (profile.quizzes_completed || 0) + 1,
              })
              .eq("id", userId)
          }
        } catch (error) {
          console.error("Error saving score:", error)
        }
      }

      setIsComplete(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-svh bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-svh bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white mb-4">Quiz not found or has no questions.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-white mb-4 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
          <p className="text-slate-400 mt-2">{quiz.description}</p>
        </div>

        {/* Quiz Content */}
        {!isComplete ? (
          <QuizQuestion
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            questionText={questions[currentQuestionIndex].question_text}
            explanation={questions[currentQuestionIndex].explanation}
            options={questions[currentQuestionIndex].answer_options}
            onAnswer={handleAnswer}
          />
        ) : (
          <QuizResults score={score} totalQuestions={questions.length} quizTitle={quiz.title} />
        )}
      </div>
    </div>
  )
}

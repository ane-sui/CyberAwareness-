"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizCard } from "@/components/quiz-card"
import { TipOfDayModal } from "@/components/tip-of-day-modal"
import { useRouter } from "next/navigation"
import { LogOut, User, Award, BookOpen } from "lucide-react"

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
  category: string
}

interface UserStats {
  total_score: number
  quizzes_completed: number
}

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [showTip, setShowTip] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
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

        setUserEmail(user.email || null)

        // Fetch quizzes
        const { data: quizzesData, error: quizzesError } = await supabase.from("quizzes").select("*")

        if (quizzesError) throw quizzesError
        setQuizzes(quizzesData || [])

        // Fetch user stats
        const { data: statsData, error: statsError } = await supabase
          .from("profiles")
          .select("total_score, quizzes_completed")
          .eq("id", user.id)
          .single()

        if (statsError && statsError.code !== "PGRST116") {
          throw statsError
        }

        if (statsData) {
          setUserStats(statsData)
        } else {
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            total_score: 0,
            quizzes_completed: 0,
          })

          if (insertError && insertError.code !== "23505") {
            throw insertError
          }

          setUserStats({
            total_score: 0,
            quizzes_completed: 0,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-svh bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-900 to-slate-800">
      {showTip && <TipOfDayModal onClose={() => setShowTip(false)} />}

      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">CyberGuard</h1>
            <p className="text-slate-400 text-sm">Cybersecurity Awareness Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="text-white font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {userEmail}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-400" />
                Total Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats?.total_score || 0}</div>
              <p className="text-xs text-slate-400 mt-1">Points earned</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-400" />
                Quizzes Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats?.quizzes_completed || 0}</div>
              <p className="text-xs text-slate-400 mt-1">Challenges finished</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Available Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{quizzes.length}</div>
              <p className="text-xs text-slate-400 mt-1">Ready to take</p>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Phishing Awareness Challenges</h2>
            <p className="text-slate-400">
              Test your knowledge and improve your cybersecurity skills with our interactive challenges
            </p>
          </div>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  difficulty={quiz.difficulty}
                  category={quiz.category}
                />
              ))}
            </div>
          ) : (
            <Card className="border-slate-700 bg-slate-800">
              <CardContent className="pt-8 text-center">
                <p className="text-slate-400">No challenges available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

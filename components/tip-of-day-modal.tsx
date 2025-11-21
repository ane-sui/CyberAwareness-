"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Lightbulb } from "lucide-react"

interface Tip {
  id: string
  title: string
  content: string
  category: string
}

interface TipOfDayModalProps {
  onClose: () => void
}

export function TipOfDayModal({ onClose }: TipOfDayModalProps) {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("tips").select("*")

        if (error) throw error

        if (data && data.length > 0) {
          // Get a random tip
          const randomTip = data[Math.floor(Math.random() * data.length)]
          setTip(randomTip)
        }
      } catch (error) {
        console.error("Error fetching tip:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTip()
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <CardTitle>Tip of the Day</CardTitle>
          </div>
          {tip && <CardDescription className="text-blue-100">{tip.category}</CardDescription>}
        </CardHeader>
        <CardContent className="pt-6">
          {tip ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                <p className="text-slate-300 leading-relaxed">{tip.content}</p>
              </div>
              <div className="flex items-start gap-2 bg-blue-900/30 p-3 rounded-lg border border-blue-700/50">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
                  Remember: Stay vigilant and always verify before clicking links or sharing information.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-300">No tips available at the moment.</p>
          )}
          <Button onClick={onClose} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
            Got it!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

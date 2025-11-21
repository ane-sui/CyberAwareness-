"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"

interface AnswerOption {
  id: string
  option_text: string
  is_correct: boolean
}

interface QuizQuestionProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  explanation: string
  options: AnswerOption[]
  onAnswer: (isCorrect: boolean) => void
}

export function QuizQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  explanation,
  options,
  onAnswer,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const correct = options.find((opt) => opt.id === selectedAnswer)?.is_correct || false
    setIsCorrect(correct)
    setSubmitted(true)
  }

  const handleNext = () => {
    if (isCorrect !== null) {
      onAnswer(isCorrect)
      setSelectedAnswer(null)
      setSubmitted(false)
      setIsCorrect(null)
    }
  }

  return (
    <Card className="border-slate-700 bg-slate-800 w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="text-sm text-slate-400">
            {questionNumber}/{totalQuestions}
          </div>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">{questionText}</h3>
        </div>

        <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} disabled={submitted}>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} className="border-slate-500" />
                <Label
                  htmlFor={option.id}
                  className={`flex-1 p-3 rounded-lg cursor-pointer transition-colors ${
                    submitted
                      ? option.is_correct
                        ? "bg-green-900/30 border border-green-700 text-green-200"
                        : selectedAnswer === option.id && !option.is_correct
                          ? "bg-red-900/30 border border-red-700 text-red-200"
                          : "bg-slate-700 text-slate-300"
                      : selectedAnswer === option.id
                        ? "bg-blue-900/30 border border-blue-700 text-blue-200"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {option.option_text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {submitted && (
          <div
            className={`p-4 rounded-lg border flex gap-3 ${
              isCorrect
                ? "bg-green-900/20 border-green-700 text-green-200"
                : "bg-red-900/20 border-red-700 text-red-200"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
              <p className="text-sm">{explanation}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {questionNumber === totalQuestions ? "See Results" : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

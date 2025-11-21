import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-sm">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Check your email</CardTitle>
            <CardDescription className="text-slate-400">
              We&apos;ve sent you a confirmation link to verify your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-slate-300">
              Please check your email and click the confirmation link to activate your account. You can then log in with
              your credentials.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

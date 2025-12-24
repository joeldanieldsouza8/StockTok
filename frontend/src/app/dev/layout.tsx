import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default function DevLayout({ children }: { children: ReactNode }) {
  // Only allow access in development mode
  if (process.env.NODE_ENV === "production") {
    redirect("/")
  }

  return (
    <>
      {/* Dev Mode Banner */}
      <div className="bg-orange-500 text-white text-center py-2 text-sm font-semibold">
        🔧 DEVELOPMENT MODE - This page is not available in production
      </div>
      {children}
    </>
  )
}

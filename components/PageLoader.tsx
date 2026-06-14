import { Database } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Expanding ripples */}
        <div className="absolute w-full h-full border-4 border-primary/20 rounded-full animate-[ping_2s_ease-in-out_infinite]" />
        <div className="absolute w-16 h-16 border-4 border-primary/40 rounded-full animate-[ping_1.5s_ease-in-out_infinite]" />
        
        {/* Solid center dot/icon */}
        <div className="z-10 flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg">
          <Database className="w-5 h-5 text-primary-foreground animate-pulse" />
        </div>
      </div>
    </div>
  )
}
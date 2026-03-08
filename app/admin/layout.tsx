// import AdminLayoutClient from "./AdminLayoutClient"
import AdminLayoutClient from "@/components/AdminLayoutClient"
import { getSession } from "@/lib/actions/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // No session = show page as-is (proxy.ts will redirect to login if needed)
  if (!session) {
    return <>{children}</>
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}



// import { redirect } from "next/navigation"
// // import AdminLayoutClient from "./AdminLayoutClient"
// import AdminLayoutClient from "@/components/AdminLayoutClient"
// import { getSession } from "@/lib/actions/auth"

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // This runs on the server — check the JWT cookie directly
//   const session = await getSession()

//   // If not logged in and not already on login page, redirect
//   // (login page has its own layout-free rendering — see below)
//   if (!session) {
//     redirect("/admin/login")
//   }

//   return <AdminLayoutClient>{children}</AdminLayoutClient>
// }








// "use client"

// import React from "react"

// import { useEffect, useState } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import Link from "next/link"
// import { mockDb } from "@/lib/mock-db"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import {
//   LayoutDashboard,
//   FolderKanban,
//   User,
//   Sparkles,
//   LogOut,
//   Menu,
//   X,
//   Home,
//   Moon,
//   Sun,
// } from "lucide-react"
// import { useTheme } from "next-themes"

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const [mounted, setMounted] = useState(false)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const { resolvedTheme, setTheme } = useTheme()

//   useEffect(() => {
//     setMounted(true)
//     const auth = mockDb.isAuthenticated()
//     setIsAuthenticated(auth)
//     if (!auth && pathname !== "/admin/login") {
//       router.push("/admin/login")
//     }
//   }, [pathname, router])

//   const handleLogout = () => {
//     mockDb.logout()
//     router.push("/admin/login")
//   }

//   // Show login page without sidebar
//   if (pathname === "/admin/login") {
//     return <>{children}</>
//   }

//   // Don't render anything until we check auth
//   if (!mounted || !isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
//       </div>
//     )
//   }

//   const navItems = [
//     { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
//     { href: "/admin/projects", label: "Projects", icon: FolderKanban },
//     { href: "/admin/profile", label: "Profile", icon: User },
//     { href: "/admin/skills", label: "Skills", icon: Sparkles },
//   ]

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Header */}
//       <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center justify-between px-4">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setSidebarOpen(true)}
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//         <span className="font-semibold">Admin Dashboard</span>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
//         >
//           {resolvedTheme === "dark" ? (
//             <Sun className="h-5 w-5" />
//           ) : (
//             <Moon className="h-5 w-5" />
//           )}
//         </Button>
//       </header>

//       {/* Mobile Sidebar Overlay */}
//       {sidebarOpen && (
//         <div
//           className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="flex flex-col h-full">
//           {/* Sidebar Header */}
//           <div className="h-16 flex items-center justify-between px-4 border-b border-border">
//             <Link href="/admin" className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
//                 <span className="text-primary-foreground font-bold text-sm">
//                   OS
//                 </span>
//               </div>
//               <span className="font-semibold">Admin</span>
//             </Link>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4 space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon
//               const isActive = pathname === item.href
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setSidebarOpen(false)}
//                   className={cn(
//                     "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
//                     isActive
//                       ? "bg-primary text-primary-foreground"
//                       : "text-muted-foreground hover:text-foreground hover:bg-muted"
//                   )}
//                 >
//                   <Icon className="h-5 w-5" />
//                   {item.label}
//                 </Link>
//               )
//             })}
//           </nav>

//           {/* Sidebar Footer */}
//           <div className="p-4 border-t border-border space-y-2">
//             <Link
//               href="/"
//               className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//             >
//               <Home className="h-5 w-5" />
//               View Site
//             </Link>
//             <button
//               onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
//               className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//             >
//               {resolvedTheme === "dark" ? (
//                 <>
//                   <Sun className="h-5 w-5" />
//                   Light Mode
//                 </>
//               ) : (
//                 <>
//                   <Moon className="h-5 w-5" />
//                   Dark Mode
//                 </>
//               )}
//             </button>
//             <button
//               onClick={handleLogout}
//               className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
//             >
//               <LogOut className="h-5 w-5" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
//         <div className="p-4 sm:p-6 lg:p-8">{children}</div>
//       </main>
//     </div>
//   )
// }

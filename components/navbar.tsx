"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Home, User, LogIn, LogOut, Settings, FileText, Folder } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { logout } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const pathname = usePathname()
  const { user, setUser, isLoading } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">EditorialHub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60",
              )}
            >
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            {!isLoading && user && (
              <>
                <Link
                  href="/blog/posts"
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname?.startsWith("/blog/posts") ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  Posts
                </Link>
                <Link
                  href="/blog/categories"
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname?.startsWith("/blog/categories") ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <Folder className="mr-1 h-4 w-4" />
                  Categories
                </Link>
                <Link
                  href="/blog/settings"
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname?.startsWith("/blog/settings") ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <Settings className="mr-1 h-4 w-4" />
                  Blog Settings
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname?.startsWith("/profile") ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <User className="mr-1 h-4 w-4" />
                  Profile
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="mr-1 h-4 w-4" />
                  {user.username}
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="mr-1 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">
                <LogIn className="mr-1 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Home, User, LogIn, LogOut, Settings, FileText, Folder, BookOpen, ChevronDown, PenSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { logout } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser, isLoading } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (!accessToken||!refreshToken) {
        throw new Error("No access token found. You may already be logged out.");
      }
      await logout(refreshToken)
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

  const handleWritePost = () => {
    router.push("/create-post")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">EditorialHub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {!isLoading && user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center text-sm font-medium transition-colors hover:text-foreground/80"
                    >
                      <BookOpen className="mr-1 h-4 w-4" />
                      My Blog
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <Link href="/blog/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Blog Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/blog/categories" className="flex items-center">
                        <Folder className="mr-2 h-4 w-4" />
                        Categories
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/blog/posts" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Posts
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="default" size="sm" onClick={handleWritePost} className="flex items-center gap-1 mt-1">
                  <PenSquare className="h-4 w-4" />
                  Write Post
                </Button>
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname?.startsWith("/profile") ? "text-foreground" : "text-foreground/60",
                  )}
                >
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


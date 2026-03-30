import { ReactNode } from "react";
import { Link } from "wouter";
import { ShieldPlus, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <ShieldPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground block leading-none">MediCard</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Emergency Profile</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/profile/new">
              <Button className="rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                Create Profile
              </Button>
            </Link>
            {user ? (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full cursor-pointer py-2 font-medium">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/new" className="w-full cursor-pointer py-2 font-medium text-primary">Create Profile</Link>
                </DropdownMenuItem>
                {user ? (
                  <DropdownMenuItem asChild>
                    <button
                      type="button"
                      className="w-full cursor-pointer py-2 font-medium text-destructive"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="w-full cursor-pointer py-2 font-medium">Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="w-full cursor-pointer py-2 font-medium text-primary">Sign up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8 bg-background/50">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
            <ShieldPlus className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-lg">MediCard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Scan. Save. Survive. Provide critical information when every second counts.
          </p>
        </div>
      </footer>
    </div>
  );
}

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ListChecks, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <span className="text-lg text-rose-500">
          Cyber<strong className="text-purple-950">zone</strong>
        </span>
        <span className="text-lg text-bleu-950">Vola</span>
      </Link>
      {!isAuthRoute && (
        <nav className="hidden md:flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/movements">
              <ListChecks className="h-4 w-4 mr-2" />
              Mouvements
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      )}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </header>
  );
}

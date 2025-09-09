"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Home, ListChecks, User, LogOut, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const { status } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        {!isAuthRoute && (
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/movements"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <ListChecks className="h-5 w-5" />
              Mouvements
            </Link>
            <Link
              href="/trosa"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <CreditCard className="h-5 w-5" />
              Trosa
            </Link>
            <Link
              href="/profile"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <User className="h-5 w-5" />
              Profil
            </Link>
            {status === "authenticated" && (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/auth/login" });
                  setOpen(false);
                }}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-red-600 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </button>
            )}
          </nav>
        )}
        <div className="mt-4 flex items-center gap-4 mx-[-0.65rem] px-3 py-2">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">S'inscrire</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Créez un compte pour commencer.
          </p>
        </div>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input id="username" type="text" placeholder="john_doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            S'inscrire
          </Button>
          <div className="text-center text-sm">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="underline">
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

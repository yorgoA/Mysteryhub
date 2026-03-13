import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen pt-24 items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-neutral-400 text-center mb-8">
          Sign in to continue your investigations
        </p>
        <AuthForm mode="sign-in" />
        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-mystery-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

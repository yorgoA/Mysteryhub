import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen pt-24 items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-white text-center mb-2">
          Join the hunt
        </h1>
        <p className="text-neutral-400 text-center mb-8">
          Create an account to start solving mysteries
        </p>
        <AuthForm mode="sign-up" />
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-mystery-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

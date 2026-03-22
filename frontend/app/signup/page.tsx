"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import FloatingBlobs from "@/components/FloatingBlobs";
import { Loader2, ArrowRight, Eye, EyeOff, Check } from "lucide-react";

const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

const Signup = () => {
  const { signup, user } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  // ✅ FIXED STATES
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Redirect if logged in
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  // ✅ Animation
  useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      { y: 24, opacity: 0, filter: "blur(6px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
      }
    );
  }, []);

  // ✅ SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!PASSWORD_RULES.every((r) => r.test(password))) {
      setError("Password doesn't meet requirements");
      return;
    }

    try {
      setIsLoading(true);

      // 🔥 FIXED CALL
      await signup(`${firstName} ${lastName}`, email, password);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6">
      <FloatingBlobs />

      <div ref={formRef} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">
              Snip
            </span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>

          <p className="mt-2 text-muted-foreground text-sm">
            Start shortening links in seconds
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl bg-card border border-border card-shadow space-y-5"
        >
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-100 border text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* FIRST NAME */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none"
            />
          </div>

          {/* LAST NAME */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {password && (
              <ul className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      rule.test(password)
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Create account <ArrowRight />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
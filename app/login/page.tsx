"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function LoginForm() {
  const params = useSearchParams()
  const next = params.get("next") ?? "/"
  const linkError = params.get("error") === "link"

  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  )
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState("sending")
    const supabase = createClient()
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    })
    if (error) {
      setState("error")
      setMessage(error.message)
    } else {
      setState("sent")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070d18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: "1.7em", lineHeight: 1 }}>🐝</span>
          <span
            style={{
              fontSize: "1.5em",
              fontWeight: 900,
              color: "#f6c90e",
              letterSpacing: "2.5px",
            }}
          >
            HIVE
          </span>
        </div>

        {state === "sent" ? (
          <div
            style={{
              background: "rgba(90,173,138,0.08)",
              border: "1px solid rgba(90,173,138,0.3)",
              borderRadius: 12,
              padding: 24,
              color: "#c8d8e8",
            }}
          >
            <p style={{ fontWeight: 700, color: "#5aad8a", marginBottom: 8 }}>
              Check your email
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
              We sent a sign-in link to <strong>{email}</strong>. Open it on
              this device to continue.
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                color: "#fff",
                fontSize: "1.4rem",
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                color: "#6b8aa0",
                fontSize: "0.88rem",
                marginBottom: 22,
                lineHeight: 1.5,
              }}
            >
              Enter your work email and we&apos;ll send you a secure sign-in
              link — no password needed.
            </p>

            {linkError && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.25)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 16,
                }}
              >
                That sign-in link was invalid or expired. Please request a new
                one.
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                required
                placeholder="you@organisation.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0c1829",
                  border: "1px solid #1e2d40",
                  borderRadius: 8,
                  padding: "11px 14px",
                  color: "#fff",
                  fontSize: "0.9rem",
                  marginBottom: 14,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={state === "sending"}
                style={{
                  width: "100%",
                  background: "#f6c90e",
                  color: "#0b1220",
                  fontWeight: 800,
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 14px",
                  fontSize: "0.9rem",
                  cursor: state === "sending" ? "default" : "pointer",
                  opacity: state === "sending" ? 0.6 : 1,
                }}
              >
                {state === "sending" ? "Sending…" : "Send sign-in link"}
              </button>
            </form>

            {state === "error" && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                  marginTop: 12,
                }}
              >
                {message || "Something went wrong. Please try again."}
              </p>
            )}

            <p
              style={{
                color: "#2a3d52",
                fontSize: "0.72rem",
                marginTop: 22,
                lineHeight: 1.5,
              }}
            >
              Don&apos;t have access yet?{" "}
              <a
                href="https://impactanalyticsaustralia.com.au/#contact"
                style={{ color: "#6b8aa0", textDecoration: "underline" }}
              >
                Book a demo
              </a>{" "}
              to get set up.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

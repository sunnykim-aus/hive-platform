"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function LoginForm() {
  const params = useSearchParams()
  const next = params.get("next") ?? "/"

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    setBusy(false)
    if (error) {
      setError(error.message)
    } else {
      setStep("code")
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    })
    if (error) {
      setBusy(false)
      setError("That code is invalid or expired. Check the latest email or resend.")
      return
    }
    // Session cookie is set — full navigation so the server (proxy) sees it.
    window.location.assign(next)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0c1829",
    border: "1px solid #1e2d40",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#fff",
    fontSize: "0.9rem",
    marginBottom: 14,
    outline: "none",
  }
  const buttonStyle: React.CSSProperties = {
    width: "100%",
    background: "#f6c90e",
    color: "#0b1220",
    fontWeight: 800,
    border: "none",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: "0.9rem",
    cursor: busy ? "default" : "pointer",
    opacity: busy ? 0.6 : 1,
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <span style={{ fontSize: "1.7em", lineHeight: 1 }}>🐝</span>
          <span style={{ fontSize: "1.5em", fontWeight: 900, color: "#f6c90e", letterSpacing: "2.5px" }}>
            HIVE
          </span>
        </div>

        {step === "email" ? (
          <>
            <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 800, marginBottom: 6 }}>
              Sign in
            </h1>
            <p style={{ color: "#6b8aa0", fontSize: "0.88rem", marginBottom: 22, lineHeight: 1.5 }}>
              Enter your work email and we&apos;ll send you a 6-digit sign-in code.
            </p>
            <form onSubmit={sendCode}>
              <input
                type="email"
                required
                placeholder="you@organisation.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <button type="submit" disabled={busy} style={buttonStyle}>
                {busy ? "Sending…" : "Send sign-in code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 800, marginBottom: 6 }}>
              Enter your code
            </h1>
            <p style={{ color: "#6b8aa0", fontSize: "0.88rem", marginBottom: 22, lineHeight: 1.5 }}>
              We sent a 6-digit code to <strong style={{ color: "#c8d8e8" }}>{email}</strong>. Enter
              it below to continue.
            </p>
            <form onSubmit={verifyCode}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ ...inputStyle, letterSpacing: "0.4em", fontSize: "1.1rem", textAlign: "center" }}
              />
              <button type="submit" disabled={busy} style={buttonStyle}>
                {busy ? "Verifying…" : "Verify & sign in"}
              </button>
            </form>
            <button
              onClick={() => { setStep("email"); setCode(""); setError("") }}
              style={{
                background: "none",
                border: "none",
                color: "#6b8aa0",
                fontSize: "0.78rem",
                marginTop: 14,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Use a different email / resend
            </button>
          </>
        )}

        {error && (
          <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: 12 }}>{error}</p>
        )}

        <p style={{ color: "#2a3d52", fontSize: "0.72rem", marginTop: 22, lineHeight: 1.5 }}>
          Don&apos;t have access yet?{" "}
          <a
            href="https://impactanalyticsaustralia.com.au/#contact"
            style={{ color: "#6b8aa0", textDecoration: "underline" }}
          >
            Book a demo
          </a>{" "}
          to get set up.
        </p>
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

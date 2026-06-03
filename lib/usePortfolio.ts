"use client"
import { useState, useEffect } from "react"
import { loadPortfolio, getPortfolioInsights, type UserPortfolio } from "./portfolio"

export interface PortfolioContext {
  portfolio: UserPortfolio | null
  insights: ReturnType<typeof getPortfolioInsights> | null
  hasPortfolio: boolean
  loaded: boolean
}

export function usePortfolio(): PortfolioContext {
  const [ctx, setCtx] = useState<PortfolioContext>({
    portfolio: null, insights: null, hasPortfolio: false, loaded: false,
  })

  useEffect(() => {
    const p = loadPortfolio()
    setCtx({
      portfolio: p,
      insights: p ? getPortfolioInsights(p) : null,
      hasPortfolio: !!(p?.org_name),
      loaded: true,
    })
  }, [])

  return ctx
}

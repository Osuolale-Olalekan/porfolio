"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type PortfolioType = "developer" | "artist"

interface PortfolioContextType {
  activePortfolio: PortfolioType
  setActivePortfolio: (portfolio: PortfolioType) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [activePortfolio, setActivePortfolio] = useState<PortfolioType>("developer")

  return (
    <PortfolioContext.Provider value={{ activePortfolio, setActivePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider")
  }
  return context
}

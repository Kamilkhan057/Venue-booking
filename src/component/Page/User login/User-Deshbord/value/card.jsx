import React from "react"

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white border rounded-lg shadow p-4 ${className}`}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children }) => (
  <div className="mb-2">{children}</div>
)

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
)

export const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
)

export const CardContent = ({ children }) => (
  <div className="mt-2">{children}</div>
)

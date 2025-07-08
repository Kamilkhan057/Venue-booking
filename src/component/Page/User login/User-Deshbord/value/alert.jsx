import React from "react"

export const Alert = ({ children }) => {
  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
      {children}
    </div>
  )
}

export const AlertDescription = ({ children }) => {
  return <p className="text-sm text-blue-800">{children}</p>
}

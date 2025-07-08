import React from "react"

export const Badge = ({ children, variant = "default" }) => {
  const base = "px-2 py-1 text-sm rounded";
  const variants = {
    default: "bg-blue-500 text-white",
    outline: "border border-gray-300 text-gray-700",
  }

  return (
    <span className={`${base} ${variants[variant] || variants.default}`}>
      {children}
    </span>
  )
}

import React from "react"

export const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`border p-2 rounded w-full resize-none focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      {...props}
    />
  )
}

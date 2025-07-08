import React from "react"

export const Checkbox = ({ id, className = "", ...props }) => {
  return (
    <input
      type="checkbox"
      id={id}
      className={`form-checkbox h-5 w-5 text-blue-600 ${className}`}
      {...props}
    />
  )
}

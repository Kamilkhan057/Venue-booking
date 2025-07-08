import React, { useState } from "react"

export const Select = ({ children }) => {
  return <div className="relative">{children}</div>
}

export const SelectTrigger = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`border p-2 rounded w-full text-left ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const SelectContent = ({ children }) => {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
      {children}
    </div>
  )
}

export const SelectItem = ({ children, onClick }) => {
  return (
    <div
      className="p-2 hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const SelectValue = ({ placeholder }) => {
  return <span className="text-gray-500">{placeholder}</span>
}

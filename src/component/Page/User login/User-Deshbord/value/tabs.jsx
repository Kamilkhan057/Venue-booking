import React, { useState } from "react"

export const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const context = { activeTab, setActiveTab }

  return (
    <div className="w-full space-y-4">
      {React.Children.map(children, child =>
        React.cloneElement(child, { context })
      )}
    </div>
  )
}

export const TabsList = ({ children }) => {
  return <div className="flex gap-2">{children}</div>
}

export const TabsTrigger = ({ value, children, context }) => {
  const isActive = context.activeTab === value
  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={`px-4 py-2 rounded ${isActive ? "bg-blue-500 text-white" : "bg-gray-200"}`}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children, context }) => {
  return context.activeTab === value ? <div>{children}</div> : null
}

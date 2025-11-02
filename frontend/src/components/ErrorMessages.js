import React from "react"


function ErrorMessages(props) {
  const {errors} = props

  return (
    <div className="flex flex-col h-full justify-center px-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Transaction Management System</h1>
      <div className="h-3/4">
        <span className="bg-red-200 px-4 py-2 rounded-md border text-red-800">{errors}</span>
      </div>
    </div>
  )
}

export default ErrorMessages
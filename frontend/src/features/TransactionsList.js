import { use, useEffect, useState } from "react"
import AddTransaction from "./AddTransaction"
import ErrorMessages from "../components/ErrorMessages"

function TransactionsList(){

  const [transactions, setTransactions] = useState()
  const [transactionHeaders, setTransactionHeaders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [errors, setErrors] = useState()
  const [reload, setReload] = useState(false)
  const [message, setMessage] = useState()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    getTransactions()
  }, [reload])

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsVisible(false)
    }, 2000);
    return () => clearTimeout(timerId);
  }, [message])

  const getTransactions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/v1/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if(response.ok){
        const json = await response.json()
        setTransactions(json)
        const headers = Object.keys(json[0])
        setTransactionHeaders(headers)
      } else {
        const json = await response.json()
        setErrors(json.message)
      }
    } catch (error) {
      setErrors("Failed to fetch transactions. Please try again later")
    }
  }

  if (!transactions) return(<ErrorMessages errors={errors}/>)

  return(
    <div className="flex flex-col h-full justify-center items-center px-5">
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 bg-green-200 px-4 py-2 rounded-lg text-green-800 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} shadow-lg`}>
        {message}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-2">Transaction Management System</h1>
      <div className="flex justify-end w-full pb-2">
        <button 
          onClick={() => setShowModal(true)}
          className="text-xs bg-gray-400 hover:bg-gray-500 font-semibold px-4 py-2 rounded-md shadow">
            Add Transaction
        </button>
      </div>
      <div className="relative overflow-y-auto shadow-md sm:rounded-lg w-full max-h-128" >
        <table className="w-full text-sm text-left text-gray-700 text-center">
          <thead className="text-md uppercase bg-gray-300 sticky top-0 z-10">
            <tr className="border-b">
              {transactionHeaders.map((header, index) => (
                  <th key={index} scope="col" className="px-6 py-3">
                    {header}
                  </th>
              ))}
            </tr>
          </thead>
          <tbody>
            { transactions.map((transaction, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-100 border-b border-gray-200 hover:bg-gray-200 hover:cursor-pointer">
                {transactionHeaders.map((header,index) => {
                  if (header == "Status") {
                    const statusClasses = {
                      Pending: "bg-yellow-500",
                      Settled: "bg-green-500",
                      Failed: "bg-red-500",
                    }
                    return (
                      <td key={index} className="px-4 py-2">
                        <span
                          className={`${statusClasses[transaction[header]]} text-white px-2 py-1 rounded`}
                        >
                          {transaction[header]}
                        </span>
                      </td>
                    )
                  } else {
                    return (
                      <td key={index}>{transaction[header]}</td>
                    )
                  }
                })} 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      { showModal && transactions && 
        <AddTransaction setShowModal={setShowModal} setReload={setReload} setMessage={setMessage} setIsVisible={setIsVisible}/>}
    </div>
  )
}

export default TransactionsList
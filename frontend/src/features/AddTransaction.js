import { useState } from "react";
import { useNavigate } from 'react-router';

function AddTransaction(props){

  const {setShowModal} = props

  const [transactionDate, setTransactionDate] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [amount, setAmount] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newTransactionData = {
      transaction_date: transactionDate,
      account_number: accountNumber,
      account_holder_name: `${firstName} ${lastName}`,
      amount: Number(amount).toFixed(2)
    }

    try{
      const response = await fetch("http://127.0.0.1:3000/api/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({data: newTransactionData})
    })

    if(response.ok){
      navigate("/")
    }
    
    }catch(error){

    }
  }

  const handleChange = (e) => {
    let filteredValue = e.target.value.replace(/[a-zA-Z\-]/g, "")

    if (filteredValue.length > 0) {
      filteredValue = filteredValue.match(/.{1,4}/g).join("-")
    }

    setAccountNumber(filteredValue)
  }

  return(
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div className="relative bg-white rounded-md shadow-md p-6 w-full max-w-md mx-auto">
        <span onClick={() =>setShowModal(false)} className="absolute top-0 right-2 hover:text-neutral-subtext hover:cursor-pointer">
          x
        </span>
        <h2 className="mb-4 text-xl font-bold text-gray-800 text-left">Add new transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="transaction-date" className="block mb-2 text-sm text-left font-medium text-gray-900">Transaction Date</label>
              <input 
                type="date"
                name="transaction-date"
                id="transaction-date"
                onChange = {(e) => setTransactionDate(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Select date"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="account-number" className="block mb-2 text-sm text-left font-medium text-gray-900">Account Number</label>
              <input 
                type="text" 
                name="account-number"
                id="account-number"
                minLength="14" 
                maxLength="14" 
                onChange = {handleChange}
                value={accountNumber}
                inputMode="numeric" 
                pattern="[0-9\-]*"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="1234-5678-9000"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="first-name" className="block mb-2 text-sm text-left font-medium text-gray-900">First Name</label>
              <input 
                type="text" 
                name="first-name"
                id="first-name"
                onChange = {(e) => setFirstName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="First Name"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="last-name" className="block mb-2 text-sm text-left font-medium text-gray-900">Last Name</label>
              <input 
                type="text" 
                name="last-name"
                id="last-name"
                onChange = {(e) => setLastName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Last Name"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm text-left font-medium text-gray-900">Amount</label>
              <input 
                type="number" 
                step="0.01" 
                onChange = {(e) => setAmount(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="299.99"
              />
            </div>

            <div className="sm:col-span-2">
              <button 
                type="submit"
                className="w-full px-5 py-2.5 sm:mt-2 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransaction
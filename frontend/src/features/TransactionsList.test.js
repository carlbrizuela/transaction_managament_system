import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransactionsList from './TransactionsList';

// Mock global.fetch
beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks();
})

test("renders transactions table when fetch succeeds", async () => {
  const fakeData = [
    { "Account Holder Name": "Juan dela Cruz", Amount: 100, Status: "Settled" },
    { "Account Holder Name": "John Doe", Amount: 200, Status: "Pending" },
    { "Account Holder Name": "Jane Doe", Amount: 300, Status: "Failed" },
  ]

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => fakeData,
  })

  render(<TransactionsList />)

  // Checks if value is present in the table
  const cell = await screen.findByText("John Doe")
  expect(cell).toBeInTheDocument()

  // Checks headers
  expect(screen.getByText("Account Holder Name")).toBeInTheDocument()
  expect(screen.getByText("Amount")).toBeInTheDocument()
  expect(screen.getByText("Status")).toBeInTheDocument()

  //Checks formatting of each status
  const settledSpan = screen.getByText("Settled")
  expect(settledSpan).toHaveClass("bg-green-500")

  const pendingSpan = screen.getByText("Pending")
  expect(pendingSpan).toHaveClass("bg-yellow-500")

  const failedSpan = screen.getByText("Failed")
  expect(failedSpan).toHaveClass("bg-red-500")

  // Checks if modal opens when button is clicked
  const addButton = screen.getByText("Add Transaction")
  fireEvent.click(addButton)
  expect(screen.getByText("Add new transaction")).toBeInTheDocument()
})
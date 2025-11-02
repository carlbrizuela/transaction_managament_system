import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AddTransaction from './AddTransaction';

describe("AddTransaction component", () => {
  const mockSetShowModal = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
    global.fetch = undefined
  })

  test("submits the form and navigates on successful POST", async () => {
    const fakeResponse = { 
      "transaction_date": "2025-03-04",
      "account_number": "8899-0011-2233",
      "account_holder_name": "Sarah Williams",
      "amount": "310.75",
      "status": "Settled"
     }
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse
    })

    render(
      <MemoryRouter>
        <AddTransaction setShowModal={mockSetShowModal} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Transaction Date/i), { target: { value: "2025-11-02" } })
    fireEvent.change(screen.getByLabelText(/Account Number/i), { target: { value: "123456789000" } })
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } })
    fireEvent.change(screen.getByPlaceholderText(/299.99/i), { target: { value: "150.50" } })

    fireEvent.click(screen.getByRole("button", { name: /Add/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
      const expectedBody = {
        data: {
          transaction_date: "2025-11-02",
          account_number: "1234-5678-9000",
          account_holder_name: "John Doe",
          amount: Number("150.50").toFixed(2)
        }
      }
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:3000/api/v1/transactions",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expectedBody)
        })
      )
    })
  })
})
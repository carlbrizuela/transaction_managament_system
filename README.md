# Transaction Management System

## Overview

## Prerequisites
- React `19.2.0`
- Node.js `24.1.0`
- npm `11.3.0`
- Ruby `3.3.5`
- Rails `7.2.3`
## Installation

- Step-by-step setup instructions

## Configuration

- Environment Variables
  |Variable|Description|Required|Default|Example
  |-|-|-|-|-|
  |`FILE_PATH`| Absolute path of transactions csv file|Yes|-|- Windows: `C:\Users\Username\Documents\transactions.csv`<br /> - Unix/Linux: `/home/username/documents/transactions.csv`

## Running the Application

- To start backend:
  ```
  cd backend/
  rails s
  ```
- To start frontend:
  ```
  cd frontend/
  npm start
  ```

## API Documentation
1. GET /api/v1/transactions
    - Retrieves all transactions from csv file
    - Response body
        ```
        [
          {
            "Transaction Date": "2025-03-01",
            "Account Number": "7289-3445-1121",
            "Account Holder Name": "Maria Johnson",
            "Amount": "150.00",
            "Status": "Settled"
          },
          {
            "Transaction Date": "2025-03-02",
            "Account Number": "1122-3456-7890",
            "Account Holder Name": "John Smith",
            "Amount": "75.50",
            "Status": "Pending"
          },
          {
            "Transaction Date": "2025-03-03",
            "Account Number": "3344-5566-7788",
            "Account Holder Name": "Robert Chen",
            "Amount": "220.25",
            "Status": "Settled"
          }
        ]
        ```
2. POST api/v1/transactions
    - Adds new transaction to csv file
    - Request body
      ```
      {
        transaction_date: "2025-03-04",
        account_number: "8899-0011-2233",
        account_holder_name: "Sarah Williams",
        amount: "310.75"
      }
      ```
    - Response body
      ```
      {
        "transaction_date": "2025-03-04",
        "account_number": "8899-0011-2233",
        "account_holder_name": "Sarah Williams",
        "amount": "310.75"
        "status": "Settled"
      }
      ```
      > [!NOTE]
      > Status is randomly assigned in backend
## Testing

- Backend testing
  ```
   bundle exec rspec spec/requests/transactions_spec.rb
  ```

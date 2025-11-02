require 'rails_helper'

RSpec.describe "Transactions", type: :request do

  let(:file_path) { Rails.root.join("tmp", "transactions.csv") }

  before do
    # Ensure tmp directory exists
    FileUtils.mkdir_p(File.dirname(file_path))
    allow(ENV).to receive(:[]).and_call_original   # allow normal ENV access
    allow(ENV).to receive(:[]).with('FILE_PATH').and_return(file_path.to_s)
  end

  after do
    File.delete(file_path) if File.exist?(file_path)
  end

  describe "GET /api/v1/transactions" do
    context "when file does not exist" do
      it "returns 404 with 'File not found' message" do
        get "/api/v1/transactions"
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)).to eq({ "message" => "File not found" })
      end
    end

    context "when file exists but empty" do
      before { FileUtils.touch(file_path) }

      it "returns 404 with 'No transactions found'" do
        get "/api/v1/transactions"
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)).to eq({ "message" => "No transactions found" })
      end
    end

    context "when file has transactions" do
      before do
        CSV.open(file_path, "w") do |csv|
          csv << ["Transaction Date", "Account Number", "Account Holder Name", "Amount", "Status"]
          csv << ["2025-11-01", "12345", "John Doe", "100.50", "Settled"]
        end
      end

      it "returns the CSV data as JSON" do
        get "/api/v1/transactions"
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json).to be_an(Array)
        expect(json.first["Account Holder Name"]).to eq("John Doe")
      end
    end
  end

  describe "POST /api/v1/transactions" do
    let(:valid_params) do
      {
        data: {
          transaction_date: "2025-11-02",
          account_number: "1234-5678-1235",
          account_holder_name: "Alice Smith",
          amount: "200.00"
        }
      }
    end

    before do
      CSV.open(file_path, "w") do |csv|
        csv << ["Transaction Date", "Account Number", "Account Holder Name", "Amount", "Status"]
      end
    end

    it "creates a new transaction and appends it to the CSV file" do
      post "/api/v1/transactions", params: valid_params
      expect(response).to have_http_status(:created)

      json = JSON.parse(response.body)
      expect(json["account_holder_name"]).to eq("Alice Smith")
      expect(["Pending", "Settled", "Failed"]).to include(json["status"])

      csv_data = CSV.read(file_path, headers: true)
      expect(csv_data.count).to eq(1)
      expect(csv_data.first["Account Holder Name"]).to eq("Alice Smith")
    end
  end
end

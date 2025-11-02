class Api::V1::TransactionsController < ApplicationController
  require 'csv'

  def index
    file_path = csv_file_path
    unless File.exist?(file_path)
      return render json: { message: "File not found" }, status: :not_found
    end

    if File.zero?(csv_file_path)
      return render json: { message: "No transactions found" }, status: :not_found
    end
    
    csv_data = CSV.read(file_path, headers: true)
    render json: csv_data.map(&:to_h)
  end

  def create
    transaction = transaction_params.to_h
    status = ["Pending", "Settled", "Failed"].sample
    new_row_data = [
      transaction["transaction_date"], 
      transaction["account_number"], 
      transaction["account_holder_name"], 
      transaction["amount"], 
      status
    ]
    
    check_EOF_if_newline
    
    CSV.open(csv_file_path, "ab") do |csv|
      csv << new_row_data
    end

    render json: transaction.merge(status: status), status: :created
  end

  private

  def csv_file_path
    ENV['FILE_PATH'] || Rails.root.join("tmp", "transactions.csv")
  end

  def transaction_params
    params.require(:data).permit(:transaction_date, :account_number, :account_holder_name, :amount)
  end

  def check_EOF_if_newline
    File.open(csv_file_path, "r+") do |f|
      f.seek(-1, IO::SEEK_END)
      last_char = f.read(1)
      f.write("\n") unless last_char == "\n"
    end
  end
end
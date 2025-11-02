import './App.css';
import TransactionsList from './features/TransactionsList';
import {Navigate, Routes, Route, BrowserRouter } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/transactions" element={<TransactionsList />} />
          <Route path="/" element={<Navigate to="/transactions" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Guests from './pages/Guests';
import Calendar from './pages/Calendar';
import Inventory from './pages/Inventory';
import Expenses from './pages/Expenses';
export function App() {
  return <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </MainLayout>
    </Router>;
}
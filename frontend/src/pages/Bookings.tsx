import React, { useState } from 'react';
import BookingCard from '../components/bookings/BookingCard';
import Card from '../components/ui/Card';
import { mockBookings, mockRooms, mockGuests, mockChecklistItems } from '../utils/mockData';
import { PlusIcon, FilterIcon, SearchIcon } from 'lucide-react';
import BookingFormModal from '../components/bookings/BookingFormModal';
import BookingDetailModal from '../components/bookings/BookingDetailModal';
import ChecklistModal from '../components/bookings/ChecklistModal';
import { Booking } from '../utils/types';
const Bookings = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  // Local state to manage bookings (in a real app, this would be connected to a backend)
  const [bookings, setBookings] = useState(mockBookings);
  const filteredBookings = bookings.filter(booking => filter === 'all' || booking.status === filter).sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };
  const handleCreateBooking = (bookingData: any) => {
    // In a real app, this would save to the database
    console.log('New booking created:', bookingData);
  };
  const handleCheckIn = (bookingId: string) => {
    setBookings(bookings.map(booking => booking.id === bookingId ? {
      ...booking,
      status: 'checked_in'
    } : booking));
    setIsDetailModalOpen(false);
  };
  const handleCheckOut = (bookingId: string) => {
    setBookings(bookings.map(booking => booking.id === bookingId ? {
      ...booking,
      status: 'checked_out'
    } : booking));
    setIsDetailModalOpen(false);
  };
  const handleExtendBooking = (updatedBooking: Booking) => {
    setBookings(bookings.map(booking => booking.id === updatedBooking.id ? updatedBooking : booking));
    setSelectedBooking(updatedBooking);
  };
  const handleShowChecklist = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(false);
    setIsChecklistModalOpen(true);
  };
  const handleSaveChecklist = (bookingId: string, checklist: any[]) => {
    setBookings(bookings.map(booking => booking.id === bookingId ? {
      ...booking,
      checklist
    } : booking));
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
          <p className="text-gray-600">Manage reservations and guest stays</p>
        </div>
        <button onClick={() => setIsNewBookingModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
          <PlusIcon size={16} className="mr-1" />
          New Booking
        </button>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center mr-2">
              <FilterIcon size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Filter:</span>
            </div>
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              All
            </button>
            <button onClick={() => setFilter('confirmed')} className={`px-3 py-1 rounded-md text-sm ${filter === 'confirmed' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Confirmed
            </button>
            <button onClick={() => setFilter('checked_in')} className={`px-3 py-1 rounded-md text-sm ${filter === 'checked_in' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Checked In
            </button>
            <button onClick={() => setFilter('checked_out')} className={`px-3 py-1 rounded-md text-sm ${filter === 'checked_out' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Checked Out
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Search bookings..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map(booking => <BookingCard key={booking.id} booking={booking} onViewDetails={() => handleViewBooking(booking)} />)}
        {filteredBookings.length === 0 && <div className="col-span-full">
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No bookings match the selected filter
              </p>
            </Card>
          </div>}
      </div>
      {/* New Booking Modal */}
      <BookingFormModal isOpen={isNewBookingModalOpen} onClose={() => setIsNewBookingModalOpen(false)} rooms={mockRooms} guests={mockGuests} onSave={handleCreateBooking} />
      {/* Booking Detail Modal */}
      <BookingDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} booking={selectedBooking} room={selectedBooking ? mockRooms.find(r => r.id === selectedBooking.roomId) || null : null} guest={selectedBooking ? mockGuests.find(g => g.id === selectedBooking.guestId) || null : null} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} onExtend={handleExtendBooking} onShowChecklist={handleShowChecklist} />
      {/* Checklist Modal */}
      <ChecklistModal isOpen={isChecklistModalOpen} onClose={() => setIsChecklistModalOpen(false)} booking={selectedBooking} room={selectedBooking ? mockRooms.find(r => r.id === selectedBooking.roomId) || null : null} checklistItems={selectedBooking?.checklist || mockChecklistItems} onSaveChecklist={handleSaveChecklist} />
    </div>;
};
export default Bookings;
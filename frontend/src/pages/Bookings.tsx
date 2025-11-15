import { useState, useEffect } from 'react';
import BookingCard from '../components/bookings/BookingCard';
import Card from '../components/ui/Card';
import { PlusIcon, FilterIcon } from 'lucide-react';
import BookingFormModal from '../components/bookings/BookingFormModal';
import BookingDetailModal from '../components/bookings/BookingDetailModal';
import ChecklistModal from '../components/bookings/ChecklistModal';
import { Booking, Room, Guest } from '../types/types';
import { bookingApi, roomApi, guestApi, checklistApi } from '../services/bookingApi';

const Bookings = () => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'checked_in' | 'checked_out'>('all');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoomsAndGuests();
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data: Booking[] = await bookingApi.getAllBookings(filter !== 'all' ? filter : undefined);
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomsAndGuests = async () => {
    try {
      const [roomsData, guestsData] = await Promise.all([
        roomApi.getAllRooms(),
        guestApi.getAllGuests()
      ]);
      setRooms(roomsData);
      setGuests(guestsData);
    } catch (err: any) {
      console.error('Error fetching rooms/guests:', err);
    }
  };

  const filteredBookings = bookings
      .filter(b => filter === 'all' || b.status === filter)
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());

  // ✅ Helper functions to get room/guest by ID
  const getRoomById = (roomId: number): Room | undefined => {
    return rooms.find(r => r.id === roomId);
  };

  const getGuestById = (guestId: number): Guest | undefined => {
    return guests.find(g => g.id === guestId);
  };

  const handleViewBooking = async (booking: Booking) => {
    try {
      const [fullBooking, room, guest, checklist] = await Promise.all([
        bookingApi.getBookingById(booking.id),
        roomApi.getRoomById(booking.roomId),
        guestApi.getGuestById(booking.guestId),
        checklistApi.getChecklistByBookingId(booking.id).catch(() => [])
      ]);

      setSelectedBooking(fullBooking);
      setSelectedRoom(room);
      setSelectedGuest(guest);
      setChecklistItems(checklist || []);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking details');
      console.error('Error fetching booking details:', err);
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      await bookingApi.createBooking(bookingData);
      setIsNewBookingModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
      alert('Failed to create booking: ' + (err.message || 'Unknown error'));
    }
  };

  const handleCheckIn = async (bookingId: number | string) => {
    try {
      await bookingApi.checkIn(bookingId);
      setIsDetailModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
      alert('Failed to check in: ' + (err.message || 'Unknown error'));
    }
  };

  const handleCheckOut = async (bookingId: number | string) => {
    try {
      await bookingApi.checkOut(bookingId);
      setIsDetailModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
      alert('Failed to check out: ' + (err.message || 'Unknown error'));
    }
  };

  const handleExtendBooking = async (updatedBooking: Booking) => {
    try {
      await bookingApi.extendBooking(updatedBooking.id, { newCheckOutDate: updatedBooking.checkOutDate });
      setSelectedBooking(updatedBooking);
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
      alert('Failed to extend booking: ' + (err.message || 'Unknown error'));
    }
  };

  const handleShowChecklist = async (booking: Booking) => {
    try {
      const checklist = await checklistApi.getChecklistByBookingId(booking.id);
      setChecklistItems(checklist || []);
      setSelectedBooking(booking);
      setIsDetailModalOpen(false);
      setIsChecklistModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching checklist:', err);
      setChecklistItems([]);
      setSelectedBooking(booking);
      setIsDetailModalOpen(false);
      setIsChecklistModalOpen(true);
    }
  };

  const handleSaveChecklist = async (bookingId: number | string, checklist: any[]) => {
    try {
      await checklistApi.saveChecklistForBooking(bookingId, checklist);
      setChecklistItems(checklist);
      alert('Checklist saved successfully');
    } catch (err: any) {
      setError(err.message);
      alert('Failed to save checklist: ' + (err.message || 'Unknown error'));
    }
  };

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-600">Manage reservations and guest stays</p>
          </div>
          <button
              onClick={() => setIsNewBookingModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <PlusIcon size={16} className="mr-1" />
            New Booking
          </button>
        </div>

        {/* Error */}
        {error && (
            <Card className="p-4 bg-red-50 border border-red-200">
              <p className="text-red-600">{error}</p>
            </Card>
        )}

        {/* Filter */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center mr-2">
              <FilterIcon size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Filter:</span>
            </div>
            {['all', 'confirmed', 'checked_in', 'checked_out'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1 rounded-md text-sm ${
                        filter === f
                            ? f === 'confirmed'
                                ? 'bg-purple-100 text-purple-800'
                                : f === 'checked_in'
                                    ? 'bg-blue-100 text-blue-800'
                                    : f === 'checked_out'
                                        ? 'bg-gray-200 text-gray-800'
                                        : 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
            ))}
          </div>
        </Card>

        {/* Bookings List */}
        {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Loading bookings...</p>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => {
                    const room = getRoomById(booking.roomId);
                    const guest = getGuestById(booking.guestId);

                    return (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            room={room}
                            guest={guest}
                            onViewDetails={() => handleViewBooking(booking)}
                        />
                    );
                  })
              ) : (
                  <div className="col-span-full">
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">No bookings match the selected filter</p>
                    </Card>
                  </div>
              )}
            </div>
        )}

        {/* Modals */}
        <BookingFormModal
            isOpen={isNewBookingModalOpen}
            onClose={() => setIsNewBookingModalOpen(false)}
            rooms={rooms}
            guests={guests}
            onSave={handleCreateBooking}
        />

        <BookingDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            booking={selectedBooking}
            room={selectedRoom}
            guest={selectedGuest}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onExtend={handleExtendBooking}
            onShowChecklist={handleShowChecklist}
        />

        <ChecklistModal
            isOpen={isChecklistModalOpen}
            onClose={() => setIsChecklistModalOpen(false)}
            booking={selectedBooking}
            room={selectedRoom}
            checklistItems={checklistItems}
            onSaveChecklist={handleSaveChecklist}
        />
      </div>
  );
};

export default Bookings;
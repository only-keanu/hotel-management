import { useState, useEffect, Fragment } from 'react';
import Card from '../components/ui/Card';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import BookingModal from '../components/calendar/BookingModal';
import { Room, Booking, Guest } from '../types/types';
import { bookingApi, roomApi, guestApi } from '../services/bookingApi';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Data states
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========== FETCH DATA FROM BACKEND ==========

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [bookingsData, roomsData, guestsData] = await Promise.all([
        bookingApi.getAllBookings(),
        roomApi.getAllRooms(),
        guestApi.getAllGuests(),
      ]);

      setBookings(bookingsData);
      setRooms(roomsData);
      setGuests(guestsData);
    } catch (err: any) {
      console.error('Error fetching calendar data:', err);
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  // ========== CALENDAR CALCULATIONS ==========

  // Calculate the start and end of the current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // End on Sunday

  // Generate an array of days for the week view
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get bookings for the current week
  const weekBookings = bookings.filter(booking => {
    const checkIn = parseISO(booking.checkInDate);
    const checkOut = parseISO(booking.checkOutDate);
    // Check if the booking overlaps with the current week
    return (checkIn <= weekEnd && checkOut >= weekStart) ||
        (checkOut >= weekStart && checkIn <= weekEnd);
  });

  // ========== NAVIGATION HANDLERS ==========

  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // ========== BOOKING HELPERS ==========

  // Function to find bookings for a specific room and day
  const findBookingsForRoomAndDay = (roomId: number, day: Date) => {
    return weekBookings.filter(booking => {
      const checkIn = parseISO(booking.checkInDate);
      const checkOut = parseISO(booking.checkOutDate);
      return booking.roomId === roomId && day >= checkIn && day < checkOut;
    });
  };

  // Get booking cell style based on status
  const getBookingCellStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'checked_in':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'checked_out':
        return 'bg-gray-100 border-gray-200 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-600';
    }
  };

  // ========== EVENT HANDLERS ==========

  const handleCellClick = (room: Room, day: Date) => {
    const bookingsForDay = findBookingsForRoomAndDay(room.id, day);
    if (bookingsForDay.length === 0) {
      setSelectedRoom(room);
      setSelectedDate(day);
      setIsBookingModalOpen(true);
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      await bookingApi.createBooking(bookingData);
      setIsBookingModalOpen(false);
      // Refresh data to show new booking
      await fetchAllData();
    } catch (err: any) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking: ' + err.message);
    }
  };

  // ========== RENDER ==========

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Booking Calendar</h1>
          <p className="text-gray-600">View and manage room bookings</p>
        </div>

        {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
              <button
                  onClick={fetchAllData}
                  className="mt-2 text-sm text-red-800 underline"
              >
                Retry
              </button>
            </Card>
        )}

        {/* Calendar Controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button
                  onClick={goToPreviousWeek}
                  className="p-1.5 rounded-md hover:bg-gray-100"
              >
                <ChevronLeftIcon size={20} />
              </button>
              <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Today
              </button>
              <button
                  onClick={goToNextWeek}
                  className="p-1.5 rounded-md hover:bg-gray-100"
              >
                <ChevronRightIcon size={20} />
              </button>
              <h2 className="text-lg font-medium text-gray-800 ml-2">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </h2>
            </div>
            <div className="flex space-x-2">
              <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      view === 'week'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Week
              </button>
              <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      view === 'day'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Day
              </button>
            </div>
          </div>
        </Card>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-8 gap-px bg-gray-200">
              {/* Header row with day names */}
              <div className="bg-gray-50 p-3 font-medium text-gray-500 text-sm">
                Rooms
              </div>
              {daysInWeek.map((day, i) => (
                  <div
                      key={i}
                      className={`bg-gray-50 p-3 text-center ${
                          isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                      }`}
                  >
                    <p className="font-medium text-gray-700">
                      {format(day, 'EEE')}
                    </p>
                    <p className="text-sm text-gray-500">{format(day, 'MMM d')}</p>
                  </div>
              ))}

              {/* Room rows */}
              {rooms.map(room => (
                  <Fragment key={room.id}>
                    <div className="bg-white p-3 border-b border-gray-200">
                      <p className="font-medium text-gray-800">
                        Room {room.number}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {room.type}
                      </p>
                    </div>

                    {/* Booking cells */}
                    {daysInWeek.map((day, i) => {
                      const bookingsForDay = findBookingsForRoomAndDay(room.id, day);
                      const isToday = isSameDay(day, new Date());

                      return (
                          <div
                              key={i}
                              className={`bg-white border-b border-gray-200 p-1 min-h-[80px] cursor-pointer ${
                                  isToday ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => handleCellClick(room, day)}
                          >
                            {bookingsForDay.length > 0 ? (
                                bookingsForDay.map(booking => {
                                  const guest = guests.find(g => g.id === booking.guestId);
                                  return (
                                      <div
                                          key={booking.id}
                                          className={`p-1 text-xs rounded border ${getBookingCellStyle(
                                              booking.status
                                          )} mb-1 cursor-pointer hover:opacity-80`}
                                      >
                                        <div className="font-medium truncate">
                                          {guest?.lastName || 'Unknown'}
                                        </div>
                                        <div className="truncate">
                                          {format(parseISO(booking.checkInDate), 'MMM d')} -{' '}
                                          {format(parseISO(booking.checkOutDate), 'MMM d')}
                                        </div>
                                      </div>
                                  );
                                })
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <button className="text-xs text-gray-400 hover:text-blue-600">
                                    + Add
                                  </button>
                                </div>
                            )}
                          </div>
                      );
                    })}
                  </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            selectedDate={selectedDate}
            selectedRoom={selectedRoom}
            guests={guests}
            onCreateBooking={handleCreateBooking}
        />
      </div>
  );
};

export default Calendar;
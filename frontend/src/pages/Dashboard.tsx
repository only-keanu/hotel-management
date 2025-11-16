import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import BookingCard from '../components/bookings/BookingCard';
import WeeklyCalendar from '../components/dashboard/WeeklyCalendar';
import { BedDoubleIcon, UsersIcon, CalendarIcon, DollarSignIcon, TrendingUpIcon } from 'lucide-react';
import BookingFormModal from '../components/bookings/BookingFormModal';
import BookingDetailModal from '../components/bookings/BookingDetailModal';
import ChecklistModal from '../components/bookings/ChecklistModal';
import { Booking, Room, Guest } from '../types/types';
import {bookingApi, roomApi, checklistApi, guestApi} from '../services/bookingApi';

// Define stats interface
interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  currentGuests: number;
  upcomingCheckIns: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

const Dashboard = () => {
  // Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    currentGuests: 0,
    upcomingCheckIns: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
  });

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
        guestApi.getAllGuests(), // ✅ Fetch guests
      ]);

      setBookings(bookingsData);
      setRooms(roomsData);
      setGuests(guestsData); // ✅ Store guests in state

      // Calculate stats from fetched data
      calculateStats(bookingsData, roomsData);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ========== CALCULATE DASHBOARD STATS ==========

  const calculateStats = (bookingsData: Booking[], roomsData: Room[]) => {
    // Room stats
    const totalRooms = roomsData.length;
    const occupiedRooms = roomsData.filter(r => r.status === 'occupied').length;
    const availableRooms = roomsData.filter(r => r.status === 'available').length;
    const maintenanceRooms = roomsData.filter(r => r.status === 'maintenance').length;

    // Guest stats
    const checkedInBookings = bookingsData.filter(b => b.status === 'checked_in');
    const currentGuests = checkedInBookings.reduce((sum, b) => sum + b.adults + b.children, 0);

    // Upcoming check-ins (confirmed bookings)
    const upcomingCheckIns = bookingsData.filter(b => b.status === 'confirmed').length;

    // Calculate monthly revenue (current month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRevenue = bookingsData
        .filter(b => {
          const checkInDate = new Date(b.checkInDate);
          return checkInDate.getMonth() === currentMonth &&
              checkInDate.getFullYear() === currentYear;
        })
        .reduce((sum, b) => sum + b.totalAmount, 0);

    // Calculate occupancy rate
    const occupancyRate = totalRooms > 0
        ? Math.round((occupiedRooms / totalRooms) * 100)
        : 0;

    setStats({
      totalRooms,
      occupiedRooms,
      availableRooms,
      maintenanceRooms,
      currentGuests,
      upcomingCheckIns,
      monthlyRevenue,
      occupancyRate,
    });
  };

  // ========== FILTER BOOKINGS ==========

  // Today's check-ins (confirmed bookings with today's check-in date)
  const todayCheckIns = bookings.filter(booking => {
    if (booking.status !== 'confirmed') return false;
    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    return checkInDate.toDateString() === today.toDateString();
  });

  // Current stays (checked in guests)
  const currentStays = bookings.filter(booking => booking.status === 'checked_in');

  // Recent check-ins (checked in within last 3 days)
  const recentCheckIns = bookings
      .filter(booking => {
        if (booking.status !== 'checked_in') return false;
        const checkInDate = new Date(booking.checkInDate);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return checkInDate >= threeDaysAgo;
      })
      .slice(0, 3);

  // ========== EVENT HANDLERS ==========

  const handleAddBooking = (roomId: string | number, date: Date) => {
    const numericRoomId = typeof roomId === 'string' ? parseInt(roomId) : roomId;
    setSelectedRoomId(numericRoomId);
    setSelectedDate(date);
    setIsBookingModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditBookingModalOpen(true);
  };

  const handleViewBookingDetails = async (booking: Booking) => {
    try {
      // Fetch full booking details
      const fullBooking = await bookingApi.getBookingById(booking.id);
      setSelectedBooking(fullBooking);
      setIsDetailModalOpen(true);
    } catch (err: any) {
      console.error('Error fetching booking details:', err);
      setError(err.message);
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      await bookingApi.createBooking(bookingData);
      setIsBookingModalOpen(false);
      setIsEditBookingModalOpen(false);
      // Refresh data
      fetchAllData();
    } catch (err: any) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking: ' + err.message);
    }
  };

  const handleUpdateBooking = async (bookingData: any) => {
    try {
      // If you have an update endpoint, call it here
      // await bookingApi.updateBooking(bookingData.id, bookingData);
      setIsEditBookingModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking: ' + err.message);
    }
  };

  const handleCheckIn = async (bookingId: string | number) => {
    try {
      const numericId = typeof bookingId === 'string' ? parseInt(bookingId) : bookingId;
      await bookingApi.checkIn(numericId);
      setIsDetailModalOpen(false);
      fetchAllData(); // Refresh to update stats and lists
    } catch (err: any) {
      console.error('Error checking in:', err);
      alert('Failed to check in: ' + err.message);
    }
  };

  const handleCheckOut = async (bookingId: string | number) => {
    try {
      const numericId = typeof bookingId === 'string' ? parseInt(bookingId) : bookingId;
      await bookingApi.checkOut(numericId);
      setIsDetailModalOpen(false);
      fetchAllData(); // Refresh to update stats and lists
    } catch (err: any) {
      console.error('Error checking out:', err);
      alert('Failed to check out: ' + err.message);
    }
  };

  const handleExtendBooking = async (updatedBooking: Booking) => {
    try {
      await bookingApi.extendBooking(updatedBooking.id, {
        newCheckOutDate: updatedBooking.checkOutDate
      });
      setSelectedBooking(updatedBooking);
      fetchAllData(); // Refresh data
    } catch (err: any) {
      console.error('Error extending booking:', err);
      alert('Failed to extend booking: ' + err.message);
    }
  };

  const handleShowChecklist = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(false);
    setIsChecklistModalOpen(true);
  };

  const handleSaveChecklist = async (bookingId: string | number, checklist: any[]) => {
    try {
      const numericId = typeof bookingId === 'string' ? parseInt(bookingId) : bookingId;
      await checklistApi.saveChecklistForBooking(numericId, checklist);
      fetchAllData(); // Refresh data
    } catch (err: any) {
      console.error('Error saving checklist:', err);
      alert('Failed to save checklist: ' + err.message);
    }
  };

  // ========== RENDER ==========

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to SPSTI management portal</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <BedDoubleIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Room Status</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.occupiedRooms}
                  </p>
                  <p className="text-sm text-gray-600 ml-2">
                    of {stats.totalRooms} occupied
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-600">
                {stats.availableRooms} Available
              </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-xs text-gray-600">
                {stats.maintenanceRooms} Maintenance
              </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <UsersIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Current Guests
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-800">
                    {stats.currentGuests}
                  </p>
                  <p className="text-sm text-gray-600 ml-2">guests in-house</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUpIcon size={16} className="text-green-500 mr-1" />
                <span className="text-xs text-gray-600">
                {currentStays.length} active stays
              </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <CalendarIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Check-ins
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  {stats.upcomingCheckIns}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <CalendarIcon size={16} className="text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">
                {todayCheckIns.length} arriving today
              </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <DollarSignIcon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${stats.occupancyRate}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 ml-2">
                {stats.occupancyRate}% occupancy
              </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Calendar */}
        <Card className="p-4">
          <WeeklyCalendar
              rooms={rooms}
              bookings={bookings}
              guests={guests}
              onAddBooking={handleAddBooking}
              onEditBooking={handleEditBooking}
          />
        </Card>

        {/* Bookings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Today's Check-ins
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {todayCheckIns.length > 0 ? (
                  todayCheckIns.map(booking => (
                      <BookingCard
                          key={booking.id}
                          booking={booking}
                          room={rooms.find(r => r.id === booking.roomId)}
                          guest={guests.find(g => g.id === booking.guestId)}
                          onViewDetails={() => handleViewBookingDetails(booking)}
                      />
                  ))
              ) : (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">
                      No check-ins scheduled for today
                    </p>
                  </Card>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Check-ins
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentCheckIns.length > 0 ? (
                  recentCheckIns.map(booking => (
                      <BookingCard
                          key={booking.id}
                          booking={booking}
                          room={rooms.find(r => r.id === booking.roomId)}
                          guest={guests.find(g => g.id === booking.guestId)}
                          onViewDetails={() => handleViewBookingDetails(booking)}
                      />
                  ))
              ) : (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No recent check-ins</p>
                  </Card>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Current Stays
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {currentStays.length > 0 ? (
                  currentStays.map(booking => (
                      <BookingCard
                          key={booking.id}
                          booking={booking}
                          room={rooms.find(r => r.id === booking.roomId)}
                          guest={guests.find(g => g.id === booking.guestId)}
                          onViewDetails={() => handleViewBookingDetails(booking)}
                      />
                  ))
              ) : (
                  <Card className="p-6 text-center">
                    <p className="text-gray-500">No current stays</p>
                  </Card>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedRoomId && (
            <BookingFormModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                rooms={rooms}
                guests={guests}
                onSave={handleCreateBooking}
            />
        )}

        <BookingFormModal
            isOpen={isEditBookingModalOpen}
            onClose={() => setIsEditBookingModalOpen(false)}
            rooms={rooms}
            guests={guests}
            booking={selectedBooking || undefined}
            onSave={handleUpdateBooking}
        />

        <BookingDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            booking={selectedBooking}
            room={selectedBooking ? rooms.find(r => r.id === selectedBooking.roomId) || null : null}
            guest={selectedBooking ? guests.find(g => g.id === selectedBooking.guestId) || null : null}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onExtend={handleExtendBooking}
            onShowChecklist={handleShowChecklist}
        />

        <ChecklistModal
            isOpen={isChecklistModalOpen}
            onClose={() => setIsChecklistModalOpen(false)}
            booking={selectedBooking}
            room={selectedBooking ? rooms.find(r => r.id === selectedBooking.roomId) || null : null}
            checklistItems={selectedBooking?.checklist || []}
            onSaveChecklist={handleSaveChecklist}
        />
      </div>
  );
};

export default Dashboard;
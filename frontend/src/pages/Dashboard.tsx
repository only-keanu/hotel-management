import React, { useState } from 'react';
import Card from '../components/ui/Card';
import BookingCard from '../components/bookings/BookingCard';
import WeeklyCalendar from '../components/dashboard/WeeklyCalendar';
import { mockStats, mockBookings, mockRooms, mockGuests } from '../utils/mockData';
import { BedDoubleIcon, UsersIcon, CalendarIcon, DollarSignIcon, TrendingUpIcon } from 'lucide-react';
import BookingFormModal from '../components/bookings/BookingFormModal';
const Dashboard = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const todayCheckIns = mockBookings.filter(booking => booking.status === 'confirmed');
  const currentStays = mockBookings.filter(booking => booking.status === 'checked_in');
  const handleAddBooking = (roomId: string, date: Date) => {
    setSelectedRoomId(roomId);
    setSelectedDate(date);
    setIsBookingModalOpen(true);
  };
  const handleCreateBooking = (bookingData: any) => {
    // In a real app, this would save the booking to the database
    console.log('New booking created:', bookingData);
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to SPSTI management portal</p>
      </div>
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
                  {mockStats.occupiedRooms}
                </p>
                <p className="text-sm text-gray-600 ml-2">
                  of {mockStats.totalRooms} occupied
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-gray-600">
                {mockStats.availableRooms} Available
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-xs text-gray-600">
                {mockStats.maintenanceRooms} Maintenance
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
                  {mockStats.currentGuests}
                </p>
                <p className="text-sm text-gray-600 ml-2">guests in-house</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUpIcon size={16} className="text-green-500 mr-1" />
              <span className="text-xs text-gray-600">+2 from last week</span>
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
                {mockStats.upcomingCheckIns}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <CalendarIcon size={16} className="text-gray-500 mr-1" />
              <span className="text-xs text-gray-600">2 arriving today</span>
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
                ${mockStats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{
                width: `${mockStats.occupancyRate}%`
              }}></div>
              </div>
              <span className="text-xs text-gray-600 ml-2">
                {mockStats.occupancyRate}% occupancy
              </span>
            </div>
          </div>
        </Card>
      </div>
      <Card className="p-4">
        <WeeklyCalendar rooms={mockRooms} bookings={mockBookings} guests={mockGuests} onAddBooking={handleAddBooking} />
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            {todayCheckIns.length > 0 ? todayCheckIns.map(booking => <BookingCard key={booking.id} booking={booking} />) : <Card className="p-6 text-center">
                <p className="text-gray-500">
                  No check-ins scheduled for today
                </p>
              </Card>}
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
            {currentStays.length > 0 ? currentStays.map(booking => <BookingCard key={booking.id} booking={booking} />) : <Card className="p-6 text-center">
                <p className="text-gray-500">No current stays</p>
              </Card>}
          </div>
        </div>
      </div>
      {/* Booking Modal */}
      {selectedRoomId && <BookingFormModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} rooms={mockRooms} guests={mockGuests} onSave={handleCreateBooking} />}
    </div>;
};
export default Dashboard;
import React, { useState, Fragment } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import { Room, Booking, Guest } from '../../types/types';
import Card from '../ui/Card';
interface WeeklyCalendarProps {
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  onAddBooking: (roomId: string, date: Date) => void;
  onEditBooking?: (booking: Booking) => void;
}
const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  rooms,
  bookings,
  guests,
  onAddBooking,
  onEditBooking
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Calculate the start and end of the current week
  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: 1
  }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, {
    weekStartsOn: 1
  }); // End on Sunday
  // Generate an array of days for the week view
  const daysInWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
  // Get bookings for the current week
  const weekBookings = bookings.filter(booking => {
    const checkIn = parseISO(booking.checkInDate);
    const checkOut = parseISO(booking.checkOutDate);
    // Check if the booking overlaps with the current week
    return checkIn <= weekEnd && checkOut >= weekStart || checkOut >= weekStart && checkIn <= weekEnd;
  });
  // Get only rooms with bookings in this week
  const roomsWithBookings = rooms.filter(room => weekBookings.some(booking => booking.roomId === room.id));
  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };
  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  // Function to find bookings for a specific room and day
  const findBookingsForRoomAndDay = (roomId: string, day: Date) => {
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
  const handleCellClick = (booking: Booking | null, room: any, day: Date) => {
    if (booking && onEditBooking) {
      onEditBooking(booking);
    } else if (!booking) {
      onAddBooking(room.id, day);
    }
  };
  if (roomsWithBookings.length === 0) {
    return <Card className="p-6 text-center">
        <p className="text-gray-500">No bookings found for this week</p>
      </Card>;
  }
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Weekly Bookings</h2>
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousWeek} className="p-1.5 rounded-md hover:bg-gray-100">
            <ChevronLeftIcon size={16} />
          </button>
          <button onClick={goToToday} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md">
            Today
          </button>
          <button onClick={goToNextWeek} className="p-1.5 rounded-md hover:bg-gray-100">
            <ChevronRightIcon size={16} />
          </button>
          <span className="text-sm font-medium text-gray-600">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            {/* Header row with day names */}
            <div className="bg-gray-50 p-2 font-medium text-gray-500 text-sm">
              Rooms
            </div>
            {daysInWeek.map((day, i) => <div key={i} className={`bg-gray-50 p-2 text-center ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}>
                <p className="font-medium text-gray-700 text-xs">
                  {format(day, 'EEE')}
                </p>
                <p className="text-xs text-gray-500">{format(day, 'MMM d')}</p>
              </div>)}
            {/* Room rows - only for rooms with bookings */}
            {roomsWithBookings.map(room => <Fragment key={room.id}>
                <div className="bg-white p-2 border-b border-gray-200">
                  <p className="font-medium text-gray-800 text-sm">
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
              return <div key={i} className={`bg-white border-b border-gray-200 p-1 min-h-[60px] ${isToday ? 'bg-blue-50' : ''}`}>
                      {bookingsForDay.length > 0 ? bookingsForDay.map(booking => {
                  const guest = guests.find(g => g.id === booking.guestId);
                  return <div key={booking.id} className={`p-1 text-xs rounded border ${getBookingCellStyle(booking.status)} mb-1 cursor-pointer hover:opacity-80`} onClick={() => handleCellClick(booking, room, day)}>
                              <div className="font-medium truncate">
                                {guest?.lastName}
                              </div>
                              <div className="truncate text-[10px]">
                                {format(parseISO(booking.checkInDate), 'MMM d')}{' '}
                                -{' '}
                                {format(parseISO(booking.checkOutDate), 'MMM d')}
                              </div>
                            </div>;
                }) : <div className="h-full w-full flex items-center justify-center">
                          <button className="text-xs text-gray-400 hover:text-blue-600 flex items-center" onClick={() => handleCellClick(null, room, day)}>
                            <PlusIcon size={12} className="mr-1" /> Add
                          </button>
                        </div>}
                    </div>;
            })}
              </Fragment>)}
          </div>
        </div>
      </div>
    </div>;
};
export default WeeklyCalendar;
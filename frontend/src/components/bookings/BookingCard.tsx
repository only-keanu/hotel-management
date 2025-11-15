import React from 'react';
import { Booking, Room, Guest } from '../../types/types';
import StatusBadge from '../ui/StatusBadge';
import Card from '../ui/Card';
import { CalendarIcon, UserIcon, CreditCardIcon } from 'lucide-react';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
  room?: Room;  // ✅ Added room prop
  guest?: Guest; // ✅ Added guest prop
  onViewDetails: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
                                                   booking,
                                                   room,
                                                   guest,
                                                   onViewDetails
                                                 }) => {
  // ✅ Show loading state if room/guest not loaded yet
  if (!room || !guest) {
    return (
        <Card className="overflow-hidden">
          <div className="p-4 text-center text-gray-500">
            Loading booking details...
          </div>
        </Card>
    );
  }

  const formatDateDisplay = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">
              Room {room.number} -{' '}
              {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
            </h3>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <UserIcon size={16} className="mr-2" />
            <span>
            {guest.firstName} {guest.lastName}
          </span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <CalendarIcon size={16} className="mr-2" />
            <span>
            {formatDateDisplay(booking.checkInDate)} -{' '}
              {formatDateDisplay(booking.checkOutDate)}
              <span className="text-gray-500 ml-1">
              ({calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'})
            </span>
          </span>
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <CreditCardIcon size={16} className="mr-2" />
            <span>${booking.totalAmount.toLocaleString()}</span>
            <StatusBadge status={booking.paymentStatus} className="ml-2" />
          </div>

          {booking.notes && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <p className="text-xs text-gray-500">Notes</p>
                <p className="text-sm">{booking.notes}</p>
              </div>
          )}
        </div>

        <div className="bg-gray-50 px-4 py-3 flex justify-between">
          <button
              onClick={onViewDetails}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </button>

          {booking.status === 'confirmed' && (
              <button className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                Check In
              </button>
          )}

          {booking.status === 'checked_in' && (
              <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                Check Out
              </button>
          )}
        </div>
      </Card>
  );
};

export default BookingCard;
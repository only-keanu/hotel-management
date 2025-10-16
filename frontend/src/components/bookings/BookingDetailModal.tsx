import React, { useState, Children } from 'react';
import Modal from '../ui/Modal';
import { Booking, Room, Guest } from '../../utils/types';
import { format, addDays, parseISO, differenceInDays } from 'date-fns';
import StatusBadge from '../ui/StatusBadge';
import { CalendarIcon, UserIcon, HomeIcon, CreditCardIcon, ClipboardCheckIcon } from 'lucide-react';
interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  room: Room | null;
  guest: Guest | null;
  onCheckIn: (bookingId: string) => void;
  onCheckOut: (bookingId: string) => void;
  onExtend: (booking: Booking) => void;
  onShowChecklist: (booking: Booking) => void;
}
const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  room,
  guest,
  onCheckIn,
  onCheckOut,
  onExtend,
  onShowChecklist
}) => {
  const [extendDays, setExtendDays] = useState(1);
  const [showExtendForm, setShowExtendForm] = useState(false);
  if (!booking || !room || !guest) return null;
  const checkInDate = parseISO(booking.checkInDate);
  const checkOutDate = parseISO(booking.checkOutDate);
  const nights = differenceInDays(checkOutDate, checkInDate);
  const handleExtendBooking = () => {
    const updatedBooking = {
      ...booking,
      checkOutDate: format(addDays(checkOutDate, extendDays), 'yyyy-MM-dd'),
      totalAmount: booking.totalAmount + room.pricePerNight * extendDays
    };
    onExtend(updatedBooking);
    setShowExtendForm(false);
    setExtendDays(1);
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg" footer={<>
          {booking.status === 'confirmed' && <button onClick={() => onCheckIn(booking.id)} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
              Check In
            </button>}
          {booking.status === 'checked_in' && <>
              <button onClick={() => onShowChecklist(booking)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2">
                Room Checklist
              </button>
              <button onClick={() => onCheckOut(booking.id)} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Check Out
              </button>
            </>}
        </>}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Booking #{booking.id.substring(0, 8)}
            </h3>
            <p className="text-gray-600">
              Created on {format(parseISO(booking.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Guest Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <UserIcon size={18} className="mr-2 text-blue-600" />
                  <span className="font-medium">
                    {guest.firstName} {guest.lastName}
                  </span>
                </div>
                <div className="text-sm text-gray-600 ml-7">{guest.email}</div>
                <div className="text-sm text-gray-600 ml-7">{guest.phone}</div>
                {guest.idNumber && <div className="text-sm text-gray-600 ml-7">
                    ID: {guest.idType?.replace('_', ' ')} - {guest.idNumber}
                  </div>}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Room Details</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <HomeIcon size={18} className="mr-2 text-blue-600" />
                  <span className="font-medium">Room {room.number}</span>
                </div>
                <div className="text-sm text-gray-600 ml-7 capitalize">
                  {room.type} Room - Capacity: {room.capacity}
                </div>
                <div className="text-sm text-gray-600 ml-7">
                  ${room.pricePerNight} per night
                </div>
                <div className="text-sm text-gray-600 ml-7">
                  Amenities: {room.amenities.join(', ')}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Booking Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CalendarIcon size={18} className="mr-2 mt-0.5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-700">
                      Stay Duration
                    </div>
                    <div className="text-sm text-gray-600">
                      Check-in: {format(checkInDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      Check-out: {format(checkOutDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {nights} {nights === 1 ? 'night' : 'nights'}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <UserIcon size={18} className="mr-2 mt-0.5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-700">Guests</div>
                    <div className="text-sm text-gray-600">
                      {booking.adults}{' '}
                      {booking.adults === 1 ? 'Adult' : 'Adults'}
                      {booking.children > 0 && `, ${booking.children} ${booking.children === 1 ? 'Child' : 'Children'}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCardIcon size={18} className="mr-2 mt-0.5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-700">Payment</div>
                    <div className="text-sm text-gray-600">
                      Total: ${booking.totalAmount}
                    </div>
                    <div className="flex items-center text-sm">
                      Status:{' '}
                      <StatusBadge status={booking.paymentStatus} className="ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {booking.notes && <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{booking.notes}</p>
              </div>}
            {booking.status === 'checked_in' && <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Extend Stay</h4>
                {showExtendForm ? <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input type="number" min="1" max="30" value={extendDays} onChange={e => setExtendDays(parseInt(e.target.value))} className="p-2 border border-gray-300 rounded-md w-20" />
                      <span className="text-sm text-gray-600">days</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      New check-out:{' '}
                      {format(addDays(checkOutDate, extendDays), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      Additional cost: ${room.pricePerNight * extendDays}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={handleExtendBooking} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Confirm
                      </button>
                      <button onClick={() => setShowExtendForm(false)} className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </div> : <button onClick={() => setShowExtendForm(true)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Extend Stay
                  </button>}
              </div>}
          </div>
        </div>
      </div>
    </Modal>;
};
export default BookingDetailModal;
import React, { useEffect, useState, Children } from 'react';
import Modal from '../ui/Modal';
import { Room, Guest, Booking } from '../../utils/types';
import { format, addDays, differenceInDays } from 'date-fns';
interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  guests: Guest[];
  booking?: Booking;
  onSave: (bookingData: {
    id?: string;
    roomId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    notes?: string;
  }) => void;
}
const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  rooms,
  guests,
  booking,
  onSave
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [roomId, setRoomId] = useState('');
  const [guestId, setGuestId] = useState('');
  const [checkInDate, setCheckInDate] = useState(format(today, 'yyyy-MM-dd'));
  const [checkOutDate, setCheckOutDate] = useState(format(tomorrow, 'yyyy-MM-dd'));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Filter only available rooms
  const availableRooms = rooms.filter(room => room.status === 'available' || booking && room.id === booking.roomId);
  useEffect(() => {
    if (booking) {
      setRoomId(booking.roomId);
      setGuestId(booking.guestId);
      setCheckInDate(booking.checkInDate);
      setCheckOutDate(booking.checkOutDate);
      setAdults(booking.adults);
      setChildren(booking.children);
      setNotes(booking.notes || '');
    } else {
      setRoomId('');
      setGuestId('');
      setCheckInDate(format(today, 'yyyy-MM-dd'));
      setCheckOutDate(format(tomorrow, 'yyyy-MM-dd'));
      setAdults(1);
      setChildren(0);
      setNotes('');
    }
  }, [booking, isOpen]);
  const calculateTotal = () => {
    if (!roomId) return 0;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 0;
    const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate));
    return nights * room.pricePerNight;
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!roomId) newErrors.roomId = 'Please select a room';
    if (!guestId) newErrors.guestId = 'Please select a guest';
    if (!checkInDate) newErrors.checkInDate = 'Please select a check-in date';
    if (!checkOutDate) newErrors.checkOutDate = 'Please select a check-out date';
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
    }
    if (adults < 1) newErrors.adults = 'At least one adult is required';
    const selectedRoom = rooms.find(r => r.id === roomId);
    if (selectedRoom && adults + children > selectedRoom.capacity) {
      newErrors.capacity = `This room can only accommodate ${selectedRoom.capacity} people`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave({
      id: booking?.id,
      roomId,
      guestId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      notes: notes.trim() || undefined
    });
    onClose();
  };
  const selectedRoom = rooms.find(r => r.id === roomId);
  return <Modal isOpen={isOpen} onClose={onClose} title={booking ? 'Edit Booking' : 'New Booking'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <select value={roomId} onChange={e => setRoomId(e.target.value)} className={`w-full p-2 border rounded-md ${errors.roomId ? 'border-red-500' : 'border-gray-300'}`} disabled={!!booking}>
                <option value="">Select a room</option>
                {availableRooms.map(room => <option key={room.id} value={room.id}>
                    Room {room.number} - {room.type} (${room.pricePerNight}
                    /night)
                  </option>)}
              </select>
              {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest
              </label>
              <select value={guestId} onChange={e => setGuestId(e.target.value)} className={`w-full p-2 border rounded-md ${errors.guestId ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select a guest</option>
                {guests.map(guest => <option key={guest.id} value={guest.id}>
                    {guest.firstName} {guest.lastName}
                  </option>)}
              </select>
              {errors.guestId && <p className="text-red-500 text-xs mt-1">{errors.guestId}</p>}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className={`w-full p-2 border rounded-md ${errors.checkInDate ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.checkInDate && <p className="text-red-500 text-xs mt-1">
                  {errors.checkInDate}
                </p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input type="date" value={checkOutDate} min={checkInDate} onChange={e => setCheckOutDate(e.target.value)} className={`w-full p-2 border rounded-md ${errors.checkOutDate ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.checkOutDate && <p className="text-red-500 text-xs mt-1">
                  {errors.checkOutDate}
                </p>}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults
              </label>
              <input type="number" value={adults} min={1} max={selectedRoom?.capacity || 10} onChange={e => setAdults(parseInt(e.target.value))} className={`w-full p-2 border rounded-md ${errors.adults || errors.capacity ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.adults && <p className="text-red-500 text-xs mt-1">{errors.adults}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children
              </label>
              <input type="number" value={children} min={0} max={selectedRoom?.capacity ? selectedRoom.capacity - 1 : 9} onChange={e => setChildren(parseInt(e.target.value))} className={`w-full p-2 border rounded-md ${errors.capacity ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
          </div>
          {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Special requests or additional information" />
          </div>
          {roomId && <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Room Rate:</span>
                <span>${selectedRoom?.pricePerNight} per night</span>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Nights:</span>
                <span>
                  {differenceInDays(new Date(checkOutDate), new Date(checkInDate))}
                </span>
              </div>
              <div className="flex justify-between mt-4 text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>}
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {booking ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </div>
      </form>
    </Modal>;
};
export default BookingFormModal;
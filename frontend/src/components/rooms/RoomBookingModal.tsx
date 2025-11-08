import React, { useState, useEffect } from 'react';
import { Room } from '../../types/types';
import { X, Calendar, User, CreditCard } from 'lucide-react';

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

interface RoomBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  guests: Guest[];
  onCreateBooking: (bookingData: any) => void;
}

const RoomBookingModal: React.FC<RoomBookingModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             room,
                                                             guests,
                                                             onCreateBooking,
                                                           }) => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [selectedGuest, setSelectedGuest] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedGuest('');
      setCheckInDate('');
      setCheckOutDate('');
      setNumberOfGuests(1);
      setSpecialRequests('');
      setErrors({});
    }
  }, [isOpen]);

  // NOW we can do conditional returns AFTER all hooks
  if (!isOpen || !room) {
    return null;
  }

  // Calculate number of nights and total price
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * room.pricePerNight;

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedGuest || selectedGuest === '') {
      newErrors.guest = 'Please select a guest';
    }
    if (!checkInDate) {
      newErrors.checkIn = 'Please select check-in date';
    }
    if (!checkOutDate) {
      newErrors.checkOut = 'Please select check-out date';
    }
    if (checkInDate && checkOutDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }
    if (numberOfGuests < 1) {
      newErrors.numberOfGuests = 'Number of guests must be at least 1';
    }
    if (room.capacity && numberOfGuests > room.capacity) {
      newErrors.numberOfGuests = `Maximum capacity is ${room.capacity} guests`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted with:', {
      selectedGuest,
      checkInDate,
      checkOutDate,
      numberOfGuests,
    });

    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    const bookingData = {
      roomId: room.id,
      guestId: Number(selectedGuest),
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      totalPrice,
      nights,
    };

    console.log('Creating booking:', bookingData);
    onCreateBooking(bookingData);
    handleClose();
  };

  const handleClose = () => {
    setSelectedGuest('');
    setCheckInDate('');
    setCheckOutDate('');
    setNumberOfGuests(1);
    setSpecialRequests('');
    setErrors({});
    onClose();
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log('Guest selected:', value);
    setSelectedGuest(value);
    if (value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.guest;
        return newErrors;
      });
    }
  };

  return (
      <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Book Room</h2>
              <p className="text-sm text-gray-600 mt-1">
                Room {room.number} - {room.type}
              </p>
            </div>
            <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Guest Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-1" />
                  Select Guest *
                </label>
                <select
                    value={selectedGuest}
                    onChange={handleGuestChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.guest ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">-- Choose a guest --</option>
                  {guests && guests.length > 0 ? (
                      guests.map((guest) => (
                          <option key={guest.id} value={guest.id}>
                            {guest.firstName} {guest.lastName}
                            {guest.email && ` (${guest.email})`}
                          </option>
                      ))
                  ) : (
                      <option value="" disabled>No guests available</option>
                  )}
                </select>
                {errors.guest && (
                    <p className="text-red-500 text-sm mt-1">{errors.guest}</p>
                )}
                {(!guests || guests.length === 0) && (
                    <p className="text-amber-600 text-sm mt-1">
                      No guests found. Please add guests first.
                    </p>
                )}
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Check-in Date *
                </label>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => {
                      setCheckInDate(e.target.value);
                      if (e.target.value) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.checkIn;
                          return newErrors;
                        });
                      }
                    }}
                    min={today}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.checkIn ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.checkIn && (
                    <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                )}
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Check-out Date *
                </label>
                <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => {
                      setCheckOutDate(e.target.value);
                      if (e.target.value) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.checkOut;
                          return newErrors;
                        });
                      }
                    }}
                    min={checkInDate || today}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.checkOut ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.checkOut && (
                    <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                )}
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests *
                </label>
                <input
                    type="number"
                    value={numberOfGuests}
                    onChange={(e) => {
                      setNumberOfGuests(Number(e.target.value));
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.numberOfGuests;
                        return newErrors;
                      });
                    }}
                    min="1"
                    max={room.capacity || 10}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.numberOfGuests ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {room.capacity && (
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum capacity: {room.capacity} guests
                    </p>
                )}
                {errors.numberOfGuests && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.numberOfGuests}
                    </p>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    placeholder="Any special requests or requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Booking Summary */}
              {nights > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2 mb-3">
                      <CreditCard className="text-blue-600 mt-1" size={20} />
                      <h3 className="text-lg font-semibold text-blue-900">
                        Booking Summary
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Price per night:</span>
                        <span className="font-medium text-gray-900">
                      ₱{room.pricePerNight.toLocaleString()}
                    </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Number of nights:</span>
                        <span className="font-medium text-gray-900">{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Number of guests:</span>
                        <span className="font-medium text-gray-900">
                      {numberOfGuests}
                    </span>
                      </div>
                      <div className="border-t border-blue-300 pt-2 mt-2">
                        <div className="flex justify-between">
                      <span className="text-lg font-bold text-blue-900">
                        Total Price:
                      </span>
                          <span className="text-lg font-bold text-blue-900">
                        ₱{totalPrice.toLocaleString()}
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={!guests || guests.length === 0}
                  className={`px-4 py-2 rounded-md transition-colors ${
                      !guests || guests.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default RoomBookingModal;
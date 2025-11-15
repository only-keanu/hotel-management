import React from 'react';
import { Room } from '../../types/types';
import { X, Edit, Calendar, DoorOpen, Bed, Users } from 'lucide-react';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onEdit: (room: Room) => void;
  onBook: (room: Room) => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           room,
                                                           onEdit,
                                                           onBook,
                                                         }) => {
  if (!isOpen || !room) return null;

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  };

  const statusIcons = {
    available: '✓',
    occupied: '◉',
    maintenance: '⚠',
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              Room {room.number}
            </h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
            <span
                className={`px-3 py-1 rounded-full font-medium text-sm ${
                    statusColors[room.status]
                }`}
            >
              {statusIcons[room.status]} {room.status.toUpperCase()}
            </span>
            </div>

            {/* Room Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <DoorOpen className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {room.number}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Bed className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {room.type}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {room.capacity || 2} Guests
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Price per Night</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ₱{room.pricePerNight.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {room.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {room.description}
                  </p>
                </div>
            )}

            {/* Room Status Info */}
            {room.status === 'occupied' && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Room Status
                  </h3>
                  <p className="text-sm text-blue-800">
                    This room is currently occupied. Check the bookings page for details.
                  </p>
                </div>
            )}

            {room.status === 'maintenance' && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Maintenance
                  </h3>
                  <p className="text-sm text-yellow-800">
                    This room is currently under maintenance and unavailable for booking.
                  </p>
                </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
                onClick={() => onEdit(room)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <Edit size={16} />
              Edit Room
            </button>
            {room.status === 'available' && (
                <button
                    onClick={() => onBook(room)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Calendar size={16} />
                  Book Now
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default RoomDetailModal;
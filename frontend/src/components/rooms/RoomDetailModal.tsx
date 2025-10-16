import React from 'react';
import Modal from '../ui/Modal';
import { Room } from '../../utils/types';
import { BedDoubleIcon, WifiIcon, TvIcon, DollarSignIcon, UserIcon } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
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
  onBook
}) => {
  if (!room) return null;
  const statusColor = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  };
  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'Wi-Fi':
        return <WifiIcon size={16} className="mr-2" />;
      case 'TV':
        return <TvIcon size={16} className="mr-2" />;
      default:
        return null;
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title={`Room ${room.number} Details`} size="lg" footer={<>
          <button onClick={() => onEdit(room)} className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
            Edit Room
          </button>
          {room.status === 'available' && <button onClick={() => onBook(room)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Book Now
            </button>}
        </>}>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Room {room.number}
            </h3>
            <p className="text-gray-600 capitalize">{room.type} Room</p>
          </div>
          <StatusBadge status={room.status} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Room Details</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <BedDoubleIcon size={18} className="mr-2" />
                  <span className="capitalize">{room.type} Room</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserIcon size={18} className="mr-2" />
                  <span>
                    Capacity: {room.capacity}{' '}
                    {room.capacity === 1 ? 'Person' : 'People'}
                  </span>
                </div>
                <div className="flex items-center text-blue-600 font-medium">
                  <DollarSignIcon size={18} className="mr-2" />
                  <span>${room.pricePerNight} per night</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div size={18} className="mr-2" />
                  <span>
                    Status: <span className="capitalize">{room.status}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity, index) => <div key={index} className="flex items-center text-gray-600">
                    {renderAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Room Preview</h4>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <BedDoubleIcon size={48} className="text-gray-400" />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                This {room.type} room offers comfortable accommodations with{' '}
                {room.amenities.join(', ')}.
              </p>
              <p className="mt-2">
                Perfect for{' '}
                {room.capacity === 1 ? 'single travelers' : room.capacity === 2 ? 'couples or business travelers' : 'families or small groups'}
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>;
};
export default RoomDetailModal;
import React from 'react';
import { Room } from '../../types/types';
import StatusBadge from '../ui/StatusBadge';
import Card from '../ui/Card';
import { BedDoubleIcon, WifiIcon, TvIcon, DollarSignIcon } from 'lucide-react';
interface RoomCardProps {
  room: Room;
  onViewDetails: () => void;
  onBookNow: () => void;
}
const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onViewDetails,
  onBookNow
}) => {
  const getRoomTypeIcon = () => {
    switch (room.type) {
      case 'single':
        return <BedDoubleIcon size={16} className="mr-1" />;
      case 'double':
        return <BedDoubleIcon size={16} className="mr-1" />;
      case 'suite':
        return <BedDoubleIcon size={16} className="mr-1" />;
      case 'family':
        return <BedDoubleIcon size={16} className="mr-1" />;
      default:
        return <BedDoubleIcon size={16} className="mr-1" />;
    }
  };
  return <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">Room {room.number}</h3>
          <StatusBadge status={room.status} />
        </div>
        <div className="text-sm text-gray-600 flex items-center mb-2">
          {getRoomTypeIcon()}
          <span className="capitalize">{room.type}</span>
          <span className="mx-2">•</span>
          <span>
            {room.capacity} {room.capacity === 1 ? 'Person' : 'People'}
          </span>
        </div>
        <div className="flex items-center text-blue-600 font-semibold mb-3">
          <DollarSignIcon size={16} className="mr-1" />${room.pricePerNight}{' '}
          <span className="text-gray-500 font-normal text-xs ml-1">
            per night
          </span>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity, index) => <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                {amenity === 'Wi-Fi' && <WifiIcon size={12} className="mr-1" />}
                {amenity === 'TV' && <TvIcon size={12} className="mr-1" />}
                {amenity}
              </span>)}
            {room.amenities.length > 3 && <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                +{room.amenities.length - 3} more
              </span>}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <button onClick={onViewDetails} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View Details
        </button>
        {room.status === 'available' && <button onClick={onBookNow} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
            Book Now
          </button>}
      </div>
    </Card>;
};
export default RoomCard;
import { useEffect, useState } from 'react';
import RoomCard from '../components/rooms/RoomCard';
import Card from '../components/ui/Card';
import { mockGuests } from '../utils/mockData';
import roomService from '../services/roomService';
import { PlusIcon, FilterIcon } from 'lucide-react';
import RoomDetailModal from '../components/rooms/RoomDetailModal';
import RoomBookingModal from '../components/rooms/RoomBookingModal';
import RoomFormModal from '../components/rooms/RoomFormModal';
import { Room, RoomDTO, RoomStatus } from "../types/types";
import bookingApi from "../services/bookingApi.tsx";

const Rooms = () => {
  const [filter, setFilter] = useState<'all' | RoomStatus>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getAllRooms();
      console.log("Fetched rooms:", data);
      setRooms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms by status
  const filteredRooms = rooms.filter(room => filter === 'all' ? true : room.status === filter);

  // Handlers
  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsAddModalOpen(true);
  };

  const handleSaveRoom = async (roomData: RoomDTO, roomId?: number) => {
    try {
      if (roomId) {
        await roomService.updateRoom(roomId, roomData);
      } else {
        await roomService.createRoom(roomData);
      }
      await fetchRooms();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert('Failed to save Room: ' + errorMessage);
      console.error('Error saving room:', err);
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      console.log('Creating booking with data:', bookingData);
      const newBooking = await bookingApi.createBooking({
        roomId: bookingData.roomId,
        guestId: bookingData.guestId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        specialRequests: bookingData.specialRequests || '',
        totalPrice: bookingData.totalPrice,
      });

      alert(`Booking created successfully! Booking ID: ${newBooking.id}`);
      await fetchRooms();
      setIsBookingModalOpen(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert('Failed to create booking: ' + errorMessage);
      console.error('Error creating booking:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading rooms...</p>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="flex justify-center items-center h-64">
          <Card className="p-6">
            <p className="text-red-600">Error: {error}</p>
            <button
                onClick={fetchRooms}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </Card>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
            <p className="text-gray-600">Manage your hotel rooms and availability</p>
          </div>
          <button
              onClick={handleAddRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <PlusIcon size={16} className="mr-1" />
            Add New Room
          </button>
        </div>

        {/* Filter */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center mr-4">
              <FilterIcon size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>
            {['all', 'available', 'occupied', 'maintenance'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f as 'all' | RoomStatus)}
                    className={`px-3 py-1 rounded-md text-sm ${
                        filter === f
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
          </div>
        </Card>

        {/* Room grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                  <RoomCard
                      key={room.id}
                      room={room}
                      onViewDetails={() => handleViewDetails(room)}
                      onBookNow={() => handleBookRoom(room)}
                  />
              ))
          ) : (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <p className="text-gray-500">No rooms match the selected filter</p>
                </Card>
              </div>
          )}
        </div>

        {/* Modals */}
        <RoomDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            room={selectedRoom}
            onEdit={handleEditRoom}
            onBook={handleBookRoom}
        />
        <RoomBookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            room={selectedRoom}
            guests={mockGuests}
            onCreateBooking={handleCreateBooking}
        />
        <RoomFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            room={selectedRoom}
            onSave={handleSaveRoom}
        />
        <RoomFormModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveRoom}
        />
      </div>
  );
};

export default Rooms;

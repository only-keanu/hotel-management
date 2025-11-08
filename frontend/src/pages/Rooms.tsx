import React, {useEffect, useState} from 'react';
import RoomCard from '../components/rooms/RoomCard';
import Card from '../components/ui/Card';
import { mockRooms, mockGuests } from '../utils/mockData';
import roomService from '../services/roomService';
import bookingService from '../services/bookingService';
import { PlusIcon, FilterIcon } from 'lucide-react';
import RoomDetailModal from '../components/rooms/RoomDetailModal';
import RoomBookingModal from '../components/rooms/RoomBookingModal';
import RoomFormModal from '../components/rooms/RoomFormModal';
import {Room,RoomDTO} from "../types/types.ts";

const Rooms = () => {
  const [filter, setFilter] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // filteredRooms now declared AFTER rooms
  const filteredRooms = filter === 'all' ? rooms : rooms.filter(room => room.status === filter);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getAllRooms();
      setRooms(data);
    }
    catch (err: any) {
      setError(err.message || 'Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    }
    finally {
      setLoading(false);
    }
  }

  const handleViewDetails = room => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
  };

  const handleBookRoom = room => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleEditRoom = room => {
    setSelectedRoom(room);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsAddModalOpen(true);
  };

  const handleSaveRoom = async (roomData: RoomDTO, roomId?: number): Promise<void> => {
    try {
      if(roomId){
        await roomService.updateRoom(roomId, roomData);
      }
      else{
        await roomService.createRoom(roomData);
      }
      await fetchRooms();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedRoom(null);
    }
    catch(err: any){
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert('Failed to save Room: ' + errorMessage);
      console.error('Error saving room:', err);
      throw err;
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      console.log('Creating booking with data:', bookingData);

      // Create booking in backend
      const newBooking = await bookingService.createBooking({
        roomId: bookingData.roomId,
        guestId: bookingData.guestId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        specialRequests: bookingData.specialRequests || '',
        totalPrice: bookingData.totalPrice,
      });

      console.log('Booking created successfully:', newBooking);

      // Show success message
      alert(`Booking created successfully! Booking ID: ${newBooking.id}`);

      // Refresh rooms to update availability
      await fetchRooms();

      // Close the booking modal
      setIsBookingModalOpen(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert('Failed to create booking: ' + errorMessage);
      console.error('Error creating booking:', err);
    }
  };

  // Show loading state
  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading rooms...</p>
        </div>
    );
  }

  // Show error state
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rooms</h1>
            <p className="text-gray-600">
              Manage your hotel rooms and availability
            </p>
          </div>
          <button
              onClick={handleAddRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <PlusIcon size={16} className="mr-1" />
            Add New Room
          </button>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center mr-4">
              <FilterIcon size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>
            <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Rooms
            </button>
            <button
                onClick={() => setFilter('available')}
                className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Available
            </button>
            <button
                onClick={() => setFilter('occupied')}
                className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'occupied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Occupied
            </button>
            <button
                onClick={() => setFilter('maintenance')}
                className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Maintenance
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map(room => (
              <RoomCard
                  key={room.id}
                  room={room}
                  onViewDetails={() => handleViewDetails(room)}
                  onBookNow={() => handleBookRoom(room)}
              />
          ))}
          {filteredRooms.length === 0 && (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    No rooms match the selected filter
                  </p>
                </Card>
              </div>
          )}
        </div>

        {/* Room Detail Modal */}
        <RoomDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            room={selectedRoom}
            onEdit={handleEditRoom}
            onBook={handleBookRoom}
        />

        {/* Room Booking Modal */}
        <RoomBookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            room={selectedRoom}
            guests={mockGuests}
            onCreateBooking={handleCreateBooking}
        />

        {/* Room Edit Modal */}
        <RoomFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            room={selectedRoom}
            onSave={handleSaveRoom}
        />

        {/* Room Add Modal */}
        <RoomFormModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveRoom}
        />
      </div>
  );
};

export default Rooms;
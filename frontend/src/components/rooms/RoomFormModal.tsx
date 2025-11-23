import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { Room } from '../../types/types';

interface RoomFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
  onSave: (roomData: {
    id?: number;
    number: string;
    type: string;
    pricePerNight: number;
    status: 'available' | 'occupied' | 'maintenance';
    amenities: string[];
    description?: string;
    capacity?: number;
  }) => void;
}

const RoomFormModal: React.FC<RoomFormModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       room,
                                                       onSave
                                                     }) => {
  const [number, setNumber] = useState('');
  const [type, setType] = useState('single');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [pricePerNight, setPricePerNight] = useState<number | ''>('');
  const [status, setStatus] = useState<'available' | 'occupied' | 'maintenance'>('available');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roomTypes = ['single', 'double', 'suite', 'family', 'deluxe', 'standard'];
  const commonAmenities = [
    'Wi-Fi',
    'TV',
    'Air Conditioning',
    'Mini Bar',
    'Jacuzzi',
    'Room Service',
    'Kitchen',
    'Ocean View',
    'Balcony',
    'Safe'
  ];

  useEffect(() => {
    if (room) {
      setNumber(room.number);
      setType(room.type);
      setCapacity(room.capacity ?? '');
      setPricePerNight(room.pricePerNight);
      setStatus(room.status);
      setDescription(room.description ?? '');
      setAmenities(room.amenities ?? []);
    } else {
      setNumber('');
      setType('single');
      setCapacity('');
      setPricePerNight('');
      setStatus('available');
      setDescription('');
      setAmenities([]);
    }
    setErrors({});
  }, [room, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!number.trim()) {
      newErrors.number = 'Room number is required';
    }

    if (!type.trim()) {
      newErrors.type = 'Room type is required';
    }

    if (pricePerNight === '' || pricePerNight <= 0) {
      newErrors.pricePerNight = 'Price must be greater than 0';
    }

    if (capacity !== '' && capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      id: room?.id,
      number: number.trim(),
      type: type.trim(),
      pricePerNight: Number(pricePerNight),
      status,
      amenities,
      description: description.trim() || undefined,
      capacity: capacity !== '' ? Number(capacity) : undefined
    });
    onClose();
  };

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const addCustomAmenity = () => {
    const trimmedAmenity = newAmenity.trim();
    if (trimmedAmenity && !amenities.includes(trimmedAmenity)) {
      setAmenities([...amenities, trimmedAmenity]);
      setNewAmenity('');
    }
  };

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          title={room ? 'Edit Room' : 'Add New Room'}
          size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number*
                </label>
                <input
                    type="text"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                        errors.number ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.number && (
                    <p className="text-red-500 text-xs mt-1">{errors.number}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type*
                </label>
                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  {roomTypes.map(roomType => (
                      <option key={roomType} value={roomType}>
                        {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
                      </option>
                  ))}
                </select>
                {errors.type && (
                    <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night*
                </label>
                <input
                    type="number"
                    value={pricePerNight}
                    min={0}
                    step="0.01"
                    onChange={e => setPricePerNight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className={`w-full p-2 border rounded-md ${
                        errors.pricePerNight ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.pricePerNight && (
                    <p className="text-red-500 text-xs mt-1">{errors.pricePerNight}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                    type="number"
                    value={capacity}
                    min={1}
                    onChange={e => setCapacity(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className={`w-full p-2 border rounded-md ${
                        errors.capacity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Optional"
                />
                {errors.capacity && (
                    <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status*
              </label>
              <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'available' | 'occupied' | 'maintenance')}
                  className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Optional room description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {commonAmenities.map(amenity => (
                    <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 text-sm rounded-md border ${
                            amenities.includes(amenity)
                                ? 'bg-blue-100 border-blue-500 text-blue-800'
                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {amenity}
                    </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                    type="text"
                    value={newAmenity}
                    onChange={e => setNewAmenity(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                    placeholder="Add custom amenity"
                    className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
              {amenities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {amenities.filter(a => !commonAmenities.includes(a)).map((amenity, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800"
                        >
                    {amenity}
                          <button
                              type="button"
                              onClick={() => setAmenities(amenities.filter(a => a !== amenity))}
                              className="ml-1 text-green-600 hover:text-green-800"
                          >
                      ×
                    </button>
                  </span>
                    ))}
                  </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {room ? 'Update Room' : 'Add Room'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
  );
};

export default RoomFormModal;
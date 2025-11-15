import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import {
  PlusIcon, SearchIcon, UserIcon, MailIcon, PhoneIcon,
  BookOpenIcon, EyeIcon, EditIcon, Trash2Icon
} from 'lucide-react';
import guestService from '../services/guestService';
import { Guest, GuestDTO } from '../types/types';
import GuestFormModal from "../components/guests/GuestFormModal";
import GuestViewModal from "../components/guests/GuestViewModal";

const Guests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isViewGuestModalOpen, setIsViewGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [viewGuest, setViewGuest] = useState<Guest | null>(null);

  // Fetch guests
  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await guestService.getAllGuests();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data received from server');
      }
      setGuests(data);
    } catch (err: any) {
      console.error('Error fetching guests:', err);
      setError(err.message || 'Failed to fetch guests');
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  // Filter guests based on search term
  const filteredGuests = guests.filter((guest) => {
    const fullName = `${guest.firstName ?? ''} ${guest.middleName ?? ''} ${guest.lastName ?? ''}`.toLowerCase();
    return (
        fullName.includes(searchTerm.toLowerCase()) ||
        (guest.emailAddress ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guest.mobileNo ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (guest.identificationNo ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Modal handlers
  const handleAddGuest = () => {
    setSelectedGuest(null);
    setIsAddGuestModalOpen(true);
  };

  const handleViewGuest = (guest: Guest) => {
    setViewGuest(guest);
    setIsViewGuestModalOpen(true);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsAddGuestModalOpen(true);
  };

  const handleEditFromView = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsViewGuestModalOpen(false);
    setIsAddGuestModalOpen(true);
  };

  const handleSaveGuest = async (guestData: GuestDTO, guestId?: number) => {
    try {
      if (guestId) {
        await guestService.updateGuest(guestId, guestData);
      } else {
        await guestService.createGuest(guestData);
      }
      await fetchGuests();
      setIsAddGuestModalOpen(false);
      setSelectedGuest(null);
    } catch (err: any) {
      console.error('Error saving guest:', err);
      alert('Failed to save guest: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this guest? This action cannot be undone.')) {
      try {
        await guestService.deleteGuest(id);
        await fetchGuests();
      } catch (err: any) {
        console.error('Error deleting guest:', err);
        alert('Failed to delete guest: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading guests...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-600">{error}</p>
            <button onClick={fetchGuests} className="mt-2 text-red-600 hover:text-red-800 underline">
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Guests</h1>
            <p className="text-gray-600">Manage guest profiles and information</p>
          </div>
          <button
              onClick={handleAddGuest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <PlusIcon size={16} className="mr-1" />
            Add Guest
          </button>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search guests by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </Card>

        {/* Guest Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th>Guest</th>
              <th className="hidden md:table-cell">Contact</th>
              <th className="hidden lg:table-cell">ID No.</th>
              <th>Bookings</th>
              <th className="text-center">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    {searchTerm
                        ? 'No guests found matching your search'
                        : 'No guests yet. Click "Add Guest" to create one.'}
                  </td>
                </tr>
            ) : (
                filteredGuests.map((guest) => {
                  const fullName = `${guest.firstName ?? ''} ${guest.middleName ?? ''} ${guest.lastName ?? ''}`.trim();
                  const guestBookings = guest.bookings ?? [];

                  return (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon size={20} className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{fullName || 'Unnamed Guest'}</div>
                              <div className="text-sm text-gray-500 md:hidden">{guest.emailAddress}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="flex flex-col">
                            {guest.emailAddress && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <MailIcon size={14} className="mr-1 text-gray-400" />
                                  {guest.emailAddress}
                                </div>
                            )}
                            {(guest.mobileNo || guest.telephoneNo) && (
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <PhoneIcon size={14} className="mr-1 text-gray-400" />
                                  {guest.mobileNo || guest.telephoneNo}
                                </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {guest.identificationNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BookOpenIcon size={16} className="text-blue-600 mr-2" />
                            <span className="text-sm text-gray-900">{guestBookings.length}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleViewGuest(guest)} title="View Guest" className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                              <EyeIcon size={18} />
                            </button>
                            <button onClick={() => handleEditGuest(guest)} title="Edit Guest" className="p-2 text-green-600 hover:bg-green-50 rounded-md">
                              <EditIcon size={18} />
                            </button>
                            <button onClick={() => handleDeleteGuest(guest.id)} title="Delete Guest" className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                              <Trash2Icon size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  );
                })
            )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        <GuestFormModal
            isOpen={isAddGuestModalOpen}
            onClose={() => {
              setIsAddGuestModalOpen(false);
              setSelectedGuest(null);
            }}
            guest={selectedGuest}
            onSave={handleSaveGuest}
        />

        <GuestViewModal
            isOpen={isViewGuestModalOpen}
            onClose={() => {
              setIsViewGuestModalOpen(false);
              setViewGuest(null);
            }}
            guest={viewGuest}
            onEdit={handleEditFromView}
        />
      </div>
  );
};

export default Guests;

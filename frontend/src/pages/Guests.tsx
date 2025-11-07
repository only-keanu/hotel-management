import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { PlusIcon, SearchIcon, UserIcon, MailIcon, PhoneIcon, BookOpenIcon } from 'lucide-react';
import GuestFormModal from '../components/guests/GuestFormModal';
import guestService from '../services/guestService';
import { Guest } from '../utils/types';

const Guests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState<boolean>(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch guests from backend on component mount
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await guestService.getAllGuests();
      setGuests(data);
    } catch (err: any) {
      setError('Failed to fetch guests: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter guests based on search term
  const filteredGuests = guests.filter((guest: Guest) =>
      guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGuest = (): void => {
    setSelectedGuest(null);
    setIsAddGuestModalOpen(true);
  };

  const handleEditGuest = (guest: Guest): void => {
    setSelectedGuest(guest);
    setIsAddGuestModalOpen(true);
  };

  const handleSaveGuest = async (guestData: Guest): Promise<void> => {
    try {
      if (guestData.id) {
        // Update existing guest
        await guestService.updateGuest(guestData.id, guestData);
      } else {
        // Add new guest
        await guestService.createGuest(guestData);
      }

      // Refresh the guest list
      await fetchGuests();
      setIsAddGuestModalOpen(false);

    } catch (err: any) {
      alert('Failed to save guest: ' + (err.response?.data?.message || err.message));
      console.error('Error saving guest:', err);
    }
  };

  const handleDeleteGuest = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await guestService.deleteGuest(id);
        await fetchGuests(); // Refresh the list
      } catch (err: any) {
        alert('Failed to delete guest: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting guest:', err);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading guests...</div>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-600">{error}</p>
            <button
                onClick={fetchGuests}
                className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
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

        <Card className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search guests by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </Card>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Guest
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Contact
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                ID
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bookings
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredGuests.map((guest: Guest) => {
              const guestBookings = guest.bookings || [];

              return (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserIcon size={20} className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {guest.fullName}
                          </div>
                          <div className="text-sm text-gray-500 md:hidden">
                            {guest.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-500">
                          <MailIcon size={14} className="mr-1 text-gray-400" />
                          {guest.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <PhoneIcon size={14} className="mr-1 text-gray-400" />
                          {guest.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      <span className="text-gray-600">ID: {guest.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpenIcon size={16} className="text-blue-600 mr-2" />
                        <span className="text-sm text-gray-900">
                        {guestBookings.length}
                      </span>
                        {guestBookings.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {guestBookings.some((b) => b.status === 'checked_in')
                              ? 'Active Stay'
                              : 'Past Stays'}
                        </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                          onClick={() => handleEditGuest(guest)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                          onClick={() => guest.id && handleDeleteGuest(guest.id)}
                          className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
              );
            })}
            {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    {searchTerm
                        ? 'No guests found matching your search'
                        : 'No guests yet. Click "Add Guest" to create one.'}
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Guest Modal */}
        <GuestFormModal
            isOpen={isAddGuestModalOpen}
            onClose={() => setIsAddGuestModalOpen(false)}
            guest={selectedGuest}
            onSave={handleSaveGuest}
        />
      </div>
  );
};

export default Guests;
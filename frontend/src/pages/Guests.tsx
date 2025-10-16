import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { mockGuests, mockBookings } from '../utils/mockData';
import { PlusIcon, SearchIcon, UserIcon, MailIcon, PhoneIcon, BookOpenIcon } from 'lucide-react';
import GuestFormModal from '../components/guests/GuestFormModal';
import { Guest } from '../utils/types';
const Guests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  // Local state to manage guests (in a real app, this would be connected to a backend)
  const [guests, setGuests] = useState(mockGuests);
  const filteredGuests = guests.filter(guest => guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || guest.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAddGuest = () => {
    setSelectedGuest(null);
    setIsAddGuestModalOpen(true);
  };
  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsAddGuestModalOpen(true);
  };
  const handleSaveGuest = (guestData: any) => {
    if (guestData.id) {
      // Update existing guest
      setGuests(guests.map(guest => guest.id === guestData.id ? {
        ...guest,
        ...guestData
      } : guest));
    } else {
      // Add new guest
      const newGuest = {
        ...guestData,
        id: Math.random().toString(36).substr(2, 9),
        bookingHistory: []
      };
      setGuests([...guests, newGuest]);
    }
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Guests</h1>
          <p className="text-gray-600">Manage guest profiles and information</p>
        </div>
        <button onClick={handleAddGuest} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm">
          <PlusIcon size={16} className="mr-1" />
          Add Guest
        </button>
      </div>
      <Card className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search guests by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </Card>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bookings
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGuests.map(guest => {
            const guestBookings = mockBookings.filter(booking => booking.guestId === guest.id);
            return <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {guest.firstName} {guest.lastName}
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
                    {guest.idType && guest.idNumber ? <span className="capitalize">
                        {guest.idType.replace('_', ' ')}: {guest.idNumber}
                      </span> : <span className="text-gray-400">Not provided</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpenIcon size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-gray-900">
                        {guestBookings.length}
                      </span>
                      {guestBookings.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                          {guestBookings.some(b => b.status === 'checked_in') ? 'Active Stay' : 'Past Stays'}
                        </span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button onClick={() => handleEditGuest(guest)} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                  </td>
                </tr>;
          })}
            {filteredGuests.length === 0 && <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No guests found matching your search
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Guest Modal */}
      <GuestFormModal isOpen={isAddGuestModalOpen} onClose={() => setIsAddGuestModalOpen(false)} guest={selectedGuest} onSave={handleSaveGuest} />
    </div>;
};
export default Guests;
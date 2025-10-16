import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { Guest } from '../../utils/types';
interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest;
  onSave: (guestData: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    idNumber?: string;
    idType?: 'passport' | 'driver_license' | 'national_id';
    notes?: string;
  }) => void;
}
const GuestFormModal: React.FC<GuestFormModalProps> = ({
  isOpen,
  onClose,
  guest,
  onSave
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idType, setIdType] = useState<'passport' | 'driver_license' | 'national_id' | ''>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (guest) {
      setFirstName(guest.firstName);
      setLastName(guest.lastName);
      setEmail(guest.email);
      setPhone(guest.phone);
      setAddress(guest.address || '');
      setIdNumber(guest.idNumber || '');
      setIdType(guest.idType || '');
      setNotes(guest.notes || '');
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setIdNumber('');
      setIdType('');
      setNotes('');
    }
    setErrors({});
  }, [guest, isOpen]);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (idType && !idNumber) newErrors.idNumber = 'ID number is required when ID type is selected';
    if (idNumber && !idType) newErrors.idType = 'ID type is required when ID number is provided';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave({
      id: guest?.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
      idNumber: idNumber.trim() || undefined,
      idType: idType || undefined,
      notes: notes.trim() || undefined
    });
    onClose();
  };
  return <Modal isOpen={isOpen} onClose={onClose} title={guest ? 'Edit Guest' : 'Add New Guest'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone*
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Street, City, State, Zip" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Type
              </label>
              <select value={idType} onChange={e => setIdType(e.target.value as any)} className={`w-full p-2 border rounded-md ${errors.idType ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select ID Type</option>
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID</option>
              </select>
              {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number
              </label>
              <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} className={`w-full p-2 border rounded-md ${errors.idNumber ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Additional information, preferences, etc." />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {guest ? 'Update Guest' : 'Add Guest'}
            </button>
          </div>
        </div>
      </form>
    </Modal>;
};
export default GuestFormModal;
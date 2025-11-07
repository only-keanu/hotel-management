import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Guest } from '../../utils/types';

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onSave: (guest: Guest) => Promise<void>;
}

const GuestFormModal: React.FC<GuestFormModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         guest,
                                                         onSave,
                                                       }) => {
  const [formData, setFormData] = useState<Guest>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update form when guest prop changes
  useEffect(() => {
    if (guest) {
      setFormData({
        id: guest.id,
        fullName: guest.fullName,
        email: guest.email,
        phone: guest.phone,
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
      });
    }
    setErrors({});
  }, [guest, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      // Success - modal will be closed by parent component
    } catch (error) {
      console.error('Error saving guest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={onClose}
          ></div>

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {guest ? 'Edit Guest' : 'Add New Guest'}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                    type="button"
                >
                  <XIcon size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                  >
                    Full Name *
                  </label>
                  <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="John Doe"
                  />
                  {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                  >
                    Email *
                  </label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="john@example.com"
                  />
                  {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number *
                  </label>
                  <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="+1 234 567 8900"
                  />
                  {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                          isSubmitting
                              ? 'bg-blue-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                  >
                    {isSubmitting ? 'Saving...' : guest ? 'Update Guest' : 'Add Guest'}
                  </button>
                  <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GuestFormModal;
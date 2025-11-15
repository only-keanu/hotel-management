import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Guest, GuestDTO } from "../../types/types";

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onSave: (guest: GuestDTO, guestId?: number) => Promise<void>;
}

const GuestFormModal: React.FC<GuestFormModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         guest,
                                                         onSave,
                                                       }) => {
  const [formData, setFormData] = useState<GuestDTO>({
    identificationNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    civilStatus: '',
    birthDate: '',
    placeOfBirth: '',
    homeAddress: '',
    country: '',
    citizenship: '',
    mobileNo: '',
    telephoneNo: '',
    emailAddress: '',
    companyName: '',
    companyAddress: '',
    companyTelephoneNo: '',
    companyZipCode: '',
    companyEmailAddress: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyContactNumber: '',
    emergencyContactAddress: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when editing an existing guest
  useEffect(() => {
    if (guest) {
      setFormData({
        identificationNo: guest.identificationNo || '',
        firstName: guest.firstName || '',
        middleName: guest.middleName || '',
        lastName: guest.lastName || '',
        gender: guest.gender || '',
        civilStatus: guest.civilStatus || '',
        birthDate: guest.birthDate || '',
        placeOfBirth: guest.placeOfBirth || '',
        homeAddress: guest.homeAddress || '',
        country: guest.country || '',
        citizenship: guest.citizenship || '',
        mobileNo: guest.mobileNo || '',
        telephoneNo: guest.telephoneNo || '',
        emailAddress: guest.emailAddress || '',
        companyName: guest.companyName || '',
        companyAddress: guest.companyAddress || '',
        companyTelephoneNo: guest.companyTelephoneNo || '',
        companyZipCode: guest.companyZipCode || '',
        companyEmailAddress: guest.companyEmailAddress || '',
        emergencyContactFirstName: guest.emergencyContactFirstName || '',
        emergencyContactLastName: guest.emergencyContactLastName || '',
        emergencyContactNumber: guest.emergencyContactNumber || '',
        emergencyContactAddress: guest.emergencyContactAddress || '',
      });
    } else {
      setFormData({
        identificationNo: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        civilStatus: '',
        birthDate: '',
        placeOfBirth: '',
        homeAddress: '',
        country: '',
        citizenship: '',
        mobileNo: '',
        telephoneNo: '',
        emailAddress: '',
        companyName: '',
        companyAddress: '',
        companyTelephoneNo: '',
        companyZipCode: '',
        companyEmailAddress: '',
        emergencyContactFirstName: '',
        emergencyContactLastName: '',
        emergencyContactNumber: '',
        emergencyContactAddress: '',
      });
    }
    setErrors({});
  }, [guest, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.identificationNo.trim())
      newErrors.identificationNo = 'Identification No. is required';
    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim())
      newErrors.lastName = 'Last name is required';

    // Optional: Email validation
    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData, guest?.id);
      onClose();
    } catch (error) {
      console.error('Error saving guest:', error);
      alert('Failed to save guest. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
          ></div>

          <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl w-full my-8">
            <div className="bg-white px-6 py-5">
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
                {/* Identification No. */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Identification No. *
                  </label>
                  <input
                      type="text"
                      name="identificationNo"
                      value={formData.identificationNo}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                          errors.identificationNo ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.identificationNo && (
                      <p className="text-sm text-red-600 mt-1">{errors.identificationNo}</p>
                  )}
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Contact & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile No.
                    </label>
                    <input
                        type="text"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telephone No.
                    </label>
                    <input
                        type="text"
                        name="telephoneNo"
                        value={formData.telephoneNo}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                      type="email"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${
                          errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.emailAddress && (
                      <p className="text-sm text-red-600 mt-1">{errors.emailAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Home Address
                  </label>
                  <input
                      type="text"
                      name="homeAddress"
                      value={formData.homeAddress}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Company Info */}
                <div className="border-t pt-3">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Company Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleChange}
                        placeholder="Company Address"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="companyTelephoneNo"
                        value={formData.companyTelephoneNo}
                        onChange={handleChange}
                        placeholder="Company Telephone No."
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="companyZipCode"
                        value={formData.companyZipCode}
                        onChange={handleChange}
                        placeholder="Zip Code"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="companyEmailAddress"
                        value={formData.companyEmailAddress}
                        onChange={handleChange}
                        placeholder="Company Email Address"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-3">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Emergency Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        type="text"
                        name="emergencyContactFirstName"
                        value={formData.emergencyContactFirstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="emergencyContactLastName"
                        value={formData.emergencyContactLastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                      type="text"
                      name="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={handleChange}
                      placeholder="Contact Number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                      type="text"
                      name="emergencyContactAddress"
                      value={formData.emergencyContactAddress}
                      onChange={handleChange}
                      placeholder="Address"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="mt-5 flex justify-end gap-3">
                  <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-md text-white ${
                          isSubmitting
                              ? 'bg-blue-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    {isSubmitting ? 'Saving...' : guest ? 'Update Guest' : 'Add Guest'}
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
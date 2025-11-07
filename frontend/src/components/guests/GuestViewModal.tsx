import React from 'react';
import { XIcon, UserIcon, MailIcon, PhoneIcon, HomeIcon, BriefcaseIcon, AlertCircleIcon, IdCardIcon, GlobeIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { Guest } from "../../types/types";

interface GuestViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    guest: Guest | null;
    onEdit: (guest: Guest) => void;
}

const GuestViewModal: React.FC<GuestViewModalProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           guest,
                                                           onEdit,
                                                       }) => {
    if (!isOpen || !guest) return null;

    const fullName = `${guest.firstName ?? ''} ${guest.middleName ?? ''} ${guest.lastName ?? ''}`.trim();
    const guestBookings = guest.bookings || [];

    const InfoSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="mb-6">
            <div className="flex items-center mb-3">
                <div className="text-blue-600 mr-2">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {children}
            </div>
        </div>
    );

    const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
        if (!value) return null;
        return (
            <div className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                <span className="text-sm font-medium text-gray-600">{label}:</span>
                <span className="text-sm text-gray-900">{value}</span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-3xl w-full my-8 align-middle">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-16 w-16 bg-white rounded-full flex items-center justify-center">
                                    <UserIcon size={32} className="text-blue-600" />
                                </div>
                                <div className="ml-4 text-white">
                                    <h2 className="text-2xl font-bold">{fullName || 'Unnamed Guest'}</h2>
                                    <p className="text-blue-100 text-sm mt-1">ID: {guest.identificationNo}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition-colors"
                                type="button"
                            >
                                <XIcon size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        {/* Personal Information */}
                        <InfoSection title="Personal Information" icon={<UserIcon size={20} />}>
                            <InfoRow label="First Name" value={guest.firstName} />
                            <InfoRow label="Middle Name" value={guest.middleName} />
                            <InfoRow label="Last Name" value={guest.lastName} />
                            <InfoRow label="Gender" value={guest.gender} />
                            <InfoRow label="Civil Status" value={guest.civilStatus} />
                            <InfoRow label="Birth Date" value={guest.birthDate} />
                            <InfoRow label="Place of Birth" value={guest.placeOfBirth} />
                        </InfoSection>

                        {/* Identification & Citizenship */}
                        <InfoSection title="Identification & Citizenship" icon={<IdCardIcon size={20} />}>
                            <InfoRow label="Identification No" value={guest.identificationNo} />
                            <InfoRow label="Country" value={guest.country} />
                            <InfoRow label="Citizenship" value={guest.citizenship} />
                        </InfoSection>

                        {/* Contact Information */}
                        <InfoSection title="Contact Information" icon={<PhoneIcon size={20} />}>
                            <InfoRow label="Email Address" value={guest.emailAddress} />
                            <InfoRow label="Mobile No" value={guest.mobileNo} />
                            <InfoRow label="Telephone No" value={guest.telephoneNo} />
                            <InfoRow label="Home Address" value={guest.homeAddress} />
                        </InfoSection>

                        {/* Company Information */}
                        {(guest.companyName || guest.companyAddress || guest.companyTelephoneNo || guest.companyEmailAddress) && (
                            <InfoSection title="Company Information" icon={<BriefcaseIcon size={20} />}>
                                <InfoRow label="Company Name" value={guest.companyName} />
                                <InfoRow label="Company Address" value={guest.companyAddress} />
                                <InfoRow label="Company Telephone" value={guest.companyTelephoneNo} />
                                <InfoRow label="Company Email" value={guest.companyEmailAddress} />
                                <InfoRow label="Zip Code" value={guest.companyZipCode} />
                            </InfoSection>
                        )}

                        {/* Emergency Contact */}
                        {(guest.emergencyContactFirstName || guest.emergencyContactLastName || guest.emergencyContactNumber) && (
                            <InfoSection title="Emergency Contact" icon={<AlertCircleIcon size={20} />}>
                                <InfoRow
                                    label="Contact Name"
                                    value={`${guest.emergencyContactFirstName || ''} ${guest.emergencyContactLastName || ''}`.trim()}
                                />
                                <InfoRow label="Contact Number" value={guest.emergencyContactNumber} />
                                <InfoRow label="Contact Address" value={guest.emergencyContactAddress} />
                            </InfoSection>
                        )}

                        {/* Booking Statistics */}
                        <InfoSection title="Booking Information" icon={<CalendarIcon size={20} />}>
                            <div className="text-center py-4">
                                <div className="text-4xl font-bold text-blue-600">{guestBookings.length}</div>
                                <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
                            </div>
                        </InfoSection>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                onEdit(guest);
                                onClose();
                            }}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Edit Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestViewModal;
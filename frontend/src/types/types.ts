// Guest Type (matching backend GuestModel)
export interface Guest {
    // Basic Guest Information
    id?: number;
    lastName: string;
    firstName: string;
    middleName?: string;
    homeAddress?: string;
    gender?: string;
    civilStatus?: string;
    birthDate?: string;
    placeOfBirth?: string;
    identificationNo: string;
    country?: string;
    citizenship?: string;
    // Contact Information
    mobileNo?: string;
    telephoneNo?: string;
    emailAddress?: string;
    // Company Information
    companyName?: string;
    companyAddress?: string;
    companyTelephoneNo?: string;
    companyZipCode?: string;
    companyEmailAddress?: string;
    // Emergency Contact
    emergencyContactFirstName?: string;
    emergencyContactLastName?: string;
    emergencyContactNumber?: string;
    emergencyContactAddress?: string;
    bookings?: Booking[];
}

// DTO for creating/updating guests (without id and bookings)
export interface GuestDTO {
    lastName: string;
    firstName: string;
    middleName?: string;
    homeAddress?: string;
    gender?: string;
    civilStatus?: string;
    birthDate?: string;
    placeOfBirth?: string;
    identificationNo: string;
    country?: string;
    citizenship?: string;
    mobileNo?: string;
    telephoneNo?: string;
    emailAddress?: string;
    companyName?: string;
    companyAddress?: string;
    companyTelephoneNo?: string;
    companyZipCode?: string;
    companyEmailAddress?: string;
    emergencyContactFirstName?: string;
    emergencyContactLastName?: string;
    emergencyContactNumber?: string;
    emergencyContactAddress?: string;
}

// Booking Type (matching backend BookingModel)
export interface Booking {
    id?: number;
    guestId?: number;
    roomId?: number;
    checkInDate: string;
    checkOutDate: string;
    status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    totalAmount?: number;
    guest?: Guest;
}

// Room Type - Updated to match backend RoomModel
export interface Room {
    id: number;
    number: string;              // ← not roomNumber
    type: string;
    pricePerNight: number;       // ← not price
    amenities: string[];         // ← add this
    status: 'available' | 'occupied' | 'maintenance';
    description?: string;
    capacity?: number;
}


// Room DTO for creating/updating rooms
export type RoomDTO = Omit<Room, 'id'>;

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Form Data Types
export interface GuestFormData {
    id?: number;
    fullName: string;
    email: string;
    phone: string;
}

export interface BookingFormData {
    id?: number;
    guestId: number;
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    totalAmount?: number;
}
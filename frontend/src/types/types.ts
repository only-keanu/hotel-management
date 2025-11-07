// Guest Type (matching backend GuestModel)
export interface Guest {
    id?: number;
    fullName: string;
    email: string;
    phone: string;
    bookings?: Booking[];
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

// Room Type
export interface Room {
    id?: number;
    roomNumber: string;
    roomType: string;
    price: number;
    status: 'available' | 'occupied' | 'maintenance';
    description?: string;
}

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
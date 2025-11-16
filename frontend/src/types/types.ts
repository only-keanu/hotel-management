// Enums - matching backend exactly
export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'all';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';
export type RoomType = 'single' | 'double' | 'suite' | 'family' | 'deluxe';
export type ChecklistCategory = 'room_inspection' | 'amenities' | 'cleaning' | 'maintenance' | 'guest_services';

// Guest Interface - matching your GuestModel
export interface Guest {
    bookings: Booking[];
    id: number;
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

// Room Interface - matching your RoomModel
export interface Room {
    id: number;
    number: string;
    type: string;
    capacity?: number;
    pricePerNight: number;
    status: RoomStatus;
    amenities: string[];
    description?: string;
}

// Checklist Item Interface - UNIFIED VERSION matching backend ChecklistItemModel
export interface ChecklistItem {
    id: number;
    item: string;  // The actual checklist item text
    category: ChecklistCategory;
    completed: boolean;  // renamed from 'checked' to match backend
    notes?: string;
}

// Booking Interface - matching your BookingModel
export interface Booking {
    id: number;
    guestId: number;  // Just ID, not full object
    roomId: number;   // Just ID, not full object
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    totalAmount: number;
    status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    checklist?: any[];
}

// API Request Types
export interface CreateBookingRequest {
    guestId: number;
    roomId: number;
    checkInDate: string; // ISO date string (YYYY-MM-DD)
    checkOutDate: string; // ISO date string (YYYY-MM-DD)
    adults: number;
    children?: number;
    paymentStatus?: string;
    notes?: string;
}

export interface ExtendBookingRequest {
    newCheckOutDate: string; // ISO date string (YYYY-MM-DD)
}

export interface UpdateChecklistRequest {
    checklist: ChecklistItem[];
}

// API Response Types
export interface BookingResponse {
    data: Booking;
    message?: string;
}

export interface BookingsResponse {
    data: Booking[];
    total: number;
    message?: string;
}

export interface RoomResponse {
    data: Room;
    message?: string;
}

export interface RoomsResponse {
    data: Room[];
    total: number;
    message?: string;
}

export interface ChecklistResponse {
    data: ChecklistItem[];
    message?: string;
}

export interface ErrorResponse {
    error: string;
    message: string;
    timestamp: string;
}

// Guest Form Data
export interface GuestFormData {
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

// Inventory Types
export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    minimumLevel: number;
    currentLevel: number;
    lastRestocked: string; // ISO date string
    notes?: string;
}

// Expense Types
export interface Expense {
    id: string;
    date: string; // ISO date string
    category: string;
    amount: number;
    description: string;
    paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
    receiptNumber?: string;
    notes?: string;
}

export class RoomDTO {
    number!: string;
    type!: string;
    capacity?: number;
    pricePerNight!: number;
    status!: RoomStatus;
    amenities!: string[];
    description?: string;

    constructor(data: Partial<RoomDTO>) {
        Object.assign(this, data);
    }
}


export class GuestDTO {
    id?: number;
    lastName!: string;
    firstName!: string;
    middleName?: string;
    homeAddress?: string;
    gender?: string;
    civilStatus?: string;
    birthDate?: string;
    placeOfBirth?: string;
    identificationNo!: string;
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

    constructor(data: Partial<GuestDTO>) {
        Object.assign(this, data);
    }
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;          // Maximum/total capacity
    currentLevel: number;      // Current stock level
    minimumLevel: number;      // Threshold for low stock alerts
    unit: string;              // e.g., "piece", "box", "bottle"
    notes?: string | undefined;
    lastRestocked: string;     // ISO date string
}

// For creating new items (without id and lastRestocked)
export interface CreateInventoryItemDto {
    name: string;
    category: string;
    quantity: number;
    currentLevel: number;
    minimumLevel: number;
    unit: string;
    notes?: string | null;
}

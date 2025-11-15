// Enums - matching backend exactly
export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';
export type RoomType = 'single' | 'double' | 'suite' | 'family' | 'deluxe';
export type ChecklistCategory = 'room_inspection' | 'amenities' | 'cleaning' | 'maintenance' | 'guest_services';

// Guest Interface - matching your GuestModel
export interface Guest {
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

// Checklist Item Interface
export interface ChecklistItem {
  id: number;
  item: string;
  category: ChecklistCategory;
  completed: boolean;
  notes?: string;
}

// Booking Interface - matching your BookingModel
export interface Booking {
  id: number;
  guestId: number;
  roomId: number;
  checkInDate: string; // ISO date string (YYYY-MM-DD)
  checkOutDate: string; // ISO date string (YYYY-MM-DD)
  adults: number;
  children: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  checklist?: ChecklistItem[];
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
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

// Guest Types
export interface GuestFormData {
  // Basic Guest Information
  id?: number
  lastName: string
  firstName: string
  middleName?: string
  homeAddress?: string
  gender?: string
  civilStatus?: string
  birthDate?: string
  placeOfBirth?: string
  identificationNo: string
  country?: string
  citizenship?: string
  // Contact Information
  mobileNo?: string
  telephoneNo?: string
  emailAddress?: string
  // Company Information
  companyName?: string
  companyAddress?: string
  companyTelephoneNo?: string
  companyZipCode?: string
  companyEmailAddress?: string
  // Emergency Contact
  emergencyContactFirstName?: string
  emergencyContactLastName?: string
  emergencyContactNumber?: string
  emergencyContactAddress?: string
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

// Checklist Types
export interface ChecklistItem {
  id: number;
  name: string;
  description?: string;
  checked: boolean;
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
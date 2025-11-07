// Room Types
export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'family';
  capacity: number;
  pricePerNight: number;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
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
// Booking Types
export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  createdAt: string; // ISO date string
  notes?: string;
  adults: number;
  children: number;
  checklist?: ChecklistItem[];
}
// Checklist Types
export interface ChecklistItem {
  id: string;
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
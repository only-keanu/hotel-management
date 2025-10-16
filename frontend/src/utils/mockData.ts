import { Room, Guest, Booking, ChecklistItem, InventoryItem, Expense } from './types';
import { format, addDays, subDays } from 'date-fns';
// Generate random ID
const generateId = () => Math.random().toString(36).substr(2, 9);
// Generate dates
const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
// Mock Rooms
export const mockRooms: Room[] = [{
  id: generateId(),
  number: '101',
  type: 'single',
  capacity: 1,
  pricePerNight: 89,
  status: 'available',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning']
}, {
  id: generateId(),
  number: '102',
  type: 'double',
  capacity: 2,
  pricePerNight: 129,
  status: 'occupied',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar']
}, {
  id: generateId(),
  number: '103',
  type: 'double',
  capacity: 2,
  pricePerNight: 129,
  status: 'available',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar']
}, {
  id: generateId(),
  number: '201',
  type: 'suite',
  capacity: 2,
  pricePerNight: 199,
  status: 'maintenance',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Room Service']
}, {
  id: generateId(),
  number: '202',
  type: 'family',
  capacity: 4,
  pricePerNight: 249,
  status: 'available',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchen']
}, {
  id: generateId(),
  number: '203',
  type: 'family',
  capacity: 4,
  pricePerNight: 249,
  status: 'occupied',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchen']
}, {
  id: generateId(),
  number: '301',
  type: 'suite',
  capacity: 2,
  pricePerNight: 219,
  status: 'available',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi', 'Room Service', 'Ocean View']
}, {
  id: generateId(),
  number: '302',
  type: 'double',
  capacity: 2,
  pricePerNight: 149,
  status: 'available',
  amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Ocean View']
}];
// Mock Guests
export const mockGuests: Guest[] = [{
  id: generateId(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  address: '123 Main St, Anytown, CA',
  idNumber: 'AB123456',
  idType: 'passport',
  notes: 'Repeat customer, prefers high floor',
  bookingHistory: []
}, {
  id: generateId(),
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '555-987-6543',
  address: '456 Oak Ave, Somewhere, NY',
  idNumber: 'CD789012',
  idType: 'driver_license',
  bookingHistory: []
}, {
  id: generateId(),
  firstName: 'Robert',
  lastName: 'Johnson',
  email: 'robert.j@example.com',
  phone: '555-456-7890',
  address: '789 Pine St, Nowhere, TX',
  idNumber: 'EF345678',
  idType: 'national_id',
  notes: 'Allergic to feather pillows',
  bookingHistory: []
}, {
  id: generateId(),
  firstName: 'Maria',
  lastName: 'Garcia',
  email: 'maria.g@example.com',
  phone: '555-234-5678',
  address: '321 Cedar Rd, Anyplace, FL',
  idNumber: 'GH901234',
  idType: 'passport',
  bookingHistory: []
}];
// Mock Room Checklist Items
export const mockChecklistItems: ChecklistItem[] = [{
  id: generateId(),
  name: 'Television Remote',
  description: 'Check if TV remote is working and has batteries',
  checked: false
}, {
  id: generateId(),
  name: 'Air Conditioning',
  description: 'Verify AC is operational and set to 72°F',
  checked: false
}, {
  id: generateId(),
  name: 'Bathroom Supplies',
  description: 'Ensure soap, shampoo, and toilet paper are stocked',
  checked: false
}, {
  id: generateId(),
  name: 'Bed Linens',
  description: 'Check if bed is properly made with clean linens',
  checked: false
}, {
  id: generateId(),
  name: 'Towels',
  description: 'Verify clean towels are available (2 bath, 2 hand)',
  checked: false
}, {
  id: generateId(),
  name: 'Mini Bar',
  description: 'Check if mini bar is stocked and priced',
  checked: false
}, {
  id: generateId(),
  name: 'Room Key',
  description: 'Ensure room key/card is programmed and working',
  checked: false
}, {
  id: generateId(),
  name: 'Wi-Fi Information',
  description: 'Confirm Wi-Fi instructions are visible and correct',
  checked: false
}];
// Mock Bookings
export const mockBookings: Booking[] = [{
  id: generateId(),
  roomId: mockRooms[1].id,
  guestId: mockGuests[0].id,
  checkInDate: formatDate(subDays(today, 2)),
  checkOutDate: formatDate(addDays(today, 3)),
  status: 'checked_in',
  totalAmount: 129 * 5,
  paymentStatus: 'paid',
  createdAt: formatDate(subDays(today, 10)),
  notes: 'Guest requested extra towels',
  adults: 2,
  children: 0,
  checklist: mockChecklistItems.map(item => ({
    ...item,
    checked: Math.random() > 0.5
  }))
}, {
  id: generateId(),
  roomId: mockRooms[5].id,
  guestId: mockGuests[2].id,
  checkInDate: formatDate(subDays(today, 1)),
  checkOutDate: formatDate(addDays(today, 6)),
  status: 'checked_in',
  totalAmount: 249 * 7,
  paymentStatus: 'partial',
  createdAt: formatDate(subDays(today, 15)),
  notes: 'Family vacation, requested crib',
  adults: 2,
  children: 2,
  checklist: mockChecklistItems.slice(0, 5).map(item => ({
    ...item,
    checked: Math.random() > 0.5
  }))
}, {
  id: generateId(),
  roomId: mockRooms[0].id,
  guestId: mockGuests[1].id,
  checkInDate: formatDate(addDays(today, 5)),
  checkOutDate: formatDate(addDays(today, 7)),
  status: 'confirmed',
  totalAmount: 89 * 2,
  paymentStatus: 'pending',
  createdAt: formatDate(subDays(today, 3)),
  adults: 1,
  children: 0
}, {
  id: generateId(),
  roomId: mockRooms[6].id,
  guestId: mockGuests[3].id,
  checkInDate: formatDate(addDays(today, 2)),
  checkOutDate: formatDate(addDays(today, 9)),
  status: 'confirmed',
  totalAmount: 219 * 7,
  paymentStatus: 'paid',
  createdAt: formatDate(subDays(today, 20)),
  notes: 'Honeymoon couple, prepare champagne',
  adults: 2,
  children: 0
}];
// Mock Inventory Items
export const mockInventoryItems: InventoryItem[] = [{
  id: generateId(),
  name: 'Bath Towels',
  category: 'Linens',
  quantity: 200,
  unit: 'piece',
  minimumLevel: 50,
  currentLevel: 120,
  lastRestocked: formatDate(subDays(today, 15)),
  notes: 'Standard white bath towels'
}, {
  id: generateId(),
  name: 'Toilet Paper',
  category: 'Bathroom Supplies',
  quantity: 500,
  unit: 'roll',
  minimumLevel: 100,
  currentLevel: 180,
  lastRestocked: formatDate(subDays(today, 7))
}, {
  id: generateId(),
  name: 'Shampoo',
  category: 'Bathroom Supplies',
  quantity: 300,
  unit: 'bottle',
  minimumLevel: 75,
  currentLevel: 95,
  lastRestocked: formatDate(subDays(today, 20)),
  notes: 'Small travel-sized bottles'
}, {
  id: generateId(),
  name: 'Bed Sheets',
  category: 'Linens',
  quantity: 150,
  unit: 'set',
  minimumLevel: 40,
  currentLevel: 85,
  lastRestocked: formatDate(subDays(today, 30))
}, {
  id: generateId(),
  name: 'Coffee Packets',
  category: 'Food & Beverage',
  quantity: 1000,
  unit: 'packet',
  minimumLevel: 200,
  currentLevel: 350,
  lastRestocked: formatDate(subDays(today, 10))
}, {
  id: generateId(),
  name: 'Water Bottles',
  category: 'Food & Beverage',
  quantity: 500,
  unit: 'bottle',
  minimumLevel: 100,
  currentLevel: 230,
  lastRestocked: formatDate(subDays(today, 5))
}, {
  id: generateId(),
  name: 'Cleaning Solution',
  category: 'Cleaning Supplies',
  quantity: 50,
  unit: 'gallon',
  minimumLevel: 10,
  currentLevel: 18,
  lastRestocked: formatDate(subDays(today, 25)),
  notes: 'All-purpose cleaner'
}];
// Mock Expenses
export const mockExpenses: Expense[] = [{
  id: generateId(),
  date: formatDate(subDays(today, 2)),
  category: 'Supplies',
  amount: 450.75,
  description: 'Bathroom supplies restock',
  paymentMethod: 'card',
  receiptNumber: 'INV-4578',
  notes: 'Monthly order from supplier XYZ'
}, {
  id: generateId(),
  date: formatDate(subDays(today, 5)),
  category: 'Utilities',
  amount: 1250.0,
  description: 'Electricity bill',
  paymentMethod: 'bank_transfer',
  receiptNumber: 'UTIL-789'
}, {
  id: generateId(),
  date: formatDate(subDays(today, 7)),
  category: 'Maintenance',
  amount: 325.5,
  description: 'Plumbing repair in Room 201',
  paymentMethod: 'cash',
  notes: 'Emergency repair'
}, {
  id: generateId(),
  date: formatDate(subDays(today, 10)),
  category: 'Food',
  amount: 875.25,
  description: 'Breakfast supplies',
  paymentMethod: 'card',
  receiptNumber: 'GR-1234'
}, {
  id: generateId(),
  date: formatDate(subDays(today, 15)),
  category: 'Staff',
  amount: 4500.0,
  description: 'Staff salaries',
  paymentMethod: 'bank_transfer'
}];
// Update booking history for guests
mockGuests.forEach((guest, index) => {
  guest.bookingHistory = mockBookings.filter(booking => booking.guestId === guest.id).map(booking => booking.id);
});
// Stats for dashboard
export const mockStats = {
  totalRooms: mockRooms.length,
  availableRooms: mockRooms.filter(room => room.status === 'available').length,
  occupiedRooms: mockRooms.filter(room => room.status === 'occupied').length,
  maintenanceRooms: mockRooms.filter(room => room.status === 'maintenance').length,
  upcomingCheckIns: mockBookings.filter(booking => booking.status === 'confirmed').length,
  currentGuests: mockBookings.filter(booking => booking.status === 'checked_in').length,
  monthlyRevenue: 15680,
  occupancyRate: 65 // percentage
};
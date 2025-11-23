import axios, { AxiosResponse } from 'axios';
import { Booking, Room, Guest, ChecklistItem, InventoryItem } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Booking API
export const bookingApi = {
    getAllBookings: async (status?: string): Promise<Booking[]> => {
        const url = status
            ? `${API_BASE_URL}/bookings?status=${status}`
            : `${API_BASE_URL}/bookings`;
        const response: AxiosResponse<Booking[]> = await axios.get(url);
        return response.data;
    },

    getBookingById: async (id: number | string): Promise<Booking> => {
        const response: AxiosResponse<Booking> = await axios.get(`${API_BASE_URL}/bookings/${id}`);
        return response.data;
    },

    getBookingsByRoomId: async (roomId: number): Promise<Booking[]> => {
        const response: AxiosResponse<Booking[]> = await axios.get(`${API_BASE_URL}/bookings/room/${roomId}`);
        return response.data;
    },

    getBookingsByGuestId: async (guestId: number): Promise<Booking[]> => {
        const response: AxiosResponse<Booking[]> = await axios.get(`${API_BASE_URL}/bookings/guest/${guestId}`);
        return response.data;
    },

    createBooking: async (bookingData: any): Promise<Booking> => {
        const response: AxiosResponse<Booking> = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
        return response.data;
    },

    updateBooking: async (id: number | string, bookingData: any): Promise<Booking> => {
        const response: AxiosResponse<Booking> = await axios.put(`${API_BASE_URL}/bookings/${id}`, bookingData);
        return response.data;
    },

    updateBookingStatus: async (id: number | string, status: string): Promise<Booking> => {
        const response: AxiosResponse<Booking> = await axios.patch(`${API_BASE_URL}/bookings/${id}/status`, { status });
        return response.data;
    },

    checkIn: async (id: number | string): Promise<Booking> => {
        const response = await axios.put(`${API_BASE_URL}/bookings/${id}/check-in`);
        return response.data;
    },

    checkOut: async (id: number | string): Promise<Booking> => {
        const response = await axios.put(`${API_BASE_URL}/bookings/${id}/check-out`);
        return response.data;
    },

    extendBooking: async (id: number | string, data: { newCheckOutDate: string }): Promise<Booking> => {
        const response: AxiosResponse<Booking> = await axios.post(`${API_BASE_URL}/bookings/${id}/extend`, data);
        return response.data;
    },

    cancelBooking: async (id: number | string): Promise<Booking> => {
        const response: AxiosResponse<Booking> = await axios.post(`${API_BASE_URL}/bookings/${id}/cancel`);
        return response.data;
    },

    deleteBooking: async (id: number | string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/bookings/${id}`);
    },
};

// Room API
export const roomApi = {
    getAllRooms: async (): Promise<Room[]> => {
        const response: AxiosResponse<Room[]> = await axios.get(`${API_BASE_URL}/rooms`);
        return response.data;
    },

    getRoomById: async (id: number | string): Promise<Room> => {
        const response: AxiosResponse<Room> = await axios.get(`${API_BASE_URL}/rooms/${id}`);
        return response.data;
    },

    getAvailableRooms: async (checkIn: string, checkOut: string): Promise<Room[]> => {
        const response: AxiosResponse<Room[]> = await axios.get(
            `${API_BASE_URL}/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`
        );
        return response.data;
    },
};

// Guest API
export const guestApi = {
    getAllGuests: async (): Promise<Guest[]> => {
        const response: AxiosResponse<Guest[]> = await axios.get(`${API_BASE_URL}/guests`);
        return response.data;
    },

    getGuestById: async (id: number | string): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.get(`${API_BASE_URL}/guests/${id}`);
        return response.data;
    },

    createGuest: async (guestData: any): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.post(`${API_BASE_URL}/guests`, guestData);
        return response.data;
    },

    updateGuest: async (id: number | string, guestData: any): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.put(`${API_BASE_URL}/guests/${id}`, guestData);
        return response.data;
    },
};

// Checklist API
export const checklistApi = {
    getChecklistByBookingId: async (bookingId: number | string): Promise<ChecklistItem[]> => {
        const response: AxiosResponse<ChecklistItem[]> = await axios.get(
            `${API_BASE_URL}/checklist/booking/${bookingId}`
        );
        return response.data;
    },

    createChecklistItem: async (bookingId: number | string, item: any): Promise<ChecklistItem> => {
        const response: AxiosResponse<ChecklistItem> = await axios.post(
            `${API_BASE_URL}/checklist/booking/${bookingId}`,
            item
        );
        return response.data;
    },

    updateChecklistItem: async (itemId: number | string, item: any): Promise<ChecklistItem> => {
        const response: AxiosResponse<ChecklistItem> = await axios.put(
            `${API_BASE_URL}/checklist/${itemId}`,
            item
        );
        return response.data;
    },

    toggleChecklistItem: async (itemId: number | string): Promise<void> => {
        await axios.post(`${API_BASE_URL}/checklist/${itemId}/toggle`);
    },

    deleteChecklistItem: async (itemId: number | string): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/checklist/${itemId}`);
    },

    saveChecklistForBooking: async (bookingId: number | string, checklist: any[]): Promise<ChecklistItem[]> => {
        const response: AxiosResponse<ChecklistItem[]> = await axios.post(
            `${API_BASE_URL}/checklist/booking/${bookingId}/save`,
            checklist
        );
        return response.data;
    },
};

// Inventory API
export const inventoryApi = {
    getAllItems: async (): Promise<InventoryItem[]> => {
        const response: AxiosResponse<InventoryItem[]> = await axios.get(`${API_BASE_URL}/inventory`);
        return response.data;
    },

    getItemById: async (id: string | number): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.get(`${API_BASE_URL}/inventory/${id}`);
        return response.data;
    },

    getItemsByCategory: async (category: string): Promise<InventoryItem[]> => {
        const response: AxiosResponse<InventoryItem[]> = await axios.get(
            `${API_BASE_URL}/inventory/category/${category}`
        );
        return response.data;
    },

    getLowStockItems: async (): Promise<InventoryItem[]> => {
        const response: AxiosResponse<InventoryItem[]> = await axios.get(`${API_BASE_URL}/inventory/low-stock`);
        return response.data;
    },

    createItem: async (itemData: any): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.post(`${API_BASE_URL}/inventory`, itemData);
        return response.data;
    },

    updateItem: async (id: string | number, itemData: any): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.put(
            `${API_BASE_URL}/inventory/${id}`,
            itemData
        );
        return response.data;
    },

    updateQuantity: async (id: string | number, quantity: number): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.patch(
            `${API_BASE_URL}/inventory/${id}/quantity`,
            { quantity }
        );
        return response.data;
    },

    restockItem: async (id: string | number): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.post(`${API_BASE_URL}/inventory/${id}/restock`);
        return response.data;
    },

    deleteItem: async (id: string | number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/inventory/${id}`);
    },
};

export default bookingApi;
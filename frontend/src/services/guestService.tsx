import axios, { AxiosResponse } from 'axios';
import { Guest } from '../utils/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/guests';

const guestService = {
    // Get all guests
    getAllGuests: async (): Promise<Guest[]> => {
        const response: AxiosResponse<Guest[]> = await axios.get(API_BASE_URL);
        return response.data;
    },

    // Get guest by ID
    getGuestById: async (id: number): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    },

    // Create new guest
    createGuest: async (guestData: Omit<Guest, 'id' | 'bookings'>): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.post(API_BASE_URL, guestData);
        return response.data;
    },

    // Update guest
    updateGuest: async (id: number, guestData: Omit<Guest, 'id' | 'bookings'>): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.put(`${API_BASE_URL}/${id}`, guestData);
        return response.data;
    },

    // Delete guest
    deleteGuest: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },

    // Get guest by email
    getGuestByEmail: async (email: string): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.get(`${API_BASE_URL}/email/${email}`);
        return response.data;
    }
};

export default guestService;
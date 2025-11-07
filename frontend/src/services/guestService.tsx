import axios, { AxiosResponse } from 'axios';
import { Guest, GuestDTO } from '../types/types';

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
    createGuest: async (guestData: GuestDTO): Promise<Guest> => {
        // Remove id and bookings if they exist
        const { ...cleanData } = guestData;
        const response: AxiosResponse<Guest> = await axios.post(API_BASE_URL, cleanData);
        return response.data;
    },

    // Update guest
    updateGuest: async (id: number, guestData: GuestDTO): Promise<Guest> => {
        // Remove id and bookings if they exist
        const { ...cleanData } = guestData;
        const response: AxiosResponse<Guest> = await axios.put(`${API_BASE_URL}/${id}`, cleanData);
        return response.data;
    },

    // Delete guest
    deleteGuest: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },

    // Get guest by email
    getGuestByEmail: async (email: string): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.get(`${API_BASE_URL}/email/${encodeURIComponent(email)}`);
        return response.data;
    },

    // Search guests
    searchGuests: async (searchTerm: string): Promise<Guest[]> => {
        const response: AxiosResponse<Guest[]> = await axios.get(`${API_BASE_URL}/search`, {
            params: { q: searchTerm }
        });
        return response.data;
    }
};

export default guestService;
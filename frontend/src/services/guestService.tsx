import axios, { AxiosResponse } from 'axios';
import { Guest } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/guests';

const guestService = {
    getAllGuests: async (): Promise<Guest[]> => {
        const response: AxiosResponse<Guest[]> = await axios.get(API_BASE_URL);
        // Ensure the data is actually an array
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid data received from server');
        }
        return response.data;
    },
    getGuestById: async (id: number): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    },
    createGuest: async (guestData: Partial<Guest>): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.post(API_BASE_URL, guestData);
        return response.data;
    },
    updateGuest: async (id: number, guestData: Partial<Guest>): Promise<Guest> => {
        const response: AxiosResponse<Guest> = await axios.put(`${API_BASE_URL}/${id}`, guestData);
        return response.data;
    },
    deleteGuest: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    }
};

export default guestService;

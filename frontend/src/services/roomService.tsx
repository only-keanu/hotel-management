import axios, { AxiosResponse } from 'axios';
import {Room, RoomDTO} from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/rooms';

const roomService = {
    // Get all Rooms
    getAllRooms: async (): Promise<Room[]> => {
        const response: AxiosResponse<Room[]> = await axios.get(API_BASE_URL);
        return response.data;
    },

    // Get room by ID
    getRoomById: async (id: number): Promise<Room> => {
        const response: AxiosResponse<Room> = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    },

    // Create new room
    createRoom: async (roomData: RoomDTO): Promise<Room> => {
        // Remove id and bookings if they exist
        const { ...cleanData } = roomData;
        const response: AxiosResponse<Room> = await axios.post(API_BASE_URL, cleanData);
        return response.data;
    },

    // Update Room
    updateRoom: async (id: number, roomData: RoomDTO): Promise<Room> => {
        // Remove id and bookings if they exist
        const { ...cleanData } = roomData;
        const response: AxiosResponse<Room> = await axios.put(`${API_BASE_URL}/${id}`, cleanData);
        return response.data;
    },

    // Delete Room
    deleteGuest: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },

};

export default roomService;
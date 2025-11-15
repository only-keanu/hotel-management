import axios, { AxiosResponse } from 'axios';
import { Room, RoomDTO } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/rooms';

const roomService = {
    // Get all rooms
    getAllRooms: async (): Promise<Room[]> => {
        const response: AxiosResponse<Room[] | { data: Room[] }> = await axios.get(API_BASE_URL);

        // Normalize response to always return Room[]
        let rooms: Room[] = [];
        if (Array.isArray(response.data)) {
            rooms = response.data;
        } else if (Array.isArray(response.data.data)) {
            rooms = response.data.data;
        }

        // Normalize fields
        return rooms.map(r => ({
            ...r,
            status: r.status?.toLowerCase() as 'available' | 'occupied' | 'maintenance',
            capacity: r.capacity ?? 1,
            amenities: r.amenities ?? [],
        }));
    },

    // Get room by ID
    getRoomById: async (id: number): Promise<Room> => {
        const response: AxiosResponse<Room> = await axios.get(`${API_BASE_URL}/${id}`);
        const r = response.data;
        return {
            ...r,
            status: r.status?.toLowerCase() as 'available' | 'occupied' | 'maintenance',
            capacity: r.capacity ?? 1,
            amenities: r.amenities ?? [],
        };
    },

    // Create a new room
    createRoom: async (roomData: RoomDTO): Promise<Room> => {
        const { ...cleanData } = roomData;
        const response: AxiosResponse<Room> = await axios.post(API_BASE_URL, cleanData);
        const r = response.data;
        return {
            ...r,
            status: r.status?.toLowerCase() as 'available' | 'occupied' | 'maintenance',
            capacity: r.capacity ?? 1,
            amenities: r.amenities ?? [],
        };
    },

    // Update room
    updateRoom: async (id: number, roomData: RoomDTO): Promise<Room> => {
        const { ...cleanData } = roomData;
        const response: AxiosResponse<Room> = await axios.put(`${API_BASE_URL}/${id}`, cleanData);
        const r = response.data;
        return {
            ...r,
            status: r.status?.toLowerCase() as 'available' | 'occupied' | 'maintenance',
            capacity: r.capacity ?? 1,
            amenities: r.amenities ?? [],
        };
    },

    // Delete room
    deleteRoom: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    },
};

export default roomService;

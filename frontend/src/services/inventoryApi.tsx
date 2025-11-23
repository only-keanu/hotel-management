import axios, { AxiosResponse } from 'axios';
import { InventoryItem } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Inventory API
export const inventoryApi = {
    // Get all inventory items
    getAllItems: async (): Promise<InventoryItem[]> => {
        const response: AxiosResponse<InventoryItem[]> = await axios.get(`${API_BASE_URL}/inventory`);
        return response.data;
    },

    // Get inventory item by ID
    getItemById: async (id: string | number): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.get(`${API_BASE_URL}/inventory/${id}`);
        return response.data;
    },

    // Get items by category
    getItemsByCategory: async (category: string): Promise<InventoryItem[]> => {
        const response: AxiosResponse<InventoryItem[]> = await axios.get(
            `${API_BASE_URL}/inventory/category/${category}`
        );
        return response.data;
    },

    // Get low stock items
    getLowStockItems: async (): Promise<InventoryItem[]> => {
        const response: AxiosResponse<InventoryItem[]> = await axios.get(`${API_BASE_URL}/inventory/low-stock`);
        return response.data;
    },

    // Create new inventory item
    createItem: async (itemData: any): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.post(`${API_BASE_URL}/inventory`, itemData);
        return response.data;
    },

    // Update inventory item
    updateItem: async (id: string | number, itemData: any): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.put(
            `${API_BASE_URL}/inventory/${id}`,
            itemData
        );
        return response.data;
    },

    // Update item quantity (increment/decrement)
    updateQuantity: async (id: string | number, quantity: number): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.patch(
            `${API_BASE_URL}/inventory/${id}/quantity`,
            { quantity }
        );
        return response.data;
    },

    // Restock item to maximum
    restockItem: async (id: string | number): Promise<InventoryItem> => {
        const response: AxiosResponse<InventoryItem> = await axios.post(`${API_BASE_URL}/inventory/${id}/restock`);
        return response.data;
    },

    // Delete inventory item
    deleteItem: async (id: string | number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/inventory/${id}`);
    },
};

export default inventoryApi;
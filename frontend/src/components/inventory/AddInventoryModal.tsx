import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddInventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemData: any) => Promise<void>;
    categories: string[];
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSave,
                                                                 categories
                                                             }) => {
    const [useNewCategory, setUseNewCategory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        newCategory: '',
        quantity: '',
        currentLevel: '',
        minimumLevel: '',
        unit: 'piece',
        notes: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                category: categories.length > 1 ? categories[1] : '',
                newCategory: '',
                quantity: '',
                currentLevel: '',
                minimumLevel: '',
                unit: 'piece',
                notes: '',
            });
            setUseNewCategory(false);
            setErrors({});
        }
    }, [isOpen, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }

        const category = useNewCategory ? formData.newCategory : formData.category;
        if (!category.trim()) {
            newErrors.category = 'Category is required';
        }

        const quantity = parseInt(formData.quantity);
        if (!formData.quantity || isNaN(quantity) || quantity < 1) {
            newErrors.quantity = 'Valid quantity is required';
        }

        const currentLevel = parseInt(formData.currentLevel);
        if (!formData.currentLevel || isNaN(currentLevel) || currentLevel < 0) {
            newErrors.currentLevel = 'Valid current level is required';
        }

        const minimumLevel = parseInt(formData.minimumLevel);
        if (!formData.minimumLevel || isNaN(minimumLevel) || minimumLevel < 0) {
            newErrors.minimumLevel = 'Valid minimum level is required';
        }

        if (!formData.unit.trim()) {
            newErrors.unit = 'Unit is required';
        }

        if (!isNaN(currentLevel) && !isNaN(quantity) && currentLevel > quantity) {
            newErrors.currentLevel = 'Current level cannot exceed total quantity';
        }

        if (!isNaN(minimumLevel) && !isNaN(quantity) && minimumLevel > quantity) {
            newErrors.minimumLevel = 'Minimum level cannot exceed total quantity';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const itemData = {
                name: formData.name.trim(),
                category: useNewCategory ? formData.newCategory.trim() : formData.category,
                quantity: parseInt(formData.quantity),
                currentLevel: parseInt(formData.currentLevel),
                minimumLevel: parseInt(formData.minimumLevel),
                unit: formData.unit.trim(),
                notes: formData.notes.trim() || null,
            };

            await onSave(itemData);
            onClose();
        } catch (error) {
            console.error('Error saving item:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Add Inventory Item
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                            disabled={isSubmitting}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Towels, Soap, Toilet Paper"
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>

                                <div className="flex items-center mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setUseNewCategory(false)}
                                        disabled={isSubmitting}
                                        className={`px-3 py-1 text-sm rounded-l-md border ${
                                            !useNewCategory
                                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                : 'bg-gray-100 text-gray-700 border-gray-300'
                                        }`}
                                    >
                                        Existing
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseNewCategory(true)}
                                        disabled={isSubmitting}
                                        className={`px-3 py-1 text-sm rounded-r-md border ${
                                            useNewCategory
                                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                : 'bg-gray-100 text-gray-700 border-gray-300'
                                        }`}
                                    >
                                        New Category
                                    </button>
                                </div>

                                {!useNewCategory ? (
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.filter(cat => cat !== 'all').map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="newCategory"
                                        value={formData.newCategory}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="e.g., Linens, Cleaning Supplies"
                                    />
                                )}
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.quantity ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="100"
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Level <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="currentLevel"
                                        value={formData.currentLevel}
                                        onChange={handleChange}
                                        min="0"
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.currentLevel ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="75"
                                    />
                                    {errors.currentLevel && (
                                        <p className="mt-1 text-sm text-red-500">{errors.currentLevel}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Level <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="minimumLevel"
                                        value={formData.minimumLevel}
                                        onChange={handleChange}
                                        min="0"
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.minimumLevel ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="20"
                                    />
                                    {errors.minimumLevel && (
                                        <p className="mt-1 text-sm text-red-500">{errors.minimumLevel}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.unit ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="e.g., piece, box, bottle"
                                    />
                                    {errors.unit && (
                                        <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Additional information about this item..."
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Add Item'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddInventoryModal;
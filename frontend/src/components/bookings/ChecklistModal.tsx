import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { Booking, Room, ChecklistItem } from '../../types/types';
import { CheckIcon } from 'lucide-react';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  room: Room | null;
  checklistItems: ChecklistItem[];
  onSaveChecklist: (bookingId: string | number, items: ChecklistItem[]) => void;
}

const ChecklistModal: React.FC<ChecklistModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         booking,
                                                         room,
                                                         checklistItems,
                                                         onSaveChecklist
                                                       }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (isOpen && booking) {
      // Clone the items to avoid modifying the original
      setItems([...checklistItems]);
    }
  }, [isOpen, booking, checklistItems]);

  if (!booking || !room) return null;

  const toggleItem = (id: number) => {
    setItems(items.map(item =>
        item.id === id
            ? { ...item, completed: !item.completed }
            : item
    ));
  };

  const handleSave = () => {
    if (booking) {
      onSaveChecklist(booking.id, items);
      onClose();
    }
  };

  // Calculate completion percentage
  const completedItems = items.filter(item => item.completed).length;
  const completionPercentage = items.length > 0
      ? Math.round((completedItems / items.length) * 100)
      : 0;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const categoryLabels: Record<string, string> = {
    room_inspection: 'Room Inspection',
    amenities: 'Amenities',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    guest_services: 'Guest Services'
  };

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          title={`Room ${room.number} Checklist`}
          size="md"
          footer={
            <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Checklist
            </button>
          }
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">
              Room Inspection Checklist
            </h3>
            <span className="text-sm text-gray-600">
            {completedItems} of {items.length} items completed
          </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            {Object.keys(groupedItems).length > 0 ? (
                Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {categoryLabels[category] || category}
                      </h4>
                      <div className="divide-y border rounded-lg">
                        {categoryItems.map(item => (
                            <div
                                key={item.id}
                                className="p-3 flex items-start justify-between hover:bg-gray-50 cursor-pointer"
                                onClick={() => toggleItem(item.id)}
                            >
                              <div className="flex items-start flex-1">
                                <div
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 ${
                                        item.completed
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300'
                                    }`}
                                >
                                  {item.completed && (
                                      <CheckIcon size={14} className="text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p
                                      className={`font-medium ${
                                          item.completed
                                              ? 'text-gray-500 line-through'
                                              : 'text-gray-700'
                                      }`}
                                  >
                                    {item.item}
                                  </p>
                                  {item.notes && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {item.notes}
                                      </p>
                                  )}
                                </div>
                              </div>
                              <div
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                      item.completed
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-gray-100 text-gray-600'
                                  }`}
                              >
                                {item.completed ? 'Done' : 'Pending'}
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p>No checklist items available for this room</p>
                  <p className="text-sm mt-1">Items will appear here once created</p>
                </div>
            )}
          </div>
        </div>
      </Modal>
  );
};

export default ChecklistModal;
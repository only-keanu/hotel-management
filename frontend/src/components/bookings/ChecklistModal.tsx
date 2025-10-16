import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { Booking, Room, ChecklistItem } from '../../utils/types';
import { CheckIcon, XIcon } from 'lucide-react';
interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  room: Room | null;
  checklistItems: ChecklistItem[];
  onSaveChecklist: (bookingId: string, items: ChecklistItem[]) => void;
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
  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? {
      ...item,
      checked: !item.checked
    } : item));
  };
  const handleSave = () => {
    if (booking) {
      onSaveChecklist(booking.id, items);
      onClose();
    }
  };
  // Calculate completion percentage
  const completedItems = items.filter(item => item.checked).length;
  const completionPercentage = items.length > 0 ? Math.round(completedItems / items.length * 100) : 0;
  return <Modal isOpen={isOpen} onClose={onClose} title={`Room ${room.number} Checklist`} size="md" footer={<button onClick={handleSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Checklist
        </button>}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">
            Room Inspection Checklist
          </h3>
          <span className="text-sm text-gray-600">
            {completedItems} of {items.length} items checked
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{
          width: `${completionPercentage}%`
        }}></div>
        </div>
        <div className="divide-y">
          {items.map(item => <div key={item.id} className="py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => toggleItem(item.id)}>
              <div className="flex items-start">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                  {item.checked && <CheckIcon size={14} className="text-white" />}
                </div>
                <div>
                  <p className={`font-medium ${item.checked ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                    {item.name}
                  </p>
                  {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                </div>
              </div>
              <div className={`text-sm ${item.checked ? 'text-green-600' : 'text-gray-400'}`}>
                {item.checked ? 'Checked' : 'Pending'}
              </div>
            </div>)}
        </div>
        {items.length === 0 && <div className="text-center py-6 text-gray-500">
            No checklist items available for this room
          </div>}
      </div>
    </Modal>;
};
export default ChecklistModal;
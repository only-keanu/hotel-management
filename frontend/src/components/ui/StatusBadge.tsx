import React from 'react';
type StatusType = 'available' | 'occupied' | 'maintenance' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'pending' | 'partial' | 'paid';
interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = ''
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'checked_in':
        return 'bg-blue-100 text-blue-800';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()} ${className}`}>
      {getStatusLabel()}
    </span>;
};
export default StatusBadge;
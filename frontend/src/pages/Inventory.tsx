import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { PlusIcon, SearchIcon, PackageIcon, AlertTriangleIcon, MinusIcon, EditIcon, RefreshCwIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { InventoryItem } from '../types/types';
import { inventoryApi } from '../services/bookingApi';
import AddInventoryModal from '../components/inventory/AddInventoryModal';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showLowStock, setShowLowStock] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ========== FETCH DATA FROM BACKEND ==========

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getAllItems();
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching inventory data:', err);
      setError(err.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  // ========== CALCULATE CATEGORIES ==========

  // Get unique categories from items
  const categories = ['all', ...new Set(items.map(item => item.category))];

  // ========== FILTER INVENTORY ITEMS ==========

  const filteredItems = items.filter(
      item =>
          (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (categoryFilter === 'all' || item.category === categoryFilter) &&
          (!showLowStock || item.currentLevel <= item.minimumLevel)
  );

  // ========== EVENT HANDLERS ==========

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewItem = async (itemData: any) => {
    try {
      await inventoryApi.createItem(itemData);
      await fetchInventoryData(); // Refresh list
    } catch (err: any) {
      console.error('Error creating item:', err);
      alert('Failed to create item: ' + err.message);
      throw err; // Re-throw to keep modal open on error
    }
  };

  const handleIncrement = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.currentLevel >= item.quantity) return;

    try {
      setActionLoading(itemId);
      const newQuantity = item.currentLevel + 1;
      const updatedItem = await inventoryApi.updateQuantity(itemId, newQuantity);

      // Update local state
      setItems(items.map(i => (i.id === itemId ? updatedItem : i)));
    } catch (err: any) {
      console.error('Error incrementing quantity:', err);
      alert('Failed to update quantity: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecrement = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || item.currentLevel <= 0) return;

    try {
      setActionLoading(itemId);
      const newQuantity = item.currentLevel - 1;
      const updatedItem = await inventoryApi.updateQuantity(itemId, newQuantity);

      // Update local state
      setItems(items.map(i => (i.id === itemId ? updatedItem : i)));
    } catch (err: any) {
      console.error('Error decrementing quantity:', err);
      alert('Failed to update quantity: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestock = async (itemId: string) => {
    try {
      setActionLoading(itemId);
      const updatedItem = await inventoryApi.restockItem(itemId);

      // Update local state
      setItems(items.map(i => (i.id === itemId ? updatedItem : i)));
    } catch (err: any) {
      console.error('Error restocking item:', err);
      alert('Failed to restock item: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (itemId: string) => {
    // TODO: Open edit modal
    console.log('Edit item:', itemId);
  };

  // ========== RENDER ==========

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Inventory Management
            </h1>
            <p className="text-gray-600">
              Track and manage hotel supplies and inventory
            </p>
          </div>
          <button
              onClick={handleAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <PlusIcon size={16} className="mr-1" />
            Add Item
          </button>
        </div>

        {error && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
              <button
                  onClick={fetchInventoryData}
                  className="mt-2 text-sm text-red-800 underline"
              >
                Retry
              </button>
            </Card>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center mr-2">
                <PackageIcon size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">Category:</span>
              </div>
              {categories.map(category => (
                  <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-3 py-1 rounded-md text-sm ${
                          categoryFilter === category
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
              ))}
              <button
                  onClick={() => setShowLowStock(!showLowStock)}
                  className={`px-3 py-1 rounded-md text-sm flex items-center ${
                      showLowStock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <AlertTriangleIcon size={14} className="mr-1" />
                Low Stock
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Inventory Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Item
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Last Restocked
              </th>
              <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    {item.notes && (
                        <div className="text-xs text-gray-500">{item.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.currentLevel} / {item.quantity} {item.unit}s
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                          className={`h-2 rounded-full ${
                              item.currentLevel <= item.minimumLevel
                                  ? 'bg-red-500'
                                  : item.currentLevel < item.quantity / 2
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                          }`}
                          style={{
                            width: `${(item.currentLevel / item.quantity) * 100}%`,
                          }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.currentLevel <= item.minimumLevel
                              ? 'bg-red-100 text-red-800'
                              : item.currentLevel < item.quantity / 2
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {item.currentLevel <= item.minimumLevel
                        ? 'Low Stock'
                        : item.currentLevel < item.quantity / 2
                            ? 'Medium'
                            : 'Well Stocked'}
                  </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900">
                      {format(parseISO(item.lastRestocked), 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                          onClick={() => handleDecrement(item.id)}
                          disabled={item.currentLevel === 0 || actionLoading === item.id}
                          className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                          title="Decrease quantity"
                      >
                        <MinusIcon size={18} />
                      </button>
                      <button
                          onClick={() => handleIncrement(item.id)}
                          disabled={item.currentLevel >= item.quantity || actionLoading === item.id}
                          className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                          title="Increase quantity"
                      >
                        <PlusIcon size={18} />
                      </button>
                      <button
                          onClick={() => handleRestock(item.id)}
                          disabled={actionLoading === item.id}
                          className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                          title="Restock to full"
                      >
                        <RefreshCwIcon size={18} className={actionLoading === item.id ? 'animate-spin' : ''} />
                      </button>
                      <button
                          onClick={() => handleEdit(item.id)}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Edit item"
                      >
                        <EditIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No inventory items found matching your search
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Add Item Modal */}
        <AddInventoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveNewItem}
            categories={categories}
        />
      </div>
  );
};

export default Inventory;
import React, { useState } from 'react';
import { Item, Order, OrderItem } from '../types';

interface AddOrderModalProps {
  inventory: Item[];
  onSave: (order: Order) => void;
  onCancel: () => void;
  existingOrderNumbers: string[];
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ inventory, onSave, onCancel, existingOrderNumbers }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity) // Ensure quantity is not negative
    }));
  };

  const validateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedOrderNumber = orderNumber.trim().toUpperCase();

    if (!trimmedOrderNumber) {
      setError('Order number cannot be empty.');
      return;
    }
    if (existingOrderNumbers.includes(trimmedOrderNumber)) {
      setError(`Order number "${trimmedOrderNumber}" already exists.`);
      return;
    }

    const items: OrderItem[] = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    if (items.length === 0) {
      setError('An order must contain at least one item.');
      return;
    }

    onSave({
      orderNumber: trimmedOrderNumber,
      items
    });
  };
  
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <form onSubmit={validateAndSave} className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-auto h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Create New Order</h2>
            <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500">&times;</button>
        </div>
        
        <div className="p-6 flex-grow overflow-y-auto">
            <div className="mb-6">
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-300 mb-2">Order Number</label>
                <input
                    id="orderNumber"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => { setOrderNumber(e.target.value); setError(null); }}
                    placeholder="e.g., ORD-99999"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Inventory Items</h3>
                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                    {inventory.length > 0 ? inventory.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-4 p-2 bg-gray-700/50 rounded-md">
                            <div className="flex items-center gap-3">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain bg-gray-900 rounded-md" />
                                <span className="font-semibold">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity for {item.name}</label>
                                <input
                                    id={`qty-${item.id}`}
                                    type="number"
                                    min="0"
                                    value={quantities[item.id] || 0}
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                    className="w-20 px-2 py-1 bg-gray-900 border border-gray-600 rounded-md text-center"
                                />
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center py-4">No items in inventory. Add items first.</p>
                    )}
                </div>
            </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
            {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}
            <div className="flex justify-between items-center gap-4">
                <span className="text-gray-400">Total Items in Order: <span className="font-bold text-white">{totalItems}</span></span>
                <div className="flex gap-3">
                    <button type="button" onClick={onCancel} className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Save Order
                    </button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrderModal;
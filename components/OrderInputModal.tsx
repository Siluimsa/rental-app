import React, { useState } from 'react';

interface OrderInputModalProps {
  onFindOrder: (orderNumber: string) => void;
  onCancel: () => void;
  error?: string | null;
}

const OrderInputModal: React.FC<OrderInputModalProps> = ({ onFindOrder, onCancel, error }) => {
  const [orderNumber, setOrderNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      onFindOrder(orderNumber.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-center py-4 bg-gray-700/50">Process a Return</h2>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col items-center gap-4">
          <label htmlFor="orderNumber" className="text-gray-300 self-start">
            Enter Order Number:
          </label>
          <input
            id="orderNumber"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g., 'ORD-12345'"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="flex justify-between mt-6 gap-3 w-full">
            <button type="button" onClick={onCancel} className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!orderNumber.trim()} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              Find Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderInputModal;

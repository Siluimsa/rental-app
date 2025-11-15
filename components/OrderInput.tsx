import React, { useState } from 'react';
import Camera from './Camera';
import { CameraIcon } from './icons';

interface OrderInputProps {
  onSubmit: (orderNumber: string, imageData: string) => void;
  findOrder: (orderNumber: string) => boolean; 
}

const OrderInput: React.FC<OrderInputProps> = ({ onSubmit, findOrder }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleStartCamera = () => {
    setError(null);
    const trimmedOrderNumber = orderNumber.trim();
    if (!trimmedOrderNumber) {
      setError("Please enter an order number first.");
      return;
    }
    if (!findOrder(trimmedOrderNumber)) {
      setError(`Order "${trimmedOrderNumber}" not found.`);
      return;
    }
    setIsCameraOpen(true);
  };
  
  const handleCapture = (imageData: string) => {
    setIsCameraOpen(false);
    onSubmit(orderNumber.trim(), imageData);
  };
  
  return (
    <>
      {isCameraOpen && (
        <Camera 
          onCapture={handleCapture}
          onCancel={() => setIsCameraOpen(false)}
        />
      )}
      <div className="w-full max-w-lg mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Process a Return</h2>
        <p className="text-gray-400 mb-6">Enter the order number and take a single photo of all returned items.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleStartCamera(); }} className="space-y-4">
            <div>
                <label htmlFor="orderNumber" className="sr-only">Order Number</label>
                <input
                    id="orderNumber"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => { setOrderNumber(e.target.value); setError(null); }}
                    placeholder="Enter Order Number (e.g., ORD-12345)"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-center text-lg"
                    required
                    autoFocus
                />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-lg"
            >
              <CameraIcon className="w-8 h-8" />
              Take Photo of Items
            </button>
        </form>
      </div>
    </>
  );
};

export default OrderInput;

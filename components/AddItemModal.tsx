import React, { useState } from 'react';

interface AddItemModalProps {
  itemImageUrl: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ itemImageUrl, onSave, onCancel }) => {
  const [name, setName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm mx-auto overflow-hidden">
        <h2 className="text-xl font-bold text-center py-4 bg-gray-700/50">Name New Item</h2>
        <div className="p-6 flex flex-col items-center gap-4">
          <img src={itemImageUrl} alt="New item preview" className="w-40 h-40 object-contain rounded-md bg-gray-900" />
          <form onSubmit={handleSave} className="w-full">
            <label htmlFor="itemName" className="sr-only">Item Name</label>
            <input
              id="itemName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 'Blue Water Bottle'"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-between mt-6 gap-3">
              <button type="button" onClick={onCancel} className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={!name.trim()} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;

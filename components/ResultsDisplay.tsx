import React from 'react';
import { OrderResult, Item } from '../types';
import { CheckIcon, XIcon } from './icons';

interface ResultsDisplayProps {
  result: OrderResult;
  onReset: () => void;
}

const ResultsList: React.FC<{ title: string; items: Item[]; icon: React.ReactNode; itemClass: string }> = ({ title, items, icon, itemClass }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex-1">
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">{icon} {title} ({items.length})</h3>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className={`flex items-center gap-3 p-2 rounded-md ${itemClass}`}>
              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain rounded-md bg-gray-700" />
              <span className="font-semibold">{item.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">None</p>
      )}
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const allReturned = result.missingItems.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold">Return Summary</h2>
        <p className="text-gray-400 text-lg">Order #{result.orderNumber}</p>
      </div>

      {allReturned && (
         <div className="w-full p-4 text-center bg-green-900/50 rounded-md text-green-300 font-bold text-xl">
            Success! All items from the order have been returned.
        </div>
      )}

      <div className="w-full flex flex-col md:flex-row gap-6">
        <ResultsList 
            title="Returned Items" 
            items={result.returnedItems} 
            icon={<CheckIcon className="w-6 h-6 text-green-400"/>} 
            itemClass="bg-green-900/50"
        />
        <ResultsList 
            title="Missing Items" 
            items={result.missingItems} 
            icon={<XIcon className="w-6 h-6 text-red-400"/>} 
            itemClass="bg-red-900/50"
        />
      </div>

      <button
        onClick={onReset}
        className="mt-6 w-full max-w-sm px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg"
      >
        Process Another Return
      </button>
    </div>
  );
};

export default ResultsDisplay;

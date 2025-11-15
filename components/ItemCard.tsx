import React from 'react';
import { CheckIcon } from './icons';

interface ItemCardProps {
  title: string;
  imageUrl?: string | null;
  children?: React.ReactNode;
  isVerified?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ title, imageUrl, children, isVerified }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden relative">
      <h3 className="text-lg font-semibold text-center py-3 bg-gray-700/50 truncate px-2">{title}</h3>
      <div className="p-4 aspect-square flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
          <div className="text-gray-500 w-full h-full flex items-center justify-center">
            {children || 'No Image'}
          </div>
        )}
      </div>
      {isVerified && (
        <div className="absolute inset-0 bg-green-800/70 flex flex-col items-center justify-center backdrop-blur-sm">
            <CheckIcon className="w-16 h-16 text-white"/>
            <span className="text-white font-bold text-xl mt-2">Returned</span>
        </div>
      )}
    </div>
  );
};

export default ItemCard;

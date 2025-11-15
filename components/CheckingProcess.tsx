import React from 'react';
import Spinner from './Spinner';

const CheckingProcess: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 p-8">
      <Spinner />
      <h2 className="text-2xl font-bold text-white animate-pulse">Analyzing Return...</h2>
      <p className="text-gray-400 max-w-sm">
        Our AI is carefully checking the items in your photo against the order details. This might take a moment.
      </p>
    </div>
  );
};

export default CheckingProcess;

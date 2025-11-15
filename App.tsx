import React, { useState } from 'react';
import { Item, Order, CheckStatus, OrderResult } from './types';
import { detectItemsInImage } from './services/geminiService';
import { PackageIcon, PlusIcon } from './components/icons';

// New Components
import OrderInput from './components/OrderInput';
import CheckingProcess from './components/CheckingProcess';
import ResultsDisplay from './components/ResultsDisplay';
import AddOrderModal from './components/AddOrderModal';


// Re-used Components
import Camera from './components/Camera';
import AddItemModal from './components/AddItemModal';
import ItemCard from './components/ItemCard';


// --- MOCK DATA ---
const BOTTLE_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXNyeW50YXgtbnMjIj4KICAgICAAPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CkyCJ1kAAIABEgARAEAAYdCZRU1fX//+Y3VsemVsbG93d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d'
const BACKPACK_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXNyeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CkwidZAAAgAElEQVR4AezdCZRU1fX//5ulZ597h5dkd0EEUUAFVBAFEV1wByw2FkccxRlnNNEokhiNRoPGGHMMGvEgjqgR17iO4+iMM84oKgoiCAiyyL57v7Oz0z2f/1p1vXvYmZ3Z3V3dPd11Pt/n1Xu7u7u7qrqrq+qenp7p6TPNMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAz-i-iL3k8g-i-uL/7t7/7p-f/s1/5iG7AAT+B222-2HqW-9AAAAAASUVORK5CYII=';

const INITIAL_INVENTORY: Item[] = [
  { id: 'item-001', name: 'Blue Water Bottle', imageUrl: BOTTLE_IMAGE_BASE64 },
  { id: 'item-002', name: 'Red Hiking Backpack', imageUrl: BACKPACK_IMAGE_BASE64 }
];

const SAMPLE_ORDERS: Record<string, Order> = {
    'ORD-12345': { 
        orderNumber: 'ORD-12345', 
        items: [
            { itemId: 'item-001', quantity: 1 },
            { itemId: 'item-002', quantity: 1 }
        ] 
    },
    'ORD-67890': { 
        orderNumber: 'ORD-67890', 
        items: [{ itemId: 'item-001', quantity: 2 }]
    },
};
// --- END MOCK DATA ---

type ModalState = 'NONE' | 'ADDING_ITEM_CAMERA' | 'ADDING_ITEM_DETAILS' | 'MANAGING_INVENTORY' | 'ADDING_ORDER';


const App: React.FC = () => {
    const [inventory, setInventory] = useState<Item[]>(INITIAL_INVENTORY);
    const [orders, setOrders] = useState<Record<string, Order>>(SAMPLE_ORDERS);
    const [checkStatus, setCheckStatus] = useState<CheckStatus>('IDLE');
    const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
    const [modalState, setModalState] = useState<ModalState>('NONE');
    const [newItemImage, setNewItemImage] = useState<string | null>(null);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    
    const findOrder = (orderNumber: string): boolean => {
        const order = orders[orderNumber.toUpperCase()];
        if (order) {
            setActiveOrder(order);
            return true;
        }
        setActiveOrder(null);
        return false;
    };
    
    const handleOrderSubmit = async (orderNumber: string, imageData: string) => {
        if (!activeOrder) {
            console.error("No active order when submitting for check.");
            return;
        }
        
        setCheckStatus('CHECKING');
        
        const uniqueItemIdsInOrder = [...new Set(activeOrder.items.map(item => item.itemId))];
        const expectedItems = uniqueItemIdsInOrder
            .map(id => inventory.find(item => item.id === id))
            .filter((i): i is Item => !!i);

        try {
            const detectedIds = await detectItemsInImage(imageData, expectedItems);
            const detectedIdSet = new Set(detectedIds);

            const returnedItems = expectedItems.filter(item => detectedIdSet.has(item.id));
            const missingItems = expectedItems.filter(item => !detectedIdSet.has(item.id));

            setOrderResult({ orderNumber, returnedItems, missingItems });
            setCheckStatus('COMPLETE');

        } catch (error) {
            console.error(error);
            // On error, show a result with all items missing
            setOrderResult({ 
                orderNumber, 
                returnedItems: [], 
                missingItems: expectedItems 
            });
            setCheckStatus('COMPLETE');
        } finally {
            setActiveOrder(null);
        }
    };
    
    const handleReset = () => {
        setCheckStatus('IDLE');
        setOrderResult(null);
        setActiveOrder(null);
    };

    const handleStartAddItem = () => {
        setModalState('ADDING_ITEM_CAMERA');
    };
    
    const handleRegisterCapture = (imageDataUrl: string) => {
        setNewItemImage(imageDataUrl);
        setModalState('ADDING_ITEM_DETAILS');
    };

    const handleAddItem = (name: string) => {
        if (newItemImage) {
            const newItem: Item = {
                id: `item-${Date.now()}`,
                name,
                imageUrl: newItemImage,
            };
            setInventory(prev => [...prev, newItem]);
        }
        setNewItemImage(null);
        setModalState('MANAGING_INVENTORY');
    };

    const handleSaveOrder = (newOrder: Order) => {
        setOrders(prevOrders => ({
            ...prevOrders,
            [newOrder.orderNumber.toUpperCase()]: newOrder
        }));
        setModalState('NONE');
    };
    
    const renderContent = () => {
        switch(checkStatus) {
            case 'IDLE':
                return <OrderInput onSubmit={handleOrderSubmit} findOrder={findOrder} />;
            case 'CHECKING':
                return <CheckingProcess />;
            case 'COMPLETE':
                return orderResult ? <ResultsDisplay result={orderResult} onReset={handleReset} /> : null;
            default:
                return null;
        }
    };
    
    const renderModals = () => {
        switch(modalState) {
            case 'ADDING_ITEM_CAMERA':
                return <Camera onCapture={handleRegisterCapture} onCancel={() => setModalState('MANAGING_INVENTORY')} />;
            case 'ADDING_ITEM_DETAILS':
                return newItemImage ? (
                    <AddItemModal 
                        itemImageUrl={newItemImage}
                        onSave={handleAddItem}
                        onCancel={() => setModalState('MANAGING_INVENTORY')}
                    />
                ) : null;
            case 'MANAGING_INVENTORY':
                return (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-auto h-[90vh] flex flex-col">
                           <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                             <h2 className="text-xl font-bold">Manage Inventory</h2>
                             <button onClick={() => setModalState('NONE')} className="px-3 py-1 bg-gray-600 rounded-md hover:bg-gray-500">&times;</button>
                           </div>
                           <div className="p-6 overflow-y-auto">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {inventory.map(item => <ItemCard key={item.id} title={item.name} imageUrl={item.imageUrl} />)}
                                     <button 
                                        onClick={handleStartAddItem}
                                        className="aspect-square flex flex-col items-center justify-center gap-2 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 hover:border-blue-500"
                                    >
                                        <PlusIcon className="w-10 h-10 text-gray-500"/>
                                        <span className="font-semibold text-gray-400">Add New Item</span>
                                    </button>
                                </div>
                           </div>
                        </div>
                    </div>
                );
            case 'ADDING_ORDER':
                return <AddOrderModal
                    inventory={inventory}
                    onSave={handleSaveOrder}
                    onCancel={() => setModalState('NONE')}
                    existingOrderNumbers={Object.keys(orders)}
                />;
            default:
                return null;
        }
    };

    return (
       <>
         {renderModals()}
         <div className="min-h-screen bg-gray-900 text-white">
            <header className="border-b border-gray-700 bg-gray-800/50 sticky top-0 backdrop-blur-sm z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-600 p-2">
                                <PackageIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Rental Return System</h1>
                                <p className="text-sm text-gray-400">AI-powered item verification & tracking</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setModalState('ADDING_ORDER')}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-600 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Add Order
                            </button>
                            <button
                                onClick={() => setModalState('MANAGING_INVENTORY')}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-600 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Manage Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex justify-center items-center flex-grow">
               {renderContent()}
            </main>
        </div>
       </>
    );
};

export default App;
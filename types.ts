export interface Item {
  id: string;
  name: string;
  imageUrl: string;
}

export interface OrderItem {
  itemId: string;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  items: OrderItem[];
}

export type CheckStatus = 'IDLE' | 'CHECKING' | 'COMPLETE';

export interface OrderResult {
  orderNumber: string;
  returnedItems: Item[];
  missingItems: Item[];
}
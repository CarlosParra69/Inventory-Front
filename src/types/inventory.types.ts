// Tipos relacionados con inventario

export type MovementType = 'IN' | 'OUT';

export interface InventoryMovement {
  id: string;
  product_id: string;
  movement_type: MovementType;
  quantity: number;
  reason: string | null;
  created_at: string;
}

export interface InventoryEntryRequest {
  productId: string;
  quantity: number;
  reason?: string | null;
}

export interface InventoryExitRequest {
  productId: string;
  quantity: number;
  reason?: string | null;
}

export interface StockItem {
  product_id: string;
  product_name: string;
  stock: number;
}


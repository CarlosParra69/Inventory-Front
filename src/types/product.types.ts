// Tipos relacionados con productos

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  category_id: string;
  created_at: string;
}

export interface ProductRequest {
  name: string;
  description?: string | null;
  sku: string;
  category_id: string;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string | null;
  sku?: string;
  category_id?: string;
}


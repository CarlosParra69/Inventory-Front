// Tipos relacionados con categorías

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CategoryRequest {
  name: string;
  description?: string | null;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string | null;
}


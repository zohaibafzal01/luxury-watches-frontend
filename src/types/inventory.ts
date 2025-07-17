
export interface InventoryItem {
  id: string;
  dealerId: string;
  sku: string;
  brand: string;
  model: string;
  reference?: string;
  year?: number;
  condition: 'new' | 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  price: number;
  cost: number;
  quantity: number;
  description: string;
  images: string[];
  specifications: {
    movement?: string;
    caseMaterial?: string;
    caseSize?: string;
    dialColor?: string;
    strapMaterial?: string;
    waterResistance?: string;
    features?: string[];
  };
  stock: number;
  status: 'available' | 'reserved' | 'sold' | 'discontinued';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  photos?: string[];
}

export interface CreateInventoryItemData {
  sku: string;
  brand: string;
  model: string;
  year?: number;
  condition: 'new' | 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  price: number;
  description: string;
  images: File[];
  specifications: {
    movement?: string;
    caseMaterial?: string;
    caseSize?: string;
    dialColor?: string;
    strapMaterial?: string;
    waterResistance?: string;
    features?: string[];
  };
  stock: number;
  tags: string[];
}

export interface InventoryFilters {
  brand?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  tags?: string[];
  search?: string;
}

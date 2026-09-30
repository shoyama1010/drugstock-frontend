export type ShipmentStatus =
  | "requested"
  | "confirmed"
  | "shipped"
  | "delivered";

export interface Store {
  id: number;
  store_code: string;
  name: string;
  address?: string | null;
  phone?: string | null;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  is_active?: boolean;
}

export interface ShipmentAllocation {
  lot_number: string | null;
  location: string | null;
  quantity: number;
}

export interface ShipmentItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  shipped_quantity: number;
  allocations: ShipmentAllocation[];
}

export interface Shipment {
  id: number;
  shipment_number: string;
  status: ShipmentStatus;
  status_label: string;
  store: Store;
  created_by: string | null;
  confirmed_by: string | null;
  delivered_by: string | null;
  requested_at: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  note: string | null;
  total_quantity: number;
  items: ShipmentItem[];
}

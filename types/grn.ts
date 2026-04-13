export interface GRNItem {
  po_item_id: string;
  material_id: string;
  unit_id: string;

  ordered_qty: number;

  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;

  batch_number?: string;
  barcode?: string;
}

export interface GRNCreatePayload {
  po_id: string;
  factory_id: string;
  remarks?: string;
  items: GRNItem[];
}
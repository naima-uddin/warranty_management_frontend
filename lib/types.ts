export type Warranty = {
  _id: string;
  orderId: string;
  purchaseDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  productName: string;
  quantity: number;
  warrantyPeriod: string;
  imageUrl?: string;
  note?: string;
  createdAt: string;
};

export const PERMISSIONS = [
  { key: "warranty:view", label: "View warranties" },
  { key: "warranty:create", label: "Create warranties" },
  { key: "warranty:edit", label: "Edit warranties" },
  { key: "warranty:delete", label: "Delete warranties" },
];

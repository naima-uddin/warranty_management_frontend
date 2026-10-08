export type Warranty = {
  _id: string;
  orderId: string;
  purchaseDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  productName: string;
  quantity: number;
  warrantyEndDate: string;
  imageUrl?: string;
  note?: string;
  // Editable warranty-card template
  covered?: string[];
  notCovered?: string[];
  claimSteps?: string[];
  refundNote?: string;
  supportPhone?: string;
  supportEmail?: string;
  createdAt: string;
};

export const PERMISSIONS = [
  { key: "warranty:view", label: "View warranties" },
  { key: "warranty:create", label: "Create warranties" },
  { key: "warranty:edit", label: "Edit warranties" },
  { key: "warranty:delete", label: "Delete warranties" },
];

// Default warranty-card template — pre-fills the form, fully editable per entry.
export const TEMPLATE = {
  covered: [
    "Manufacturing defects",
    "Hardware-related issues covered under warranty",
    "Product inspection by our service team",
    "Repair or replacement of eligible defective products according to the applicable product warranty terms.",
  ],
  notCovered: [
    "Damage caused after delivery by misuse, accidents or improper handling.",
    "Screen or body damage caused by impact or pressure after delivery.",
    "Liquid damage, unless expressly covered by the product warranty.",
    "Faults caused by unauthorized repairs or modifications.",
  ],
  claimSteps: [
    "Contact customer support and provide your Order ID/Invoice Number.",
    "Provide the product and necessary accessories for inspection.",
    "Our service team will inspect the product.",
    "Warranty service will be provided according to the applicable warranty policy.",
  ],
  refundNote:
    "Where a warranty-related refund is approved, we will initiate the refund within 3–5 working days of approval. The time taken for the amount to appear in your account may depend on the payment provider. Any applicable mandatory refund deadline will take precedence.",
  supportPhone: "+8809678833626",
  supportEmail: "support.policy1@gmail.com",
};

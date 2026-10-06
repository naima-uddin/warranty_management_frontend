import type { Warranty } from "@/lib/types";

// Static company template content (fixed per the warranty policy).
const COVERED = [
  "Manufacturing defects",
  "Hardware-related issues covered under warranty",
  "Product inspection by our service team",
  "Repair or replacement of eligible defective products according to the applicable product warranty terms.",
];

const NOT_COVERED = [
  "Damage caused after delivery by misuse, accidents or improper handling.",
  "Screen or body damage caused by impact or pressure after delivery.",
  "Liquid damage, unless expressly covered by the product warranty.",
  "Faults caused by unauthorized repairs or modifications.",
];

const STEPS = [
  "Contact customer support and provide your Order ID/Invoice Number.",
  "Provide the product and necessary accessories for inspection.",
  "Our service team will inspect the product.",
  "Warranty service will be provided according to the applicable warranty policy.",
];

const SUPPORT = {
  phone: "+8809678833626",
  email: "support.policy1@gmail.com",
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Band = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black px-3 py-1.5 text-sm font-bold text-white">
    {children}
  </div>
);

export default function Slip({ w }: { w: Warranty }) {
  return (
    <div
      id="print-slip"
      className="mx-auto max-w-[600px] bg-white p-8 text-[13px] text-black ring-1 ring-slate-200"
    >
      <h2 className="mb-6 text-center text-lg font-bold tracking-wide">
        INVOICE &amp; WARRANTY CARD
      </h2>

      {/* Order header */}
      <div className="mb-5 grid grid-cols-4 border border-slate-400 text-[13px]">
        <div className="border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Order ID
        </div>
        <div className="border-r border-slate-400 px-3 py-2">{w.orderId}</div>
        <div className="border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Purchase Date
        </div>
        <div className="px-3 py-2">{fmtDate(w.purchaseDate)}</div>
      </div>

      {/* Product info */}
      <Band>PRODUCT INFORMATION</Band>
      <div className="mb-5 grid grid-cols-[160px_1fr] border border-t-0 border-slate-400">
        <div className="border-b border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Product name
        </div>
        <div className="border-b border-slate-400 px-3 py-2">{w.productName}</div>
        <div className="border-b border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Quantity
        </div>
        <div className="border-b border-slate-400 px-3 py-2">{w.quantity}</div>
        <div className="border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Warranty Period
        </div>
        <div className="px-3 py-2">{w.warrantyPeriod}</div>
      </div>

      {w.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={w.imageUrl}
          alt={w.productName}
          className="mb-5 max-h-40 rounded border border-slate-300 object-contain"
        />
      )}

      {/* Covered / Not covered */}
      <div className="mb-5 grid grid-cols-2 border border-slate-400">
        <div className="border-r border-slate-400 p-3">
          <ul className="space-y-1">
            {COVERED.map((c) => (
              <li key={c}>✓ {c}</li>
            ))}
          </ul>
        </div>
        <div className="p-3">
          <ul className="space-y-1">
            {NOT_COVERED.map((c) => (
              <li key={c}>✕ {c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* How to claim */}
      <Band>HOW TO CLAIM WARRANTY</Band>
      <div className="mb-5 space-y-2 border border-t-0 border-slate-400 p-3">
        <ol className="list-decimal space-y-1 pl-5">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="pt-1 text-[12px] text-slate-700">
          <b>N.B:</b> Where a warranty-related refund is approved, we will
          initiate the refund within 3–5 working days of approval. The time
          taken for the amount to appear in your account may depend on the
          payment provider. Any applicable mandatory refund deadline will take
          precedence.
        </p>
      </div>

      {/* Customer info */}
      <div className="mb-3 border border-slate-400 bg-slate-50 px-3 py-2 text-[12px]">
        <b>Customer:</b> {w.customerName}
        {w.customerPhone && <> · {w.customerPhone}</>}
        {w.customerEmail && <> · {w.customerEmail}</>}
      </div>

      {/* Support footer */}
      <div className="text-center text-[12px]">
        <p className="font-semibold">Customer Support</p>
        <p>Phone: {SUPPORT.phone}</p>
        <p>Email: {SUPPORT.email}</p>
        <p className="mt-2 font-bold tracking-wide">
          THANK YOU FOR SHOPPING WITH US
        </p>
      </div>
    </div>
  );
}

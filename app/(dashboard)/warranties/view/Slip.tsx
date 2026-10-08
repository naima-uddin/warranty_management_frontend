import type { Warranty } from "@/lib/types";
import { TEMPLATE } from "@/lib/types";

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Muted, evenly-spaced separator dot between customer name / phone / email.
const Dot = () => (
  <span className="mx-1.5 align-middle text-[10px] text-slate-400">•</span>
);

const Band = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black px-3 py-1.5 text-sm font-bold text-white">
    {children}
  </div>
);

export default function Slip({ w }: { w: Warranty }) {
  const covered = w.covered ?? TEMPLATE.covered;
  const notCovered = w.notCovered ?? TEMPLATE.notCovered;
  const claimSteps = w.claimSteps ?? TEMPLATE.claimSteps;
  const refundNote = w.refundNote ?? TEMPLATE.refundNote;
  const supportPhone = w.supportPhone ?? TEMPLATE.supportPhone;
  const supportEmail = w.supportEmail ?? TEMPLATE.supportEmail;

  return (
    <div
      id="print-slip"
      className="mx-auto w-full min-w-130 max-w-150 bg-white p-5 text-[13px] text-black ring-1 ring-slate-200 sm:p-8"
    >
      <h2 className="mb-6 text-center text-lg font-bold tracking-wide">
        INVOICE &amp; WARRANTY CARD
      </h2>

      {/* Order header — narrow grey labels, wide values, so each
          label clearly pairs with the value directly beside it. */}
      <div className="mb-5 grid grid-cols-[auto_1fr_auto_1fr] border border-slate-400 text-[13px]">
        <div className="flex items-center border-b border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Order ID
        </div>
        <div className="flex items-center border-b border-r border-slate-400 px-3 py-2">
          {w.orderId}
        </div>
        <div className="flex items-center border-b border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold whitespace-nowrap">
          Purchase Date
        </div>
        <div className="flex items-center border-b border-slate-400 px-3 py-2">
          {fmtDate(w.purchaseDate)}
        </div>
      </div>

      {/* Product info */}
      <Band>PRODUCT INFORMATION</Band>
      <div className="mb-5 grid grid-cols-[160px_1fr] border border-t-0 border-slate-400">
        <div className="flex items-center border-b border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Product name
        </div>
        <div className="flex items-center border-b border-slate-400 px-3 py-2">
          {w.productName}
        </div>
        <div className="flex items-center border-b border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Quantity
        </div>
        <div className="flex items-center border-b border-slate-400 px-3 py-2">
          {w.quantity}
        </div>
        <div className="flex items-center border-r border-slate-400 bg-slate-100 px-3 py-2 font-bold">
          Warranty Period
        </div>
        <div className="flex items-center px-3 py-2">
          Valid till {fmtDate(w.warrantyEndDate)}
        </div>
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
      {(covered.length > 0 || notCovered.length > 0) && (
        <div className="mb-5 grid grid-cols-2 border border-slate-400">
          <div className="border-r border-slate-400 p-3">
            <ul className="space-y-1">
              {covered.map((c, i) => (
                <li key={i}>✓ {c}</li>
              ))}
            </ul>
          </div>
          <div className="p-3">
            <ul className="space-y-1">
              {notCovered.map((c, i) => (
                <li key={i}>✕ {c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* How to claim */}
      {(claimSteps.length > 0 || refundNote) && (
        <>
          <Band>HOW TO CLAIM WARRANTY</Band>
          <div className="mb-5 space-y-2 border border-t-0 border-slate-400 p-3">
            {claimSteps.length > 0 && (
              <ol className="list-decimal space-y-1 pl-5">
                {claimSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
            {refundNote && (
              <p className="pt-1 text-[12px] text-slate-700">
                <b>N.B:</b> {refundNote}
              </p>
            )}
          </div>
        </>
      )}

      {/* Customer info */}
      <div className="mb-3 border border-slate-400 bg-slate-50 px-3 py-2 text-[12px]">
        <b>Customer:</b> {w.customerName}
        {w.customerPhone && (
          <>
            <Dot />
            <span className="whitespace-nowrap">{w.customerPhone}</span>
          </>
        )}
        {w.customerEmail && (
          <>
            <Dot />
            <span className="whitespace-nowrap">{w.customerEmail}</span>
          </>
        )}
      </div>

      {/* Support footer */}
      {(supportPhone || supportEmail) && (
        <div className="text-center text-[12px]">
          <p className="font-semibold">Customer Support</p>
          {supportPhone && (
            <p>
              Phone: <span className="whitespace-nowrap">{supportPhone}</span>
            </p>
          )}
          {supportEmail && (
            <p>
              Email: <span className="whitespace-nowrap">{supportEmail}</span>
            </p>
          )}
        </div>
      )}

      {/* Thank-you line — pinned to the very bottom when printing */}
      <p
        id="thank-you"
        className="mt-3 text-center text-[15px] font-bold tracking-wide"
      >
        THANK YOU FOR SHOPPING WITH US
      </p>
    </div>
  );
}

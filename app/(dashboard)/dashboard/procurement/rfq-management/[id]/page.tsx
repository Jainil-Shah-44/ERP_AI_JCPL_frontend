"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import VendorSelector from "@/components/rfq/VendorSelector";

export default function RFQDetail() {
  const { id } = useParams();
  const [rfq, setRfq] = useState<any>(null);

  const fetchRFQ = async () => {
    const res = await fetch(`/api/rfq/${id}`);
    const data = await res.json();
    setRfq(data);
  };

  useEffect(() => {
    fetchRFQ();
  }, []);

  if (!rfq) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2>{rfq.rfq_number}</h2>
      <p>Status: {rfq.status}</p>

      {rfq.status === "DRAFT" && (
        // <VendorSelector rfqId={id} reload={fetchRFQ} />
        <h2>Vendor</h2>
      )}

      {rfq.status === "SENT" && (
        <p className="text-yellow-600">
          Waiting for quotations...
        </p>
      )}
    </div>
  );
}

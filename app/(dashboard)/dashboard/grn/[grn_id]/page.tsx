"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

import {
  getGRNDetail,
  submitGRN,
  cancelGRN,
  downloadGRNPDF,
} from "@/services/grn.service";

export default function GRNViewPage() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);

  const id =
    typeof params.grn_id === "string"
      ? params.grn_id
      : Array.isArray(params.grn_id)
        ? params.grn_id[0]
        : null;

  // ✅ SINGLE fetch function
  const fetchData = async () => {
    if (!id) return;

    const res = await getGRNDetail(id);
    setData(res);
  };

  // ✅ useEffect
  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  console.log("ID:", id);

  if (!id) return <div>Loading...</div>;
  if (!data) return <div>Loading GRN...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">GRN: {data.grn_number}</h1>

        <div className="flex gap-2">
          {data.status === "DRAFT" && (
            <>
              <Button
                onClick={async () => {
                  const confirmSubmit = confirm(
                    "Once submitted, you cannot edit this GRN. Do you want to continue?",
                  );

                  if (!confirmSubmit) return;

                  await submitGRN(id);
                  fetchData();
                }}
              >
                Submit
              </Button>

              <Button
                variant="danger"
                onClick={async () => {
                  await cancelGRN(id);
                  router.push("/dashboard/grn");
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PO DETAILS */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">PO Details</h2>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">PO Ref</p>
            <p>{data.plot_no}</p>
          </div>

          <div>
            <p className="text-gray-500">Vendor</p>
            <p>{data.vendor_name}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p>{data.status}</p>
          </div>

          <div>
            <p className="text-gray-500">GRN Date</p>
            <p>
              {data.created_at
                ? new Date(data.created_at).toLocaleDateString("en-GB")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* FACTORY */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Factory</h2>
        <p>{data.factory_name}</p>
      </div>

      {/* ITEMS */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        <div className="space-y-4">
          {data.items?.map((item: any, index: number) => (
            <div key={index} className="border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">
                    {item.material_name}
                    {(item.specification || item.description) && (
                      <span className="text-gray-500 font-normal ml-2">
                        ({item.specification}
                        {item.specification && item.description ? " | " : ""}
                        {item.description})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Unit: {item.unit_name}
                  </p>
                </div>

                <div className="text-sm text-right">
                  <p>Ordered: {item.ordered_qty}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Received</p>
                  <p>{item.received_qty}</p>
                </div>

                <div>
                  <p className="text-gray-500">Rejected</p>
                  <p>{item.rejected_qty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REMARKS */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Remarks</h2>
        <p>{data.remarks || "-"}</p>
      </div>

      {data.status === "SUBMITTED" && (
        <Button onClick={() => downloadGRNPDF(id)}>Download PDF</Button>
      )}
    </div>
  );
}

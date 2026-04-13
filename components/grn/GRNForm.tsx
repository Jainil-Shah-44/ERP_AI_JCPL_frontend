"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/Button";

import { getPOPendingItems } from "@/services/grn.service";
import { getPOList } from "@/services/purchaseorder.service";
import { getAvailablePOs } from "@/services/grn.service";
import FactorySelect from "@/components/purchase-order/FactorySelect";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

type POOption = {
  value: string;
  label: string;
};

export default function GRNForm({ onSubmit, initialData, grnId }: any) {
  const [poList, setPoList] = useState<any[]>([]);
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedPODetail, setSelectedPODetail] = useState<any>(null);

  const [factory, setFactory] = useState<any>(null);

  const [items, setItems] = useState<any[]>([]);
  const [remarks, setRemarks] = useState("");
  const [poSearch, setPoSearch] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setSelectedPO(String(initialData.po_id));

    setFactory({
      id: String(initialData.factory_id),
      name: initialData.factory_name,
    });

    setRemarks(initialData.remarks);

    setItems(
      initialData.items.map((item: any) => ({
        ...item,
        pending_qty: item.pending_qty || item.ordered_qty,
      })),
    );
  }, [initialData]);

  // =========================
  // FETCH PO LIST
  // =========================
  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    const res = await getAvailablePOs();
    setPoList(res || []);
  };

  useEffect(() => {
    if (!initialData || poList.length === 0) return;

    const po = poList.find((p) => String(p.id) === String(initialData.po_id));

    setSelectedPODetail(po);
  }, [poList, initialData]);

  useEffect(() => {
    if (!initialData) return;

    const loadPending = async () => {
      const res = await getPOPendingItems(initialData.po_id, grnId);

      const mapped = res.map((p: any) => {
        const existing = initialData.items.find(
          (i: any) => i.po_item_id === p.po_item_id,
        );

        const pending = Number(p.pending_qty || 0);

        // 🔥 IF EXISTING → USE EXISTING
        if (existing) {
          return {
            ...p,
            original_pending: pending,
            received_qty: existing.received_qty,
            accepted_qty: existing.accepted_qty,
            rejected_qty: existing.rejected_qty,
            batch_number: existing.batch_number || "",
          };
        }

        // 🔥 IF NEW ITEM → PREFILL
        return {
          ...p,
          original_pending: pending,
          received_qty: pending,
          accepted_qty: pending,
          rejected_qty: 0,
          batch_number: "",
        };
      });

      setItems(mapped);
    };

    loadPending();
  }, [initialData, grnId]);
  // =========================
  // PO CHANGE
  // =========================
  const handlePOChange = async (poId: string) => {
    setSelectedPO(poId);

    const po = poList.find((p) => p.id === poId);
    setSelectedPODetail(po);

    // ✅ AUTO SET FACTORY
    if (po?.factory_id) {
      setFactory({
        id: po.factory_id,
        name: po.factory_name,
      });
    }

    if (!po?.factory_id) {
      setFactory(null);
    }

    const res = await getPOPendingItems(poId, grnId || undefined);

    const mapped = res.map((item: any) => {
      const pending = Number(item.pending_qty || 0);

      return {
        ...item,
        original_pending: pending,

        // 🔥 PREFILL
        received_qty: pending,
        accepted_qty: pending,
        rejected_qty: 0,

        remaining_qty: 0,
        is_over: false,
      };
    });

    setItems(mapped);
  };

  const filteredPOs = poList.filter((po) =>
    `${po.plot_no} ${po.vendor_name || ""}`
      .toLowerCase()
      .includes(poSearch.toLowerCase()),
  );

  // =========================
  // UPDATE ITEM
  // =========================
  const updateItem = (index: number, received: number) => {
    const updated = [...items];

    const pending = Number(updated[index].pending_qty);

    if (received > pending) {
      alert("Received cannot exceed pending quantity");
      return;
    }

    updated[index].received_qty = received;

    // Keep existing rejected (if any) but cap it
    if (updated[index].rejected_qty > received) {
      updated[index].rejected_qty = received;
    }

    // Accepted = received − rejected
    updated[index].accepted_qty =
      received - Number(updated[index].rejected_qty || 0);

    setItems(updated);
  };
  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = (submit = false) => {
    if (!selectedPO) return alert("Select PO");
    if (!factory?.id) return alert("Select Factory");

    const cleanedItems = items.map((item) => ({
      po_item_id: item.po_item_id,

      material_id: item.material_id ? String(item.material_id) : null,
      unit_id: item.unit_id ? String(item.unit_id) : null,

      ordered_qty: Number(item.ordered_qty),

      received_qty: Number(item.received_qty || 0),
      accepted_qty: Number(item.received_qty || 0),
      rejected_qty: Number(item.rejected_qty || 0),

      batch_number: item.batch_number || null,
    }));

    onSubmit(
      {
        po_id: selectedPO,
        factory_id: factory.id,
        remarks,
        items: cleanedItems,
      },
      submit,
    );
  };

  return (
    <div className="space-y-6">
      {/* =========================
          PO DETAILS CARD
      ========================= */}
      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">PO Details</h2>

        <Select
          options={poList.map((po) => ({
            value: po.id,
            label: `${po.plot_no} - (${po.factory_name}) ${po.grn_status === "PARTIAL" ? "●" : ""}`,
          }))}
          value={
            selectedPO
              ? {
                  value: selectedPO,
                  label:
                    poList.find((p) => p.id === selectedPO)?.plot_no ||
                    "Selected",
                }
              : null
          }
          onChange={(opt) => {
            const option = opt as POOption | null;
            if (!option?.value) return;
            handlePOChange(option.value);
          }}
          placeholder="Search and select PO..."
          isSearchable
        />
        {selectedPODetail && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Vendor</p>
              <p>{selectedPODetail.vendor_name}</p>
            </div>

            <div>
              <p className="text-gray-500">PO Date</p>
              <p>
                {selectedPODetail?.created_at
                  ? new Date(selectedPODetail.created_at).toLocaleString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p>{selectedPODetail.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* =========================
          FACTORY CARD
      ========================= */}
      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">Factory</h2>

        <FactorySelect
          value={factory?.id}
          displayName={factory?.name}
          onSelect={(f) => setFactory(f)}
        />
      </div>

      {/* =========================
          ITEMS
      ========================= */}
      <div className="border rounded-lg p-4 bg-white">
        <h2 className="font-semibold mb-3">Items</h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border rounded p-4 bg-gray-50">
              {/* HEADER */}
              <div className="flex justify-between mb-3">
                <div>
                  <p className="font-semibold text-base">
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
                  <p>
                    <b>Ordered:</b> {item.ordered_qty}
                  </p>
                  <p>
                    <b>Pending:</b> {item.pending_qty}
                  </p>
                  <p className="text-green-600">
                    After this GRN: {item.pending_qty - item.received_qty}
                  </p>
                </div>
              </div>

              {/* USER INPUT */}
              <div className="grid grid-cols-4 gap-4">
                {/* RECEIVED */}
                <div>
                  <label className="text-xs text-gray-600">Received Qty</label>
                  <Input
                    type="number"
                    value={item.received_qty}
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? 0 : Number(e.target.value);

                      // 🚫 prevent over input
                      if (val > item.pending_qty) {
                        alert("Cannot exceed pending quantity");
                        return;
                      }

                      updateItem(index, val);
                    }}
                  />
                </div>

                {/* REJECTED */}
                <div>
                  <label className="text-xs text-gray-600">Rejected Qty</label>
                  <Input
                    type="number"
                    value={item.rejected_qty}
                    onChange={(e) => {
                      const rejected = Number(e.target.value);
                      const updated = [...items];

                      if (rejected > item.received_qty) {
                        alert("Rejected cannot exceed received quantity");
                        return;
                      }

                      updated[index].rejected_qty = rejected;
                      updated[index].accepted_qty =
                        item.received_qty - rejected;

                      setItems(updated);
                    }}
                  />
                </div>
              </div>

              {/* UX HELP */}
              <p className="text-xs text-gray-400 mt-2">
                Enter received quantity. Input rejected if only required.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          REMARKS
      ========================= */}
      <div className="border rounded-lg p-4 bg-white">
        <Input
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      {/* =========================
          ACTIONS
      ========================= */}
      <div className="flex gap-3">
        <Button onClick={() => handleSubmit(false)}>Save Draft</Button>

        <Button
          onClick={() => {
            const confirmSubmit = confirm(
              "Once submitted, you cannot edit this GRN. Do you want to continue?",
            );

            if (!confirmSubmit) return;

            handleSubmit(true);
          }}
        >
          Save & Submit
        </Button>
      </div>
    </div>
  );
}

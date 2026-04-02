"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import VendorSelect from "@/components/purchase-order/VendorSelect";
import FactorySelect from "@/components/purchase-order/FactorySelect";
import MaterialSelect from "@/components/purchase-order/MaterialSelect";

const COMPANY_GSTIN = "24AABCJ5069J1ZG";

export default function POForm({
  mode = "create",
  initialData = null,
  onSubmit,
}: {
  mode?: "create" | "edit";
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    vendor_id: "",
    vendor_address_line1: "",
    vendor_address_line2: "",
    plot_no: "",
    po_date: "",
    factory_id: "",
    factory_range: "",
    factory_division: "",
    factory_commissionerate: "",
    factory_gstin: "",
    payment_terms: "",
    delivery_terms: "",
    transporter: "",
    freight_paid: true,
    other_instructions: "",
    sgst_percent: 9,
    cgst_percent: 9,
    tax_type: "GST",
    tax_percent: 18, // NEW
    igst_percent: 0,
  });
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        vendor_id: initialData.vendor_id || "",
        vendor_address_line1: initialData.vendor_address_line1 || "",
        vendor_address_line2: initialData.vendor_address_line2 || "",

        plot_no: initialData.plot_no || "",
        po_date: initialData.po_date ? initialData.po_date.split("T")[0] : "",

        factory_id: initialData.factory_id || "",
        factory_range: initialData.factory_range || "",
        factory_division: initialData.factory_division || "",
        factory_commissionerate: initialData.factory_commissionerate || "",
        factory_gstin: initialData.factory_gstin || "",

        payment_terms: initialData.payment_terms || "",
        delivery_terms: initialData.delivery_terms || "",
        transporter: initialData.transporter || "",
        freight_paid: initialData.freight_paid ?? true,
        other_instructions: initialData.other_instructions || "",

        sgst_percent: initialData.sgst_percent || 9,
        cgst_percent: initialData.cgst_percent || 9,
        tax_type: initialData.tax_type || "GST",
        tax_percent:
          initialData.tax_type === "IGST"
            ? initialData.igst_percent
            : (initialData.sgst_percent || 0) * 2,
        igst_percent: initialData.igst_percent || 0,
        
      });
      // Extract delivery date from instructions (if exists)
const match = initialData.other_instructions?.match(/Delivery Date:\s*(\d{4}-\d{2}-\d{2})/);

setDeliveryDate(match ? match[1] : "");
    }
  }, [initialData]);

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (initialData?.items) {
      setItems(initialData.items);
    } else {
      setItems([
        {
          material_name: "",
          description: "",
          specification: "",
          quantity: 0,
          unit_id: "",
          unit_name: "",
          rate: 0,
          hsn_code: "",
        },
      ]);
    }
  }, [initialData]);

  // 🧮 totals
  const round2 = (num: number) => Math.round(num * 100) / 100;

  const calculateTotals = () => {
    const subtotal = round2(
      items.reduce((sum, item) => sum + item.quantity * item.rate, 0),
    );

    let sgst = 0;
    let cgst = 0;
    let igst = 0;

    if (form.tax_type === "IGST") {
      igst = round2((subtotal * form.igst_percent) / 100);
    } else {
      sgst = round2((subtotal * form.sgst_percent) / 100);
      cgst = round2((subtotal * form.cgst_percent) / 100);
    }

    const total = round2(subtotal + sgst + cgst + igst);

    return { subtotal, sgst, cgst, igst, total };
  };

  const totals = calculateTotals();

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        material_name: "",
        description: "",
        specification: "",
        quantity: 0,
        unit_id: "",
        unit_name: "",
        rate: 0,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
  let instructions = form.other_instructions || "";

  // Remove existing delivery date if already present
  instructions = instructions.replace(/Delivery Date:.*\n?/g, "");

  // Add new delivery date
  if (deliveryDate) {
    instructions = `Delivery Date: ${deliveryDate}\n${instructions}`;
  }

  await onSubmit({
    ...form,
    other_instructions: instructions,
    items,
  });
};

  return (
    <div className="space-y-6">
      {/* VENDOR */}
      <VendorSelect
        value={form.vendor_id}
        displayName={initialData?.vendor_name}
        onSelect={(vendor) =>
          setForm({
            ...form,
            vendor_id: vendor.id,
            vendor_address_line1: vendor.address_line1,
            vendor_address_line2: vendor.address_line2,
          })
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Address Line 1"
          value={form.vendor_address_line1}
          onChange={(e) =>
            setForm({ ...form, vendor_address_line1: e.target.value })
          }
        />

        <Input
          placeholder="Address Line 2"
          value={form.vendor_address_line2}
          onChange={(e) =>
            setForm({ ...form, vendor_address_line2: e.target.value })
          }
        />

        {/* FACTORY */}
        <FactorySelect
          value={form.factory_id}
          displayName={initialData?.factory_name}
          onSelect={(factory) =>
            setForm({
              ...form,
              factory_id: factory.id,
              factory_range: factory.range,
              factory_division: factory.division,
              factory_commissionerate: factory.commissionerate,
              factory_gstin: factory.gstin,
            })
          }
        />
        <div className="grid grid-cols-3 gap-4">
          <Input
            placeholder="P.No"
            value={form.plot_no}
            onChange={(e) => setForm({ ...form, plot_no: e.target.value })}
          />

          <input
            type="date"
            value={form.po_date || ""}
            onChange={(e) => setForm({ ...form, po_date: e.target.value })}
            className="border p-2 w-full rounded"
          />

          <Input
            placeholder="Transporter"
            value={form.transporter}
            onChange={(e) => setForm({ ...form, transporter: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Terms of Payment"
            value={form.payment_terms}
            onChange={(e) =>
              setForm({ ...form, payment_terms: e.target.value })
            }
          />

          <div className="space-y-2">
  <div className="flex gap-4 items-center">
    <label className="text-sm font-medium">Delivery Date</label>
    <input
      type="date"
      value={deliveryDate}
      onChange={(e) => setDeliveryDate(e.target.value)}
      className="border p-2 rounded"
    />
  </div>

  <textarea
    placeholder="Other Instructions"
    value={form.other_instructions}
    onChange={(e) =>
      setForm({ ...form, other_instructions: e.target.value })
    }
    className="border p-2 w-full rounded resize-y min-h-[80px]"
  />
</div>
        </div>

        <Input
          placeholder="Factory Range"
          value={form.factory_range}
          onChange={(e) => setForm({ ...form, factory_range: e.target.value })}
        />

        <Input
          placeholder="Division"
          value={form.factory_division}
          onChange={(e) =>
            setForm({ ...form, factory_division: e.target.value })
          }
        />

        <Input
          placeholder="Commissionerate"
          value={form.factory_commissionerate}
          onChange={(e) =>
            setForm({ ...form, factory_commissionerate: e.target.value })
          }
        />

        <div>
          <label className="text-xs text-gray-500">GSTIN</label>
          <div className="border p-2 bg-gray-100 text-gray-700">
            {COMPANY_GSTIN}
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded p-4 bg-gray-50 shadow-sm">
            {/* ROW 1 */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500">Material</label>
                <MaterialSelect
                  value={item.material_id}
                  displayName={item.material_name}
                  onSelect={(material) => {
                    handleItemChange(
                      index,
                      "material_name",
                      material.material_name,
                    );
                    handleItemChange(index, "material_id", material.id);
                    handleItemChange(index, "unit_id", material.unit_id);
                    handleItemChange(index, "unit_name", material.unit_name);
                  }}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Description</label>
                <input
                  className="border p-2 w-full"
                  value={item.description || ""}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Specification</label>
                <input
                  className="border p-2 w-full"
                  value={item.specification || ""}
                  onChange={(e) =>
                    handleItemChange(index, "specification", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">HSN</label>
                <input
                  className="border p-2 w-full"
                  value={item.hsn_code || ""}
                  onChange={(e) =>
                    handleItemChange(index, "hsn_code", e.target.value)
                  }
                />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-6 gap-3 items-end">
              <div>
                <label className="text-xs text-gray-500">Qty</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={item.quantity ?? 0}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", +e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Unit</label>
                <input
                  className="border p-2 w-full"
                  value={item.unit_name || ""}
                  onChange={(e) =>
                    handleItemChange(index, "unit_name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Rate</label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  value={item.rate ?? 0}
                  onChange={(e) =>
                    handleItemChange(index, "rate", +e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Amount</label>
                <div className="p-2 border bg-gray-100">
                  ₹ {round2(item.quantity * item.rate || 0).toFixed(2)}
                </div>
              </div>

              <div className="flex items-end">
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ✅ ADD ROW BUTTON */}
        <div className="flex justify-start">
          <Button title="+ Add Item" onClick={addRow} className="mt-2" />
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.tax_type === "GST"}
            onChange={() =>
              setForm({
                ...form,
                tax_type: "GST",
                sgst_percent: form.tax_percent / 2,
                cgst_percent: form.tax_percent / 2,
                igst_percent: 0,
              })
            }
          />
          GST (SGST + CGST)
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.tax_type === "IGST"}
            onChange={() =>
              setForm({
                ...form,
                tax_type: "IGST",
                sgst_percent: 0,
                cgst_percent: 0,
                igst_percent: form.tax_percent,
              })
            }
          />
          IGST
        </label>
      </div>

      <select
        className="border p-2 rounded"
        value={form.tax_percent}
        onChange={(e) => {
          const percent = Number(e.target.value);

          if (form.tax_type === "IGST") {
            setForm({
              ...form,
              tax_percent: percent,
              igst_percent: percent,
              sgst_percent: 0,
              cgst_percent: 0,
            });
          } else {
            setForm({
              ...form,
              tax_percent: percent,
              sgst_percent: percent / 2,
              cgst_percent: percent / 2,
              igst_percent: 0,
            });
          }
        }}
      >
        <option value={0}>0%</option>
        <option value={5}>5%</option>
        <option value={18}>18%</option>
      </select>

      {/* TOTALS */}
      <div className="bg-white border rounded p-4">
        <p>Subtotal: ₹ {totals.subtotal.toFixed(2)}</p>

        {form.tax_type === "IGST" ? (
          <p>IGST: ₹ {totals.igst.toFixed(2)}</p>
        ) : (
          <>
            <p>SGST: ₹ {totals.sgst.toFixed(2)}</p>
            <p>CGST: ₹ {totals.cgst.toFixed(2)}</p>
          </>
        )}

        <p className="font-bold">Total: ₹ {totals.total.toFixed(2)}</p>
      </div>

      <Button
        title={mode === "create" ? "Create PO" : "Update PO"}
        onClick={handleSubmit}
      />
    </div>
  );
}

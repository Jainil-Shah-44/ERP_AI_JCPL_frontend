"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { createPO } from "@/services/purchaseorder.service";

export default function CreatePOPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    vendor_id: "",
    vendor_address: "",
    vendor_contact: "",
    payment_terms: "",
    delivery_terms: "",
    transporter: "",
    freight_paid: true,
    other_instructions: "",
    sgst_percent: 9,
    cgst_percent: 9,
  });

  const [items, setItems] = useState<any[]>([
    {
      material_name: "",
      description: "",
      quantity: 0,
      unit_id: "2b097563-134f-4f56-a6ea-f4902d6543aa",
      rate: 0,
      hsn_code: "",
      weight: 0,
    },
  ]);

  // 🧮 totals
  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0,
    );

    const sgst = (subtotal * form.sgst_percent) / 100;
    const cgst = (subtotal * form.cgst_percent) / 100;

    return {
      subtotal,
      sgst,
      cgst,
      total: subtotal + sgst + cgst,
    };
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
        quantity: 0,
        unit_id: "",
        rate: 0,
        hsn_code: "",
        weight: 0,
      },
    ]);
  };

  const removeRow = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      items,
    };

    await createPO(payload);
    router.push("/dashboard/procurement/purchase-order");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Create Purchase Order</h1>

      {/* Vendor */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Vendor ID</label>
          <Input
            value={form.vendor_id}
            onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm">Vendor Contact</label>
          <Input
            value={form.vendor_contact}
            onChange={(e) =>
              setForm({ ...form, vendor_contact: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm">Vendor Address</label>
          <Input
            value={form.vendor_address}
            onChange={(e) =>
              setForm({ ...form, vendor_address: e.target.value })
            }
          />
        </div>
      </div>

      {/* Terms */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Payment Terms</label>
          <Input
            value={form.payment_terms}
            onChange={(e) =>
              setForm({ ...form, payment_terms: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm">Delivery Terms</label>
          <Input
            value={form.delivery_terms}
            onChange={(e) =>
              setForm({ ...form, delivery_terms: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm">Transporter</label>
          <Input
            value={form.transporter}
            onChange={(e) => setForm({ ...form, transporter: e.target.value })}
          />
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Items</h2>

        <table className="w-full text-sm border">
          <thead>
            <tr>
              <th>Material</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>HSN</th>
              <th>Weight</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    value={item.material_name}
                    onChange={(e) =>
                      handleItemChange(index, "material_name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", +e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", +e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    value={item.hsn_code}
                    onChange={(e) =>
                      handleItemChange(index, "hsn_code", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) =>
                      handleItemChange(index, "weight", +e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => removeRow(index)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button title="Add Row" onClick={addRow} />
      </div>

      {/* Totals */}
      <div className="bg-white border rounded p-4">
        <p>Subtotal: ₹ {totals.subtotal}</p>
        <p>SGST: ₹ {totals.sgst}</p>
        <p>CGST: ₹ {totals.cgst}</p>
        <p className="font-bold">Total: ₹ {totals.total}</p>
      </div>

      <Button title="Create PO" onClick={handleSubmit} />
    </div>
  );
}

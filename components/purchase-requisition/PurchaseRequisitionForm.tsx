"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/Select";
import Toast from "@/components/ui/Toast";

import {
  createPurchaseRequisition,
  updatePurchaseRequisition,
  submitPurchaseRequisition,
  getPurchaseRequisitionById,
} from "@/services/purchaserequisition.service";

import { getRawMaterials } from "@/services/rawmaterialmaster.service";
import { getFactories } from "@/services/factorymaster.service";
import { getWarehouses } from "@/services/warehousemaster.service";
import { getDepartments } from "@/services/department.service";

interface Props {
  editId?: string;
}

type LineItem = {
  material_id: string;
  material_code: string;
  material_name: string;
  unit_id: string;
  requested_qty: number | "";
  estimated_rate: number | "";
  required_by_date: string;
};

export default function PurchaseRequisitionForm({ editId }: Props) {
  const router = useRouter();
  const isEdit = !!editId;

  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [prId, setPrId] = useState<string | null>(null);

  const [header, setHeader] = useState({
    factory_id: "",
    warehouse_id: "",
    department: "",
    priority: "NORMAL",
    remarks: "",
  });

  const [items, setItems] = useState<LineItem[]>([]);

  const [toast, setToast] = useState<any>(null);

  /* ================= LOAD MASTER DATA ================= */

useEffect(() => {
  const loadMasterData = async () => {
    try {
      const [
        rawMat,
        fac,
        ware,
        dept
      ] = await Promise.all([
        getRawMaterials(),
        getFactories(),
        getWarehouses(),
        getDepartments(),
      ]);

      setRawMaterials(rawMat || []);
      setFactories(fac || []);
      setWarehouses(ware || []);
      setDepartments(dept || []);
    } catch (error) {
      console.error("Failed to load master data", error);
    }
  };

  loadMasterData();
}, []);



  useEffect(() => {
  if (!editId) return;

  const fetchData = async () => {
    try {
      const data = await getPurchaseRequisitionById(editId);

      // 🔹 Header
      setHeader({
        factory_id: data.factory_id || "",
        warehouse_id: data.warehouse_id || "",
        department: data.department || "",
        priority: data.priority || "NORMAL",
        remarks: data.remarks || "",
      });

      // 🔹 Items (map ALL items properly)
      const mappedItems = (data.items || []).map((item: any) => ({
        material_id: item.material_id,
        material_code: item.material_code,
        material_name: item.material_name,
        unit_id: item.unit_id,
        requested_qty: item.requested_qty,
        estimated_rate: item.estimated_rate,
        required_by_date: item.required_by_date,
      }));

      setItems(mappedItems);
      setPrId(data.id);

    } catch (error) {
      console.error("Failed to fetch PR:", error);
    }
  };

  fetchData();
}, [editId,rawMaterials.length]);

  /* ================= ADD LINE ITEM ================= */

  const addLineItem = () => {
    setItems([
      ...items,
      {
        material_id: "",
        material_code: "",
        material_name: "",
        unit_id: "",
        requested_qty: "",
        estimated_rate: "",
        required_by_date: "",
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
  index: number,
  field: keyof LineItem,
  value: any
) => {
  setItems((prev) => {
    const updated = [...prev];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    return updated;
  });
};

  /* ================= SAVE ================= */

  const handleSave = async (submit = false) => {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }

  try {
    let id = prId;

    const formattedItems = items.map((item) => ({
      material_id: item.material_id,
      material_code: item.material_code,
      material_name: item.material_name,
      unit_id: item.unit_id,
      requested_qty: Number(item.requested_qty || 0),
      estimated_rate: Number(item.estimated_rate || 0),
      required_by_date: item.required_by_date,
    }));

    if (isEdit && editId) {
      const updatePayload = {
        department: header.department,
        priority: header.priority,
        remarks: header.remarks,
        items: formattedItems,
      };

      await updatePurchaseRequisition(editId, updatePayload);
      id = editId;
    } else {
      const createPayload = {
        ...header,
        items: formattedItems,
      };

      const res = await createPurchaseRequisition(createPayload);
      id = res.id;
      setPrId(id);
    }

    if (submit && id) {
      await submitPurchaseRequisition(id);
    }

    router.push("/dashboard/procurement/purchase-requisition");

  } catch (error: any) {
    console.error("Save Error:", error);
    setToast({
      msg: error?.response?.data?.detail || "Operation failed",
      type: "error",
    });
  }
};

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-xl font-semibold">
        {isEdit ? "Edit PR" : "Create PR"}
      </h1>

      {/* Header Section */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 border rounded">
        <div>
          <Label>Factory</Label>
          <Select
            name="factory_id"
            value={header.factory_id}
            options={factories.map((f) => ({
              label: f.name,
              value: f.id,
            }))}
            onChange={(e: any) =>
              setHeader({
                ...header,
                factory_id: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Warehouse</Label>
          <Select
            name="warehouse_id"
            value={header.warehouse_id}
            options={warehouses.map((w) => ({
              label: w.name,
              value: w.id,
            }))}
            onChange={(e: any) =>
              setHeader({
                ...header,
                warehouse_id: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Department</Label>
          <Select
            name="department"
            value={header.department}
            options={departments.map((d) => ({
              label: d.name,
              value: d.name, // or d.id if backend expects ID
            }))}
            onChange={(e: any) =>
              setHeader({
                ...header,
                department: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label>Priority</Label>
          <Select
            name="priority"
            value={header.priority}
            options={[
              { label: "NORMAL", value: "NORMAL" },
              { label: "MEDIUM", value: "MEDIUM" },
              { label: "EMERGENCY", value: "EMERGENCY" },
            ]}
            onChange={(e: any) =>
              setHeader({
                ...header,
                priority: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white p-4 border rounded space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Items</h2>
          <Button title="Add Item" onClick={addLineItem} />
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-3 items-end"
          >
            <div>
              <Label>Material</Label>
              <Select
                name={`material_${index}`}
                value={item.material_id}
                options={rawMaterials.map((r) => ({
                  label: r.material_name,
                  value: r.id,
                }))}
                onChange={(e: any) => {
                  const selected = rawMaterials.find(
                    (r) => r.id === e.target.value
                  );
                  if (!selected) return;

                  updateItem(index, "material_id", selected.id);
                  updateItem(
                    index,
                    "material_code",
                    selected.material_code
                  );
                  updateItem(
                    index,
                    "material_name",
                    selected.material_name
                  );
                  updateItem(
                    index,
                    "unit_id",
                    selected.unit_id
                  );
                }}
              />
            </div>

            <div>
              <Label>Qty</Label>
              <Input
                type="number"
                value={item.requested_qty}
                onChange={(e) =>
                  updateItem(
                    index,
                    "requested_qty",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <Label>Estimated Rate</Label>
              <Input
                type="number"
                value={item.estimated_rate}
                onChange={(e) =>
                  updateItem(
                    index,
                    "estimated_rate",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <Label>Required Date</Label>
              <Input
                type="date"
                value={item.required_by_date}
                onChange={(e) =>
                  updateItem(
                    index,
                    "required_by_date",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Button
                title="Remove"
                variant="danger"
                onClick={() => removeLineItem(index)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          title="Save Draft"
          onClick={() => handleSave(false)}
        />
        <Button
          title="Submit PR"
          variant="primary"
          onClick={() => handleSave(true)}
        />
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          position="top-center"
          autoClose={2000}
        />
      )}
    </div>
  );
}
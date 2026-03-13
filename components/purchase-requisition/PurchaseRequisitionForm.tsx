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
  uploadPurchaseRequisitionAttachment,
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
  const [loading, setLoading] = useState(false);

  const [header, setHeader] = useState({
    factory_id: "",
    warehouse_id: "",
    department: "",
    priority: "NORMAL",
    remarks: "",
  });

  const [items, setItems] = useState<LineItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    const load = async () => {
      try {
        const [rm, f, w, d] = await Promise.all([
          getRawMaterials(),
          getFactories(),
          getWarehouses(),
          getDepartments(),
        ]);
        setRawMaterials(rm || []);
        setFactories(f || []);
        setWarehouses(w || []);
        setDepartments(d || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  /* ================= LOAD EDIT ================= */

  useEffect(() => {
    if (!editId) return;

    const fetch = async () => {
      try {
        const data = await getPurchaseRequisitionById(editId);

        setHeader({
          factory_id: data.factory_id || "",
          warehouse_id: data.warehouse_id || "",
          department: data.department || "",
          priority: data.priority || "NORMAL",
          remarks: data.remarks || "",
        });

        setItems(
          (data.items || []).map((i: any) => ({
            material_id: i.material_id,
            material_code: i.material_code,
            material_name: i.material_name,
            unit_id: i.unit_id,
            requested_qty: i.requested_qty ?? "",
            estimated_rate: i.estimated_rate ?? "",
            required_by_date: i.required_by_date ?? "",
          }))
        );

        setExistingFiles(data.attachments || []);
        setPrId(data.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetch();
  }, [editId]);

  /* ================= VALIDATION ================= */

  const validateForm = (): string | null => {
    if (!header.factory_id) return "Factory is required";
    if (!header.warehouse_id) return "Warehouse is required";
    if (!header.department) return "Department is required";
    if (!header.priority) return "Priority is required";

    if (items.length === 0)
      return "At least one item is required";

    const materialSet = new Set<string>();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.material_id)
        return `Material is required in row ${i + 1}`;

      if (materialSet.has(item.material_id))
        return "Duplicate materials are not allowed";

      materialSet.add(item.material_id);

      if (
        item.requested_qty === "" ||
        Number(item.requested_qty) <= 0
      )
        return `Quantity must be greater than 0 in row ${i + 1}`;

      if (
        item.estimated_rate === "" ||
        Number(item.estimated_rate) < 0
      )
        return `Estimated rate cannot be negative in row ${i + 1}`;

      if (!item.required_by_date)
        return `Required date missing in row ${i + 1}`;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const requiredDate = new Date(item.required_by_date);

      if (requiredDate < today)
        return `Required date cannot be in past (row ${i + 1})`;
    }

    if (header.priority === "EMERGENCY" && !header.remarks.trim())
      return "Remarks required for EMERGENCY priority";

    return null;
  };

  /* ================= FILE HANDLING ================= */

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    const validFiles = selected.filter((file) => {
      const validType = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ].includes(file.type);

      const validSize = file.size <= 5 * 1024 * 1024;

      if (!validType)
        setToast({
          msg: `${file.name} not supported`,
          type: "error",
        });

      if (!validSize)
        setToast({
          msg: `${file.name} exceeds 5MB`,
          type: "error",
        });

      return validType && validSize;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  /* ================= SAVE ================= */

  const handleSave = async (submit = false) => {
    const validationError = validateForm();

    if (validationError) {
      setToast({ msg: validationError, type: "error" });
      return;
    }

    try {
      setLoading(true);

      const formattedItems = items.map((item) => ({
        ...item,
        requested_qty: Number(item.requested_qty),
        estimated_rate: Number(item.estimated_rate),
      }));

      let id = prId;

      if (isEdit && editId) {
        await updatePurchaseRequisition(editId, {
          ...header,
          items: formattedItems,
        });
        id = editId;
      } else {
        const res = await createPurchaseRequisition({
          ...header,
          items: formattedItems,
        });
        id = res.id;
        setPrId(id);
      }

      /* Upload attachments (single loop only) */
      if (id && files.length > 0) {
        for (const file of files) {
          await uploadPurchaseRequisitionAttachment(id, file);
        }
      }

      if (submit && id) {
        await submitPurchaseRequisition(id);
      }

      router.push("/dashboard/procurement/purchase-requisition");
    } catch (err) {
      console.error(err);
      setToast({
        msg: "Operation failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= LINE ITEM ================= */

  const addLineItem = () => {
    setItems((prev) => [
      ...prev,
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
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof LineItem,
    value: any
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        {isEdit ? "Edit PR" : "Create PR"}
      </h1>

      {/* HEADER */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 border rounded">
        <div>
          <Label>Factory *</Label>
          <Select
            name="factory_id"
            value={header.factory_id}
            options={factories.map((f) => ({
              label: f.name,
              value: f.id,
            }))}
            onChange={(e: any) =>
              setHeader({ ...header, factory_id: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Warehouse *</Label>
          <Select
            name="warehouse_id"
            value={header.warehouse_id}
            options={warehouses.map((w) => ({
              label: w.name,
              value: w.id,
            }))}
            onChange={(e: any) =>
              setHeader({ ...header, warehouse_id: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Department *</Label>
          <Select
            name="department"
            value={header.department}
            options={departments.map((d) => ({
              label: d.name,
              value: d.name,
            }))}
            onChange={(e: any) =>
              setHeader({ ...header, department: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Priority *</Label>
          <Select
            name="priority"
            value={header.priority}
            options={[
              { label: "NORMAL", value: "NORMAL" },
              { label: "MEDIUM", value: "MEDIUM" },
              { label: "EMERGENCY", value: "EMERGENCY" },
            ]}
            onChange={(e: any) =>
              setHeader({ ...header, priority: e.target.value })
            }
          />
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-4 border rounded space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Items</h2>
          <Button title="Add Item" onClick={addLineItem} />
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-3 items-end">
            <div>
              <Label>Material *</Label>
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
                  updateItem(index, "material_code", selected.material_code);
                  updateItem(index, "material_name", selected.material_name);
                  updateItem(index, "unit_id", selected.unit_id);
                }}
              />
            </div>

            <div>
              <Label>Qty *</Label>
              <Input
                type="number"
                value={item.requested_qty}
                onChange={(e) =>
                  updateItem(index, "requested_qty", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Estimated Rate *</Label>
              <Input
                type="number"
                value={item.estimated_rate}
                onChange={(e) =>
                  updateItem(index, "estimated_rate", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Required Date *</Label>
              <Input
                type="date"
                value={item.required_by_date}
                onChange={(e) =>
                  updateItem(index, "required_by_date", e.target.value)
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

      {/* ATTACHMENTS */}
      <div className="bg-white p-4 border rounded space-y-3">
        <h2 className="font-semibold">Attachments</h2>

        <Input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />

        {/* Newly selected files */}
        {files.length > 0 && (
          <div className="text-sm space-y-1">
            {files.map((f, i) => (
              <div key={i}>{f.name}</div>
            ))}
          </div>
        )}

        {/* Existing files in edit mode */}
        {existingFiles.length > 0 && (
          <div className="text-sm space-y-1">
            {existingFiles.map((f: any) => (
              <div key={f.id}>
                <a
                  href={f.file_url}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {f.file_name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <Button
          title={loading ? "Saving..." : "Save Draft"}
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

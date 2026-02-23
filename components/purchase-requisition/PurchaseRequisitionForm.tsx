"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/Select";
import Toast from "@/components/ui/Toast";

import { Department, getDepartments } from "@/services/department.service";
import { FactoryMaster, getFactories } from "@/services/factorymaster.service";
import {
  createPurchaseRequisition,
  getPurchaseRequisitionById,
  submitPurchaseRequisition,
  updatePurchaseRequisition,
  uploadPurchaseRequisitionAttachment,
} from "@/services/purchaserequisition.service";
import {
  getRawMaterials,
  RawMaterialMaster,
} from "@/services/rawmaterialmaster.service";
import {
  getWarehouses,
  WarehouseMaster,
} from "@/services/warehousemaster.service";

interface Props {
  editId?: string; // future use for edit
}

export default function PurchaseRequisitionForm({ editId }: Props) {
  const isEdit = !!editId;

  // ---------------- MASTER DATA ----------------

  const [rawMaterial, setRawMaterial] = useState<RawMaterialMaster[]>([]);
  const [factory, setFactory] = useState<FactoryMaster[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [warehouse, setWarehouse] = useState<WarehouseMaster[]>([]);

  // ---------------- FORM STATE ----------------

  const [form, setForm] = useState({
    material: null as RawMaterialMaster | null,
    department: "",
    factory: "",
    warehouse: "",
    priority: "NORMAL",
    description: "",
    quantity: "",
    minQty: "500 units",
    requiredDate: "",
  });

  const [prId, setPrId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileResponse, setFileResponse] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
    id?: number;
  } | null>(null);

  // ---------------- LOAD MASTER DATA ----------------

  useEffect(() => {
    const load = async () => {
      setDepartment(await getDepartments());
      setFactory(await getFactories());
      setRawMaterial(await getRawMaterials());
      setWarehouse(await getWarehouses());
    };
    load();
  }, []);

  // ---------------- OPTIONS ----------------

  const departmentOptions = department.map((d) => ({
    label: d.name,
    value: d.name,
  }));

  const factoryOptions = factory.map((f) => ({
    label: f.name,
    value: f.id,
  }));

  const warehouseOptions = warehouse.map((w) => ({
    label: w.name,
    value: w.id,
  }));

  const rawMaterialOptions = rawMaterial.map((r) => ({
    label: r.material_name,
    value: r.id,
  }));

  const priorityOptions = [
    { label: "NORMAL", value: "NORMAL" },
    { label: "MEDIUM", value: "MEDIUM" },
    { label: "EMERGENCY", value: "EMERGENCY" },
  ];

  // ---------------- HANDLERS ----------------

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = rawMaterial.find(
      (item) => item.id === e.target.value
    );

    setForm((prev) => ({
      ...prev,
      material: selected || null,
    }));
  };

useEffect(() => {
  if (!editId) return;

  const fetchData = async () => {
    try {
      const data = await getPurchaseRequisitionById(editId);
      console.log("getPurchaseRequisitionById data", data)
      const item = data.items?.[0];

      // 🔵 find full raw material object from master list
      const selectedMaterial = rawMaterial.find(
        (rm) => rm.id === item?.material_id
      ) || null;

      setForm({
        material: selectedMaterial,
        department: data.department || "",
        factory: data.factory_id || "",
        warehouse: data.warehouse_id || "",
        priority: data.priority || "NORMAL",
        description: data.remarks || "",
        quantity: item?.requested_qty?.toString() || "",
        minQty: "500 units",
        requiredDate: data.required_by_date || "",
      });

      setPrId(data.id);
      

    } catch (error) {
      console.error("Failed to fetch PR:", error);
    }
  };

  fetchData();
}, [editId, rawMaterial]);


  // ---------------- SAVE DRAFT ----------------

 const handleSave = async () => {

    if (!form.material) return;

    if (isEdit) {
      // 🔵 UPDATE LOGIC
      const payload = {
        department: form.department,
        priority: form.priority,
        required_by_date: form.requiredDate,
        remarks: form.description,
        items: [
          {
            material_id: form.material.id,
            material_code: form.material.material_code,
            material_name: form.material.material_name,
            requested_qty: Number(form.quantity),
            unit_id: form.material.unit_id,
            estimated_rate: 0,
          },
        ],
      };

      await updatePurchaseRequisition(editId as string, payload);

      setToast({ msg: "Updated Successfully", type: "success" });

    } else {
      // 🟢 CREATE LOGIC
      const payload = {
        factory_id: form.factory,
        warehouse_id: form.warehouse,
        department: form.department,
        priority: form.priority,
        required_by_date: form.requiredDate,
        remarks: form.description,
        items: [
          {
            material_id: form.material.id,
            material_code: form.material.material_code,
            material_name: form.material.material_name,
            requested_qty: Number(form.quantity),
            unit_id: form.material.unit_id,
            estimated_rate: 0,
            required_by_date: form.requiredDate,
          },
        ],
      };

      const res = await createPurchaseRequisition(payload);
      setPrId(res.id);
      setShowUpload(true);

      setToast({ msg: "Draft Saved", type: "success" });
    }
 
 }
  // ---------------- FILE UPLOAD ----------------

  const handleUpload = async () => {
    if (!selectedFile || !prId) return;

    try {
      const response = await uploadPurchaseRequisitionAttachment(
        prId,
        selectedFile
      );

      setFileResponse(response);
      setSelectedFile(null);
      setUploadSuccess(true);

      if (fileInputRef.current) fileInputRef.current.value = "";

      setToast({
        msg: "File Uploaded Successfully",
        type: "success",
        id: Date.now(),
      });
    } catch {
      setToast({
        msg: "Upload Failed",
        type: "error",
        id: Date.now(),
      });
    }
  };

  const handleFinalSubmit = async () => {
    if (!prId) return;

    try {
      await submitPurchaseRequisition(prId);

      setToast({
        msg: "PR Submitted Successfully",
        type: "success",
        id: Date.now(),
      });
    } catch {
      setToast({
        msg: "Submit Failed",
        type: "error",
        id: Date.now(),
      });
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Purchase Requisition</h1>
        <p className="text-sm text-gray-500">
          Create a new purchase requisition
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
        {!showUpload && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <Label>Department</Label>
              <Select name="department" value={form.department}
                options={departmentOptions}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Factory</Label>
              <Select name="factory" value={form.factory}
                options={factoryOptions}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Warehouse</Label>
              <Select name="warehouse" value={form.warehouse}
                options={warehouseOptions}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Priority</Label>
              <Select name="priority" value={form.priority}
                options={priorityOptions}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Material</Label>
              <Select
                name="material"
                value={form.material?.id || ""}
                options={rawMaterialOptions}
                onChange={handleMaterialChange}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Requested Quantity</Label>
              <Input type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Required Date</Label>
              <Input type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
              />
            </div>

          </div>
        )}

        {showUpload && (
          <div className="mt-6 space-y-4">
            <Label>Upload Supporting File</Label>
            <Input type="file" ref={fileInputRef}
              onChange={(e) =>
                setSelectedFile(e.target.files?.[0] || null)
              }
            />

            {selectedFile && (
              <Button title="Upload" onClick={handleUpload} />
            )}

            {fileResponse && (
              <div className="text-green-600">
                Uploaded: {fileResponse.file_name}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-8 border-t pt-6">
          <Button
            title={isEdit ? "Update PR" : "Save Draft"}
            disabled={!form.factory || !form.material || showUpload}
            onClick={handleSave}
          />

          <Button
            title="Submit PR"
            disabled={!uploadSuccess}
            onClick={handleFinalSubmit}
          />
        </div>
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          position="top-center"
          autoClose={2000}
          id={toast.id}
        />
      )}
    </div>
  );
}


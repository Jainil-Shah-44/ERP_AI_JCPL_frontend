"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/Select";
import { useState } from "react";

export default function PurchaseRequisition() {
    const [form, setForm] = useState({
        department: "",
        factory: "",
        materialCode: "",
        description: "",
        quantity: "",
        minQty: "500 units",
        requiredDate: "",
    });

    const departmentOptions = [
        { label: "Production", value: "Production" },
        { label: "Maintenance", value: "Maintenance" },
        { label: "Quality", value: "Quality" },
    ];

    const factoryOptions = [
        { label: "Plant A", value: "Plant A" },
        { label: "Plant B", value: "Plant B" },

    ]


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Submit PR:", form);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">

            {/* Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Purchase Requisition
                </h1>
                <p className="text-sm text-gray-500">
                    Create a new purchase requisition
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Department */}
                    <div>
                        <Label>Department</Label>
                        <Select
                            // label="Department"
                            name="department"
                            value={form.department}
                            options={departmentOptions}
                            placeholder="Select department"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Factory */}
                    <div>
                        <Label>Factory</Label>
                        <Select
                            // label="Department"
                            name="factory"
                            value={form.factory}
                            options={factoryOptions}
                            placeholder="Select Factory"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Material Code */}
                    <div>
                        <Label>Material Code</Label>
                        <Input
                            type="text"
                            name="materialCode"
                            value={form.materialCode}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Material description" />
                    </div>

                    {/* Requested Quantity */}
                    <div>
                        <Label>Requested Quantity</Label>
                        <Input
                            type="number"
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Enter quantity" />
                    </div>

                    {/* Min Quantity */}
                    <div>
                        <Label>Min Quantity (Auto-fetched)</Label>
                        <Input
                            type="text"
                            // name="quantity"
                            value={form.minQty}
                            onChange={handleChange}
                            disabled
                            className="form-input bg-gray-100 cursor-not-allowed"
                        //placeholder="Enter quantity" 
                        />
                    </div>

                    {/* Required Date */}
                    <div>
                        <Label>Required Date</Label>
                        <Input
                            type="date"
                            name="requiredDate"
                            value={form.requiredDate}
                            onChange={handleChange}
                        />

                    </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-4 mt-8 border-t pt-6">
                    <Button
                        title="Save Draft"
                        variant="primary"
                        className="sm"
                    />
                    <Button
                        title="Submit PR"
                        variant="primary"
                        className="sm"
                    />
                </div>
            </div>
        </div>
    );
}

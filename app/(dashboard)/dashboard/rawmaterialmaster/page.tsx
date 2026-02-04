"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RawMaterialMaster() {
    const [form, setForm] = useState({
        item_Name: "",
        item_desc: "",
        item_group: "",
        item_category: ""
    });

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
                    Raw Material Master
                </h1>
                <p className="text-sm text-gray-500">
                    Create a new Raw Material 
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Unit Name */}
                    <div>
                        <Label>Item Name</Label>
                        <Input
                            type="text"
                            name="item_Name"
                            value={form.item_Name}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Convert */}
                    <div>
                        <Label>Item Description </Label>
                        <Input
                            type="text"
                            name="item_desc"
                            value={form.item_desc}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                     {/* Convert */}
                    <div>
                        <Label>Item Group </Label>
                        <Input
                            type="text"
                            name="item_group"
                            value={form.item_group}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                      {/* Convert */}
                    <div>
                        <Label>Item Category </Label>
                        <Input
                            type="text"
                            name="item_category"
                            value={form.item_category}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>
                   
                </div>
                {/* Buttons */}
                <div className="flex gap-4 mt-8 border-t pt-6">
                    <Button
                        title="Save"
                        variant="primary"
                        className="sm"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

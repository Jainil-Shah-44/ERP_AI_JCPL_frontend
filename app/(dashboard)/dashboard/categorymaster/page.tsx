"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function CategoryMaster() {
    const [form, setForm] = useState({
        category_name: "",
        category_desc: ""
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
                    Category Master
                </h1>
                <p className="text-sm text-gray-500">
                    Create a new Category
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Unit Name */}
                    <div>
                        <Label>Category name</Label>
                        <Input
                            type="text"
                            name="category_name"
                            value={form.category_name}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Convert */}
                    <div>
                        <Label>Category Description </Label>
                        <Input
                            type="text"
                            name="category_desc"
                            value={form.category_desc}
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

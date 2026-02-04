"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function UserMaster() {
    const [form, setForm] = useState({
        user_name: "",
        user_company_code: "",
        user_email: "",
        user_number: "",					
        user_role: "",
        location: ""
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
                    User Master
                </h1>
                <p className="text-sm text-gray-500">
                    Create a new User
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Unit Name */}
                    <div>
                        <Label>User name</Label>
                        <Input
                            type="text"
                            name="user_name"
                            value={form.user_name}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Convert */}
                    <div>
                        <Label>User Company Code </Label>
                        <Input
                            type="text"
                            name="user_company_code"
                            value={form.user_company_code}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Convert */}
                    <div>
                        <Label>User Email </Label>
                        <Input
                            type="text"
                            name="user_email"
                            value={form.user_email}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Convert */}
                    <div>
                        <Label>User Number </Label>
                        <Input
                            type="text"
                            name="user_number"
                            value={form.user_number}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                     {/* Convert */}
                    <div>
                        <Label>User Role </Label>
                        <Input
                            type="text"
                            name="user_role"
                            value={form.user_role}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Convert */}
                    <div>
                        <Label>Location </Label>
                        <Input
                            type="text"
                            name="location"
                            value={form.location}
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

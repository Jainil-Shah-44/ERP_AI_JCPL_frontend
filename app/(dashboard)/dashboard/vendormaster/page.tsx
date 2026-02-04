"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function VendorMaster() {
    const [form, setForm] = useState({
        mobile_number1: "",
        mobile_number2: "",
        office_number: "",
        state: "",
        pincode: "",
        pan_number: "",
        gst_number: "",
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
                    Vendor Master
                </h1>
                <p className="text-sm text-gray-500">
                    Create a new Vendor
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Mobile Number1 */}
                    <div>
                        <Label>Mobile Number1</Label>
                        <Input
                            type="text"
                            name="mobile_number1"
                            value={form.mobile_number1}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Mobile Number2 */}
                    <div>
                        <Label>Mobile Number2 </Label>
                        <Input
                            type="text"
                            name="mobile_number2"
                            value={form.mobile_number2}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Office Number */}
                    <div>
                        <Label>Office Number </Label>
                        <Input
                            type="text"
                            name="office_number"
                            value={form.office_number}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* State */}
                    <div>
                        <Label>State </Label>
                        <Input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Pincode */}
                    <div>
                        <Label>Pincode </Label>
                        <Input
                            type="text"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Pan Number */}
                    <div>
                        <Label>Pan Number </Label>
                        <Input
                            type="text"
                            name="pan_number"
                            value={form.pan_number}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* GSt Number */}
                    <div>
                        <Label>GSt Number</Label>
                        <Input
                            type="text"
                            name="gst_number"
                            value={form.gst_number}
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

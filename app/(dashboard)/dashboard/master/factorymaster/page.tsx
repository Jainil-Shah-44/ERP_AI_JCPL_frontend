"use client";

import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function FactoryMaster() {
    const [form, setForm] = useState({
        location_name: "",
        description: "",
        coordinates: "",
        address1: "",
        address2: "",
        address3: "",
        incharge_person_name: "",
        mobile_number: "",
        email_id: "",
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
                    Factory Master
                </h1>
                <p className="text-sm text-gray-500">
                    Create a new Factory
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Department */}
                    <div>
                        <Label>Location Name </Label>
                        <Input
                            type="text"
                            name="location_name"
                            value={form.location_name}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description </Label>
                        <Input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Coordinates */}
                    <div>
                        <Label>Coordinates </Label>
                        <Input
                            type="text"
                            name="coordinates"
                            value={form.coordinates}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Address1 */}
                    <div>
                        <Label>Address1 </Label>
                        <Input
                            type="text"
                            name="address1"
                            value={form.address1}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Address2 */}
                    <div>
                        <Label>Address2 </Label>
                        <Input
                            type="text"
                            name="address2"
                            value={form.address2}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Address1 */}
                    <div>
                        <Label>Address3 </Label>
                        <Input
                            type="text"
                            name="address3"
                            value={form.address3}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* incharge_person_name */}
                    <div>
                        <Label>Incharge person name </Label>
                        <Input
                            type="text"
                            name="incharge_person_name"
                            value={form.incharge_person_name}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Mobile number */}
                    <div>
                        <Label>Mobile number</Label>
                        <Input
                            type="text"
                            name="mobile_number"
                            value={form.mobile_number}
                            onChange={handleChange}
                            placeholder="Search or enter code" />
                    </div>

                    {/* Email_id */}
                    <div>
                        <Label>Email Id</Label>
                        <Input
                            type="text"
                            name="email_id"
                            value={form.email_id}
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
                    />
                </div>
            </div>
        </div>
    );
}

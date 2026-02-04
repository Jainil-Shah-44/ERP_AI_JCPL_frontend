"use client";

import { useState } from "react";
import { CheckCircle, Printer, XCircle } from "lucide-react";
import Select from "@/components/ui/Select"; // adjust path if needed
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { MdOutlineLightbulb } from "react-icons/md";
type SelectOption = {
    label: string;
    value: string;
};

export default function QCamplingForm() {
    const [selectedPO, setSelectedPO] = useState<string>("");
    const [errors, setErrors] = useState<{ poReference?: string }>({});

    const poOptions: SelectOption[] = [
        { value: "PO-2025-1842", label: "GRN-2025-5421 - Sodium Hydroxide" },
        { value: "PO-2025-1835", label: "GRN-2025-5418 - Hydrochloric Acid" },
        { value: "PO-2025-1829", label: "GRN-2025-5425 - Sulfuric Acid" },
    ];

    const handlePOChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedPO(value);

        // Validation
        if (!value) {
            setErrors((prev) => ({ ...prev, poReference: "PO Reference is required" }));
        } else {
            setErrors((prev) => ({ ...prev, poReference: undefined }));
        }
    };

    const isPOSelected = !!selectedPO;

    // Example data — in real app, fetch based on selectedPO
    const poDetails = isPOSelected
        ? {
            material: "Sodium Hydroxide (NaOH)",
            BatchNumber: "BATCH-2041",
            ReceivedQty: "5000 kg",
            Supplier: "Supplier A",
        }
        : null;

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="mx-auto max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r bg-white  px-6 py-5 text-black">
                    <h1 className="text-2xl font-bold">QC Sampling</h1>
                    <p className="text-black mt-1 text-sm">
                        Quality control testing and approval
                    </p>
                </div>

                <div className="p-6 space-y-8">
                    {/* PO Reference - always visible */}
                    <div>
                        <Select
                            label="GRN Reference"
                            name="poReference"
                            value={selectedPO}
                            onChange={handlePOChange}
                            options={poOptions}
                            placeholder="Search or select PO"
                            required
                            error={errors.poReference}
                        />
                    </div>

                    {/* All other fields - only show when PO is selected */}
                    {isPOSelected && poDetails && (
                        <>
                            {/* Material Details */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-5 py-3 font-medium text-gray-800 border-b">
                                    Material Details
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                                    <div>
                                        <div className="text-gray-500">Material</div>
                                        <div className="mt-1 font-medium">{poDetails.material}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Batch Number</div>
                                        <div className="mt-1 font-medium">{poDetails.BatchNumber}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Received Qty</div>
                                        <div className="mt-1 font-medium">{poDetails.ReceivedQty}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Supplier</div>
                                        <div className="mt-1 font-medium">{poDetails.Supplier}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {/* Sample Quantity + Test Parameters row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sample Quantity */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Sample Quantity
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter sample qty"
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Test Parameters */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Test Parameters
                                        </label>
                                        <div className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                            Purity, pH, Concentration
                                        </div>
                                    </div>
                                </div>

                                {/* Approved + Rejected Quantity row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Approved Quantity */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Approved Quantity
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter approved qty"
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Rejected Quantity */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rejected Quantity
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter rejected qty"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* QC Remarks - full width textarea */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        QC Remarks
                                    </label>
                                    <textarea
                                        placeholder="Enter test results and observations"
                                        rows={4}
                                        className={` w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400
                                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y min-h-[100px]`}
                                    />
                                </div>
                            </div>


                            {/* Partial Delivery Toggle */}
                            <div className="flex items-center justify-between bg-gray-50 border border-blue-200 rounded-lg px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <MdOutlineLightbulb className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">AI Prediction</div>
                                        <div className="text-sm text-gray-500">
                                            Based on past batches from Supplier A, expected rejection rate is less than 2%. This batch shows similar characteristics to previously approved materials.
                                        </div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                                <Button variant="outline" className='border border-red-600 text-red-600'>
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Reject
                                </Button>
                                <Button variant="green">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Approve
                                </Button>
                                <Button variant="outline">
                                    {/* <Printer size={18} /> */}
                                    Print QC Report
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
// app/grn/new/page.tsx   (or components/GRNForm.tsx)

"use client";

import { useState } from "react";
import { Check, Info, Printer, ScanLine } from "lucide-react";
import Select from "@/components/ui/Select"; // adjust path if needed
import { FiBox } from "react-icons/fi";
import Button from "@/components/ui/Button";
type SelectOption = {
    label: string;
    value: string;
};

export default function GRNForm() {
    const [selectedPO, setSelectedPO] = useState<string>("");
    const [errors, setErrors] = useState<{ poReference?: string }>({});

    const poOptions: SelectOption[] = [
        { value: "PO-2025-1842", label: "PO-2025-1842 - Sodium Hydroxide" },
        { value: "PO-2025-1835", label: "PO-2025-1835 - Hydrochloric Acid" },
        { value: "PO-2025-1829", label: "PO-2025-1829 - Sulfuric Acid" },
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
            orderedQty: "5000 kg",
            supplier: "Supplier A",
            pendingQty: "5000 kg",
        }
        : null;

    return (
         <div className="min-h-screen bg-gray-50 py-4">
            <div className="mx-auto max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r bg-white  px-6 py-5 text-black">
                    <h1 className="text-2xl font-bold">Goods Receipt Note (GRN)</h1>
                    <p className="text-black mt-1 text-sm">
                        Record received materials and update inventory
                    </p>
                </div>

                <div className="p-6 space-y-8">
                    {/* PO Reference - always visible */}
                    <div>
                        <Select
                            label="PO Reference"
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
                            {/* PO Details */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-5 py-3 font-medium text-gray-800 border-b">
                                    PO Details
                                </div>
                                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                    <div>
                                        <div className="text-gray-500">Material</div>
                                        <div className="mt-1 font-medium">{poDetails.material}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Ordered Qty</div>
                                        <div className="mt-1 font-medium">{poDetails.orderedQty}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500">Supplier</div>
                                        <div className="mt-1 font-medium">{poDetails.supplier}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Barcode / Batch Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Barcode / Batch Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Scan or enter barcode"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    <ScanLine
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        size={18}
                                    />
                                </div>
                            </div>

                            {/* Received & Pending Quantity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Received Quantity
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter quantity"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Pending Quantity (Auto-calculated)
                                    </label>
                                    <div className="w-full border border-gray-200 bg-gray-50 rounded-md px-4 py-2.5 text-sm text-gray-700 font-medium">
                                        {poDetails.pendingQty}
                                    </div>
                                </div>
                            </div>

                            {/* Partial Delivery Toggle */}
                            <div className="flex items-center justify-between bg-gray-50 border border-blue-200 rounded-lg px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FiBox  className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">Partial Delivery</div>
                                        <div className="text-sm text-gray-500">
                                            Mark if not all items were received
                                        </div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* System Note */}
                              <div className="flex items-center justify-betweenbg-green-50 border  border-green-200 rounded-lg px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Info className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800">System Note</div>
                                        <div className="text-sm text-gray-500">
                                            Inventory will be updated automatically upon GRN generation. Material will be available for QC sampling
                                        </div>
                                    </div>
                                </div>
                               
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                                <Button variant='primary'>
                                    Generate GRN
                                </Button>
                                <Button variant="outline">
                                    <Printer size={18} />
                                    Print Label
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
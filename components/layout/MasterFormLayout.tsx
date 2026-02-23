"use client";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions: React.ReactNode;
};

export default function MasterFormLayout({
  title,
  description,
  children,
  actions,
}: Props) {
  return (
    <div className="p-4 bg-gray-50 min-h-[calc(100vh-64px)]">

      {/* Single Heading */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Card */}
      <div className="bg-white border rounded-md p-5">

        {/* Form Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
          {children}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6 pt-4 border-t">
          {actions}
        </div>

      </div>
    </div>
  );
}
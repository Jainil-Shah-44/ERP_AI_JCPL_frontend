"use client";

export default function Toast({
  message,
  show,
}: {
  message: string;
  show: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
      ✅ {message}
    </div>
  );
}

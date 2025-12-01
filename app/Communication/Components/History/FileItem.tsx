"use client";

export default function FileItem({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer">
      <span className="text-xl">📄</span>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">{size}</p>
      </div>
    </div>
  );
}

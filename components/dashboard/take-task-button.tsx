"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TakeTaskButton({ tareaId }: { tareaId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTake = async () => {
    setLoading(true);
    const res = await fetch(`/api/tareas/${tareaId}/asignar`, {
      method: "POST",
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Error al asignar tarea");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTake}
      disabled={loading}
      className="w-full mt-2 text-xs bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Asignando..." : "Tomar tarea"}
    </button>
  );
}

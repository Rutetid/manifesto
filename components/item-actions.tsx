"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { deleteItem, togglePurchased, updateItemPriority } from "@/app/actions/item";

export function ItemActions({
  itemId,
  status,
  priority,
}: {
  itemId: string;
  status: string;
  priority: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this item?")) return;
    setLoading(true);
    try {
      await deleteItem(itemId);
      router.refresh();
    } catch {
      alert("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePurchased = async () => {
    setLoading(true);
    try {
      await togglePurchased(itemId);
      router.refresh();
    } catch {
      alert("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (newPriority: "LOW" | "MEDIUM" | "HIGH") => {
    setLoading(true);
    try {
      await updateItemPriority(itemId, newPriority);
      router.refresh();
    } catch {
      alert("Failed to update priority");
    } finally {
      setLoading(false);
    }
  };

  const priorities: Array<{ value: "LOW" | "MEDIUM" | "HIGH"; icon: React.ReactNode; label: string }> = [
    { value: "LOW", icon: <ArrowDown className="w-3 h-3" />, label: "low" },
    { value: "MEDIUM", icon: <Minus className="w-3 h-3" />, label: "med" },
    { value: "HIGH", icon: <ArrowUp className="w-3 h-3" />, label: "high" },
  ];

  return (
    <div className="flex items-center gap-1 pt-2 border-t border-text/5">
      {/* Priority toggles */}
      <div className="flex items-center gap-0.5">
        {priorities.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePriorityChange(p.value)}
            disabled={loading}
            className={`p-1 rounded text-[10px] transition-colors ${
              priority === p.value
                ? "bg-butter/50 text-text font-medium"
                : "text-text-muted hover:text-text"
            }`}
            title={`Set priority to ${p.label}`}
          >
            {p.icon}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Purchased toggle */}
      {status !== "AVAILABLE" && (
        <button
          onClick={handleTogglePurchased}
          disabled={loading}
          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
            status === "PURCHASED"
              ? "bg-mint/30 text-text"
              : "bg-peach/30 text-text hover:bg-peach/50"
          }`}
        >
          {status === "PURCHASED" ? "undo" : "bought?"}
        </button>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1 rounded text-text-muted hover:text-coral hover:bg-coral/10 transition-colors"
        title="Remove item"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

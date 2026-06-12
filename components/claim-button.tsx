"use client";

import { useState } from "react";
import { ClaimModal } from "@/components/claim-modal";

export function ClaimButton({
  itemId,
  itemTitle,
}: {
  itemId: string;
  itemTitle: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-2 pill-btn !text-xs justify-center"
      >
        I&apos;ll get this
      </button>
      <ClaimModal
        itemId={itemId}
        itemTitle={itemTitle}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-text hover:bg-surface2 transition-all"
      >
        <LogOut className="w-4 h-4" /> <span>Se déconnecter</span>
      </button>
    </form>
  );
}

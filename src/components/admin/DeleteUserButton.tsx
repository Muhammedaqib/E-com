"use client";

import { submitDeleteUserAction } from "@/lib/actions/admin-users";

export function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <form
      action={submitDeleteUserAction.bind(null, userId)}
      className="mt-4"
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Delete User Account
      </button>
    </form>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function sendChatMessageAction(complaintId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  if (!content || content.trim().length === 0) {
    return { error: "Message cannot be empty." };
  }

  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { userId: true }
    });

    if (!complaint) return { error: "Conversation not found" };

    // Check permission: User must own the complaint or be an Admin
    if (complaint.userId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "Unauthorized access to this chat" };
    }

    await prisma.complaintMessage.create({
      data: {
        complaintId,
        senderId: session.user.id,
        content: content.trim()
      }
    });

    revalidatePath(`/profile/messages/${complaintId}`);
    revalidatePath(`/admin/complaints/${complaintId}`);
    return { success: true };
  } catch (err) {
    return { error: "Failed to send message" };
  }
}

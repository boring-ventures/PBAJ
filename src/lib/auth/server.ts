import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";
import prisma from "@/lib/prisma";
import type { Profile } from "@/types/profile";

// Cache the user lookup to avoid multiple database calls
export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    const userId = session.user.id;

    // Get the user profile from our database
    const profile = await prisma.profile.findUnique({
      where: {
        userId,
        active: true,
      },
    });

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      userId: profile.userId,
      email: session.user.email || "",
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      role: profile.role,
      avatarUrl: profile.avatarUrl || undefined,
      active: profile.active,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
});

// Get current user session without profile data
export const getCurrentSession = cache(async () => {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting current session:", error);
    return null;
  }
});

// Check if the current user has admin access
export const requireAdmin = async (): Promise<Profile> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== "SUPERADMIN") {
    throw new Error("Admin access required");
  }

  return user;
};

// Check if the current user is authenticated
export const requireAuth = async (): Promise<Profile> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
};

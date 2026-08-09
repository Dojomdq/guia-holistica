"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const COOKIE_NAME = "admin_auth";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    router.replace("/admin/login");
  }, [router]);

  return null;
}

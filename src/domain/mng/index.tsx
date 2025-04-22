"use client";

import { useMenuStore } from "@/store/menuStore";
import { useEffect } from "react";

function ManagementHomeClient() {
  const { resetState } = useMenuStore();

  useEffect(() => {
    resetState();
  }, []);

  return <></>;
}

export { ManagementHomeClient };

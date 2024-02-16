"use client";

import { Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";

export default function DashboardPage() {
  const { me } = useMeContext();

  return (
    <Text as="h2" className="text-2xl">
      Welcome, {me?.name}.
    </Text>
  );
}

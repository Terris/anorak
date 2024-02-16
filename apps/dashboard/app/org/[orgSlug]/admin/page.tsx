"use client";

import { Text } from "@repo/ui";
import { useMe } from "@repo/authorization";

export default function DashboardPage() {
  const { me } = useMe();

  return (
    <Text as="h2" className="text-2xl">
      Welcome, {me?.name}.
    </Text>
  );
}

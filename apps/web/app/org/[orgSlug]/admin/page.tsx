"use client";

import { Text } from "@repo/ui";
import { useMe } from "../../../../lib/Authorization/MeProvider";

export default function DashboardPage() {
  const { me } = useMe();

  return (
    <Text as="h2" className="text-2xl">
      Welcome, {me?.name}.
    </Text>
  );
}

import Link from "next/link";
import { Text } from "@repo/ui";
import { Page } from "../lib/layout/Page";

export default function NotFound() {
  return (
    <Page className="py-32">
      <Text className="text-center font-tuna font-black text-xl">
        Dang, there&rsquo;s nothing here.
      </Text>
      <Text className="text-center">
        Go back to the{" "}
        <Link href="/" className="underline">
          home page
        </Link>
        .
      </Text>
    </Page>
  );
}

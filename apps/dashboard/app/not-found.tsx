import Link from "next/link";
import { Text } from "@repo/ui";

export default function NotFound() {
  return (
    <div className="w-full px-8 py-32">
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
    </div>
  );
}

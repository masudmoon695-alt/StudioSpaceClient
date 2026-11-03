import type { Metadata } from "next";

import { MyListings } from "@/components/studios/my-listings";

export const metadata: Metadata = {
  title: "My studio listings",
  description: "Manage, update and remove the creative spaces you host.",
};

export default function MyListingsPage() {
  return <MyListings />;
}

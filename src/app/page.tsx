import { redirect } from "next/navigation";

export default function Home() {
  redirect("/overview");
  return <>Coming Soon</>;
}


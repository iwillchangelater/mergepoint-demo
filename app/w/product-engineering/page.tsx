import { Suspense } from "react";
import { Board } from "../../../components/demo";

export default function Page() {
  return <Suspense fallback={<p role="status">Loading the issue board…</p>}><Board /></Suspense>;
}

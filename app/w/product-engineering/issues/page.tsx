import { Suspense } from "react";
import { QueryIssue } from "../../../../components/demo";

export default function Page() {
  return <Suspense fallback={<p role="status">Loading the local issue…</p>}><QueryIssue /></Suspense>;
}

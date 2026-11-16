import Link from "next/link";
import { workspace } from "../components/data";

export default function NotFound() {
  return <section className="panel detail-panel missing">
    <h1>Page unavailable</h1><p>Open the board to find an issue, or use the URL guide to try a published route.</p>
    <Link className="button primary" href={workspace}>Back to board</Link>
  </section>;
}

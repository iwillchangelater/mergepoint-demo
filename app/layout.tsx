import "@fontsource-variable/inter";
import "./style.css";
import Link from "next/link";
import type { Metadata } from "next";
import { workspace } from "../components/data";

export const metadata: Metadata = {
  title: "Mergepoint demo",
  description: "Explore Next.js routes in the Mergepoint issue tracker.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    <a className="skip" href="#main">Skip to content</a>
    <header className="topbar">
      <div className="top-inner">
        <Link className="brand" href="/"><span aria-hidden="true">M</span>Mergepoint</Link>
        <nav aria-label="Main navigation"><Link href={workspace}>Board</Link><Link href="/routes/">URL guide</Link></nav>
        <span className="mode">Pages demo</span>
      </div>
    </header>
    <main id="main" className="shell">{children}</main>
  </body></html>;
}

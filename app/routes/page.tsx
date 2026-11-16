import Link from "next/link";
import { issuePath, workspace } from "../../components/data";

export default function Routes() {
  const examples = [
    { name: "Home", href: "/", detail: "The index page for this repository." },
    { name: "Issue board", href: workspace, detail: "A fixed workspace route. The page reads saved issues from this browser." },
    { name: "Filtered list", href: workspace + "?view=list&q=webhook", detail: "Query parameters set the view and the search. Use Back or reload to revisit the same filter." },
    { name: "Issue ISS-011", href: issuePath(11), detail: "The number is a path segment. Next.js generates the seeded issue pages at build time." },
    { name: "New issue", href: workspace + "issues/new/", detail: "The form assigns a new number in this browser and navigates to the new issue." },
  ];
  return <>
    <header className="page-heading"><div><h1>URL guide</h1><p>Click a route and look at the address bar.</p></div></header>
    <div className="route-list">
      {examples.map(({ name, href, detail }) => <article className="route-card panel" key={href}>
        <h2><Link href={href}>{name} <span aria-hidden="true">↗</span></Link></h2>
        <code>{href}</code><p>{detail}</p>
      </article>)}
    </div>
    <section className="panel detail-panel route-note">
      <h2>Path segments and query parameters</h2>
      <p>The repository name is the deployment prefix. The paths above start after that prefix. A new issue opens on the prebuilt <code>/w/product-engineering/issues/</code> page with its number in <code>?number=</code>. That page finds the record in your browser.</p>
    </section>
  </>;
}

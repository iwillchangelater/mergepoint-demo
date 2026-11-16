import Link from "next/link";
import { issuePath, workspace } from "../components/data";

export default function Home() {
  return <div className="home">
    <section className="home-copy">
      <p className="eyebrow">Product Engineering</p>
      <h1>Follow an issue<br />from <em>backlog to done.</em></h1>
      <p>Open the board, filter the issues, and follow the URLs as you move through the app.</p>
      <div className="home-actions"><Link className="button primary" href={workspace}>Open issue board <span aria-hidden="true">→</span></Link>
        <Link className="button" href="/routes/">Explore URLs</Link></div>
    </section>
    <section className="quick panel" aria-labelledby="quick-title">
      <h2 id="quick-title">Try a direct link</h2>
      <Link href={issuePath(11)} className="quick-item">
        <code>ISS-011</code><strong>Support carrier status webhooks</strong><span className="pill in_progress"><i />In progress</span>
      </Link>
      <Link href={workspace + "?view=list&q=webhook"} className="quick-item">
        <code>?view=list&amp;q=webhook</code><strong>Open filtered issues</strong><span className="pill backlog"><i />Search</span>
      </Link>
      <p>Try opening these links in a new tab or reloading the page.</p>
    </section>
  </div>;
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  issueKey, issuePath, priorities, statuses, statusLabel, team, workspace,
  type Issue, type IssueFields, type Priority, type Status,
} from "./data";
import { changeDemo, useDemo } from "./store";

function Pill({ issue }: { issue: Issue }) {
  return <span className={`pill ${issue.status}`}><i />{statusLabel[issue.status]}</span>;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`priority ${priority}`}>{priority}</span>;
}

function IssueCard({ issue }: { issue: Issue }) {
  return <Link className="issue-card" href={issuePath(issue.number)}>
    <div className="card-top"><code>{issueKey(issue.number)}</code><PriorityBadge priority={issue.priority} /></div>
    <strong>{issue.title}</strong>
    {issue.description && <p>{issue.description}</p>}
    <span className="assignee">{issue.assignee || "Unassigned"}{issue.comments.length > 0 && <small>{issue.comments.length} {issue.comments.length === 1 ? "comment" : "comments"}</small>}</span>
  </Link>;
}

function boardUrl(query: string, view: string, priority: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (view !== "board") params.set("view", view);
  if (priority) params.set("priority", priority);
  return workspace + (params.size ? `?${params}` : "");
}

export function Board() {
  const { issues } = useDemo();
  const router = useRouter();
  const search = useSearchParams();
  const q = search.get("q") ?? "";
  const viewParam = search.get("view");
  const view = viewParam === "list" || viewParam === "archive" ? viewParam : "board";
  const priorityParam = search.get("priority");
  const priority = priorities.find(value => value === priorityParam) ?? "";

  const visible = issues.filter(issue =>
    issue.archived === (view === "archive")
    && (!priority || issue.priority === priority)
    && `${issue.title} ${issue.description}`.toLowerCase().includes(q.toLowerCase()),
  ).toSorted((a, b) => b.number - a.number);
  const active = issues.filter(issue => !issue.archived);

  function filter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = new FormData(event.currentTarget);
    router.push(boardUrl(String(input.get("q")).trim(), view, String(input.get("priority"))));
  }

  return <>
    <div className="crumb"><Link href="/">Mergepoint</Link><span>/</span>Product Engineering</div>
    <header className="page-heading">
      <div><h1>Issue board</h1><p>Sample issues and edits are stored in this browser.</p></div>
      <Link href={`${workspace}issues/new/`} className="button primary">+ New issue</Link>
    </header>
    <section className="stats" aria-label="Board totals">
      {[
        ["Total issues", active.length],
        ["In flight", active.filter(issue => issue.status === "in_progress" || issue.status === "review").length],
        ["Done", active.filter(issue => issue.status === "done").length],
        ["Unassigned", active.filter(issue => !issue.assignee && issue.status !== "done").length],
      ].map(([label, value]) => <div className="panel stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </section>
    <div className="toolbar">
      <nav className="view-tabs" aria-label="Issue view">
        {["board", "list", "archive"].map(mode => <Link key={mode} aria-current={view === mode ? "page" : undefined}
          href={boardUrl(q, mode, priority)}>{mode}</Link>)}
      </nav>
      <form className="filters" onSubmit={filter} key={`${q}:${priority}`}>
        <label><span className="sr-only">Search issues</span><input type="search" name="q" placeholder="Search issues…" maxLength={100} defaultValue={q} /></label>
        <label><span className="sr-only">Priority</span><select name="priority" defaultValue={priority}><option value="">Any priority</option>
          {priorities.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <button className="button">Apply</button>
        {(q || priority) && <Link href={boardUrl("", view, "")}>Clear</Link>}
      </form>
    </div>
    {view === "board" && <div className="columns">
      {statuses.map(status => {
        const column = visible.filter(issue => issue.status === status);
        return <section key={status} className={`column ${status}`}>
          <h2><i />{statusLabel[status]}<small>{column.length}</small></h2>
          {column.length ? column.map(issue => <IssueCard key={issue.number} issue={issue} />) : <p className="empty">No matching issues</p>}
        </section>;
      })}
    </div>}
    {view !== "board" && <div className="list">
      {visible.length ? visible.map(issue => <div className="panel list-row" key={issue.number}>
        <Link href={issuePath(issue.number)}><code>{issueKey(issue.number)}</code><strong>{issue.title}</strong></Link>
        <Pill issue={issue} /><PriorityBadge priority={issue.priority} />
      </div>) : <p className="panel empty">No matching issues</p>}
    </div>}
  </>;
}

function IssueForm({ existing, submit }: { existing?: Issue; submit: (fields: IssueFields) => void }) {
  const [error, setError] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    if (title.length < 3) return setError("Use at least three characters in the title.");
    setError("");
    submit({
      title,
      description: String(form.get("description")).trim(),
      status: String(form.get("status")) as Status,
      priority: String(form.get("priority")) as Priority,
      assignee: String(form.get("assignee")),
    });
  }

  return <form className="fields" onSubmit={save}>
    <label>Title<input name="title" required minLength={3} maxLength={120} defaultValue={existing?.title} /></label>
    <label>Description<textarea name="description" maxLength={1800} rows={4} defaultValue={existing?.description} /></label>
    <div className="form-grid">
      <label>Status<select name="status" defaultValue={existing?.status ?? "backlog"}>
        {statuses.map(status => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></label>
      <label>Priority<select name="priority" defaultValue={existing?.priority ?? "medium"}>
        {priorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}</select></label>
      <label>Assignee<select name="assignee" defaultValue={existing?.assignee ?? ""}><option value="">Unassigned</option>
        {team.map(name => <option key={name}>{name}</option>)}</select></label>
    </div>
    {error && <p role="alert" className="error-message">{error}</p>}
    <button className="button primary">{existing ? "Save changes" : "Create issue"}</button>
  </form>;
}

export function NewIssue() {
  const router = useRouter();
  function create(fields: IssueFields) {
    let number = 0;
    changeDemo(state => {
      number = state.nextNumber;
      return { nextNumber: number + 1, issues: [...state.issues, { ...fields, number, archived: false, comments: [] }] };
    });
    router.push(issuePath(number));
  }

  return <>
    <div className="crumb"><Link href={workspace}>Issue board</Link><span>/</span>New issue</div>
    <header className="page-heading"><div><h1>New issue</h1><p>Add a sample issue to this browser’s board.</p></div></header>
    <section className="panel detail-panel"><IssueForm submit={create} /></section>
  </>;
}

export function QueryIssue() {
  const number = useSearchParams().get("number") ?? "";
  return <IssueDetail number={/^[1-9]\d*$/.test(number) ? Number(number) : 0} />;
}

export function IssueDetail({ number }: { number: number }) {
  const { issues } = useDemo();
  const [editing, setEditing] = useState(false);
  const issue = issues.find(item => item.number === number);
  if (!issue) return <div className="panel detail-panel missing">
    <h1>Issue unavailable</h1><p>Local issues open in the browser that created them.</p><Link href={workspace} className="button">Back to board</Link>
  </div>;

  function update(change: (current: Issue) => Issue) {
    changeDemo(state => ({ ...state, issues: state.issues.map(item => item.number === number ? change(item) : item) }));
  }

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = String(new FormData(event.currentTarget).get("comment")).trim();
    if (!text) return;
    update(current => ({ ...current, comments: [...current.comments, text] }));
    event.currentTarget.reset();
  }

  return <>
    <div className="crumb"><Link href={workspace}>Issue board</Link><span>/</span>{issueKey(number)}</div>
    <header className="page-heading"><div><h1>{issue.title}</h1><p><code>{issueKey(number)}</code> {issue.archived && "· Archived"}</p></div>
      {!issue.archived && <button className="button" onClick={() => setEditing(!editing)}>{editing ? "Cancel editing" : "Edit issue"}</button>}</header>
    <div className="details-grid">
      <div className="sections">
        <section className="panel detail-panel">
          <h2>{editing ? "Edit issue" : "Description"}</h2>
          {editing ? <IssueForm existing={issue} submit={fields => {
            update(current => ({ ...current, ...fields }));
            setEditing(false);
          }} /> : <p className="description">{issue.description || "No description yet."}</p>}
        </section>
        <section className="panel detail-panel">
          <h2>Discussion</h2>
          {issue.comments.length > 0 && <ul className="comments">{issue.comments.map((comment, index) => <li key={index}>{comment}</li>)}</ul>}
          {!issue.archived && <form className="fields" onSubmit={addComment}>
            <label>Comment<textarea name="comment" rows={3} maxLength={1000} required /></label>
            <button className="button primary">Post comment</button>
          </form>}
        </section>
      </div>
      <aside className="panel detail-panel">
        <h2>Details</h2>
        <div className="detail-row"><span>Status</span><Pill issue={issue} /></div>
        <div className="detail-row"><span>Priority</span><PriorityBadge priority={issue.priority} /></div>
        <div className="detail-row"><span>Assignee</span><strong>{issue.assignee || "Unassigned"}</strong></div>
        {!issue.archived && <form className="fields move" key={issue.status} onSubmit={event => {
          event.preventDefault();
          const status = String(new FormData(event.currentTarget).get("status")) as Status;
          update(current => ({ ...current, status }));
        }}>
          <label>Move to<select name="status" defaultValue={issue.status}>
            {statuses.map(status => <option key={status} value={status}>{statusLabel[status]}</option>)}</select></label>
          <button className="button">Move issue</button>
        </form>}
        <button className="button archive-button" onClick={() => {
          setEditing(false);
          update(current => ({ ...current, archived: !current.archived }));
        }}>{issue.archived ? "Restore issue" : "Archive issue"}</button>
      </aside>
    </div>
  </>;
}

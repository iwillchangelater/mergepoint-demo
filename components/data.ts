export const workspace = "/w/product-engineering/";
export const statuses = ["backlog", "in_progress", "review", "done"] as const;
export const priorities = ["low", "medium", "high", "urgent"] as const;
export type Status = typeof statuses[number];
export type Priority = typeof priorities[number];

export const statusLabel: Record<Status, string> = {
  backlog: "Backlog", in_progress: "In progress", review: "In review", done: "Done",
};

export const team = ["Maya Chen", "Jordan Lee", "Leila Rahman"] as const;
export type IssueFields = {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
};

export type Issue = IssueFields & {
  number: number;
  archived: boolean;
  comments: string[];
};

const examples: [string, string, Status, Priority, string][] = [
  ["Ship order details redesign", "Keep the order number visible and move the shipment timeline above the items.", "done", "high", team[2]],
  ["Document webhook payloads", "Add examples of delivery and retry events to the partner guide.", "done", "medium", team[1]],
  ["Normalize tracking events", "Map carrier-specific codes to the three common tracking statuses.", "done", "medium", team[0]],
  ["Add delivery estimates to checkout", "Show the delivery window before payment.", "review", "high", team[2]],
  ["Review empty dashboard states", "Give first-time users a clear next step on each screen.", "review", "low", team[0]],
  ["Harden checkout retries", "Surface the current payment status when the checkout request times out.", "in_progress", "urgent", team[0]],
  ["Index order lookup by reference", "Measure support search latency with a representative dataset.", "in_progress", "medium", team[1]],
  ["Add keyboard shortcuts", "Make common board navigation actions easier to reach.", "backlog", "low", ""],
  ["Export billing history", "Give finance a monthly CSV that includes adjustments and refunds.", "backlog", "medium", team[1]],
  ["Design shipping exception states", "Specify how the timeline should handle delayed and returned parcels.", "backlog", "high", team[2]],
  ["Support carrier status webhooks", "Let partners send shipment updates and handle repeated deliveries consistently.", "in_progress", "high", team[1]],
  ["Polish first-run onboarding", "Guide new users from an empty workspace to their first issue.", "backlog", "medium", ""],
];

export const demoIssues: Issue[] = examples.map(([title, description, status, priority, assignee], index) => ({
  number: index + 1,
  title, description, status, priority, assignee,
  archived: false,
  comments: index === 10 ? ["I added a test case for repeat deliveries. Check it during review."] : [],
}));

export const issueKey = (number: number) => `ISS-${String(number).padStart(3, "0")}`;
export const issuePath = (number: number) => number <= demoIssues.length
  ? `${workspace}issues/${number}/`
  : `${workspace}issues/?number=${number}`;

import { IssueDetail } from "../../../../../components/demo";
import { demoIssues } from "../../../../../components/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoIssues.map(issue => ({ number: String(issue.number) }));
}

export default async function Page({ params }: { params: Promise<{ number: string }> }) {
  return <IssueDetail number={Number((await params).number)} />;
}

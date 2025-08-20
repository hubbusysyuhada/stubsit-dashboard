export async function generateStaticParams() {
  // Fetch all endpoints and their calls from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master`);
  const { data } = await res.json();

  // Flatten all endpoint/call combinations
  return data.flatMap((endpoint: { slug: string, calls: { slug: string }[] }) =>
    endpoint.calls.map(call => ({
      endpoint: endpoint.slug,
      call: call.slug,
    }))
  );
}

export default function CallPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
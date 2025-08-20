export async function generateStaticParams() {
  // Fetch all endpoints from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/master`);
  const { data } = await res.json();

  // Return an array of params objects
  return data.map((endpoint: { slug: string }) => ({
    endpoint: endpoint.slug,
  }));
}

export default function CallPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
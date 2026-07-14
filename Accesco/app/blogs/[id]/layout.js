// NOTE: every blog post shares this static title/description — same generateMetadata()
// gap as the swadisht category/restaurant [slug] layouts. Flagged, not fixed here.
export const metadata = {
  title: "Read Blog Post | Accesco Living Blogs",
  description: "Read insightful posts, quick commerce trends, and platform news from the Accesco Living team.",
};

export default function Layout({ children }) {
  return <>{children}</>;
}

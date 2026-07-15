// NOTE: every restaurant shares this static title/description — same generateMetadata()
// gap as app/services/swadisht/category/[slug]/layout.js. Flagged, not fixed here.
export const metadata = {
  title: "Order from Restaurants | Swadisht",
  description: "Explore menu cards, chef specials and customer reviews for top cloud kitchens and restaurants.",
};

export default function Layout({ children }) {
  return <>{children}</>;
}

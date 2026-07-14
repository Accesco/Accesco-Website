// NOTE: every category shares this static title/description because Next.js reads it at
// build time and this route has no generateMetadata(). Each /services/swadisht/category/[slug]
// page currently reports an identical title to Google — a real duplicate-title risk that a
// hardcoded per-page canonical here would make worse, not better. Needs a generateMetadata()
// export keyed off params.slug (fetch the category name/description) as a follow-up.
export const metadata = {
  title: "Browse Cuisine Categories | Swadisht",
  description: "Explore and order from various cuisine categories, meals and chef specialties on Swadisht.",
};

export default function Layout({ children }) {
  return <>{children}</>;
}

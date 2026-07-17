import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata = {
  title: "Blog | Insights on Commerce, Farming & Sustainable Living",
  description:
    "Read the Accesco Living blog — stories, insights and updates on FarmChain sourcing, household intelligence, sustainable fashion and the future of circular commerce in India.",
};

export default function Layout({ children }) {
  return (
    <div className={baloo.variable}>
      {children}
    </div>
  );
}
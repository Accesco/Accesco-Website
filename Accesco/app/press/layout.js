import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Press & Media | Accesco Living",
  description:
    "Official announcements, news coverage, resources, and official media kit from the Accesco Living ecosystem.",
};

export default function PressLayout({ children }) {
  return <div className={baloo.className}>{children}</div>;
}
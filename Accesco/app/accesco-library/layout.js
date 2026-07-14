import { Baloo_Bhai_2 } from "next/font/google";

const baloo = Baloo_Bhai_2({
  subsets: ["latin"],
  weight: ["800"],
});

export const metadata = {
  title: "Accesco Library | Resources, Videos & Knowledge",
  description:
    "Explore the Accesco Library — curated resources, video walkthroughs, and expert knowledge for the Accesco Living community.",
  alternates: {
    canonical: 'https://accescoliving.com/accesco-library',
  },
};

export default function AccescoLibraryLayout({ children }) {
  return (
    <div className={baloo.className}>
      {children}
    </div>
  );
}
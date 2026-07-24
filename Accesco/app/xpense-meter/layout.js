import { jetbrainsMono } from '@/app/fonts';

export const metadata = {
  title: "Household Budget Calculator | Plan Your Monthly Spending",
  description: "Use the Accesco Living Budget Calculator to plan your monthly household expenses across needs, wants and savings. Smart budgeting for urban Indian families.",
  alternates: {
    canonical: 'https://accescoliving.com/xpense-meter',
  },
};

export default function Layout({ children }) {
  return <div className={jetbrainsMono.variable}>{children}</div>;
}

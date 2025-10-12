import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/layout/footer";
import { GoogleAnalytics } from '@next/third-parties/google'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <div>
      {gaId && <GoogleAnalytics gaId={gaId} />}
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

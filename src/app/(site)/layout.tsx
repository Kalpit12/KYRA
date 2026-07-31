import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { LoadingScreen } from "@/components/organisms/loading-screen";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LoadingScreen />
      <SmoothScrollProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}

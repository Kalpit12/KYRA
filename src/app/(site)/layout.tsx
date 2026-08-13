import { headers } from "next/headers";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { ChunkErrorReloader } from "@/components/providers/chunk-error-reloader";
import { LoadingScreen } from "@/components/organisms/loading-screen";
import { Navbar } from "@/components/organisms/navbar";
import { Footer } from "@/components/organisms/footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const initialNavOverHero = pathname === "/";

  return (
    <>
      <ChunkErrorReloader />
      <LoadingScreen />
      <SmoothScrollProvider>
        <Navbar initialNavOverHero={initialNavOverHero} />
        <main>{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}

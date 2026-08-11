import { LocaleProvider } from "@/components/LocaleProvider";
import { ConfigProvider } from "@/components/ConfigProvider";
import { ScrollRig } from "@/components/ScrollRig";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Break } from "@/components/sections/Break";
import { Alloys } from "@/components/sections/Alloys";
import { Product } from "@/components/sections/Product";
import { Lab } from "@/components/sections/Lab";
import { Circular } from "@/components/sections/Circular";
import { LocationSection } from "@/components/sections/LocationSection";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <LocaleProvider>
      <ConfigProvider>
        <ScrollRig />
        <Header />
        <main>
          <Hero />
          <Process />
          <Break />
          <Alloys />
          <Product />
          <Lab />
          <Circular />
          <LocationSection />
          <Contact />
        </main>
        <Footer />
      </ConfigProvider>
    </LocaleProvider>
  );
}

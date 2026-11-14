import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import OffersSlider from '@/components/sections/OffersSlider';
import CategoriesSection from '@/components/sections/CategoriesSection';
import TrendingPackagesSection from '@/components/sections/TrendingPackagesSection';
import PromotionSection from '@/components/sections/PromotionSection';
import PackagesOnTheBaseOfCategories from '@/components/sections/PackagesOnTheBaseOfCategories';

export const metadata: Metadata = {
  title: "Desert Safari Deals in Dubai | Desert Smart Tourism",
  description: "Book Dubai desert safari deals, including morning and evening desert safari with dinner, premium safari packages for a luxury experience ||  Desert Smart Tourism",
  keywords: [
    "desert safari deals",
    "morning desert safari dubai",
    "desert safari offers",
    "premium desert safari",
    "premium desert safari dubai",
    "desert safari tour",
    "desert safari package",
    "dubai desert safari dinner",
    "desert safari online booking",
    "dubai desert safari tours"
  ],
};

export default function Home() {
  return (
    <main className="max-w-[1920px]">
      <Header />
      <HeroSection />
      <OffersSlider />
      <CategoriesSection />
      <TrendingPackagesSection />
      <PackagesOnTheBaseOfCategories />
      <PromotionSection />
      <Footer />
    </main>
  );
}

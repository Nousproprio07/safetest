import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import WhySection from "@/components/home/WhySection";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSection from "@/components/home/TrustSection";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <WhySection />
      <Features />
      <HowItWorks />
      <TrustSection />
      <CTA />
    </Layout>
  );
};

export default Index;

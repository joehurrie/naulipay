import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsMarquee from '@/components/landing/StatsMarquee'
import VehicleShowcaseSection from '@/components/landing/VehicleShowcaseSection'
import RideFinderSection from '@/components/landing/RideFinderSection'
import FleetSection from '@/components/landing/FleetSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import LoyaltySection from '@/components/landing/LoyaltySection'
import FooterSection from '@/components/landing/FooterSection'

export default function HomePage() {
  return (
    <main className="bg-black">
      <Navbar transparent />
      <HeroSection />
      <StatsMarquee />
      <VehicleShowcaseSection />
      <RideFinderSection />
      <FleetSection />
      <HowItWorksSection />
      <LoyaltySection />
      <FooterSection />
    </main>
  )
}

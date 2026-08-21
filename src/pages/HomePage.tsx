import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { TrustBar } from '../components/home/TrustBar';
import { AboutSection } from '../components/home/AboutSection';
import { DepartmentsSection } from '../components/home/DepartmentsSection';
import { WhyChooseSection } from '../components/home/WhyChooseSection';
import { DoctorsPreviewSection } from '../components/home/DoctorsPreviewSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LocationSection } from '../components/home/LocationSection';
import { BookingModal } from '../components/booking/BookingModal';

export const HomePage: React.FC = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  const handleOpenGeneralBooking = () => {
    setSelectedDoctorId(undefined);
    setSelectedServiceId(undefined);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-0">
      <Hero />
      <TrustBar />
      <AboutSection />
      <DepartmentsSection onOpenBooking={handleOpenGeneralBooking} />
      <WhyChooseSection />
      <DoctorsPreviewSection onOpenBooking={handleOpenGeneralBooking} />
      <HowItWorksSection />
      <TestimonialsSection />
      <LocationSection onOpenBooking={handleOpenGeneralBooking} />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctorId={selectedDoctorId}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
};

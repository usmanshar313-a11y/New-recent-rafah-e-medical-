import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { BookingModal } from './components/booking/BookingModal';
import {
  HomeSkeleton,
  ServicesSkeleton,
  AboutSkeleton,
  DoctorsSkeleton,
  ContactSkeleton,
  PortalSkeleton,
  PageSkeleton,
} from './components/skeletons';

// Code-split lazy loaded pages for optimal performance and instant skeleton feedback
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const DepartmentsPage = lazy(() =>
  import('./pages/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage }))
);
const DepartmentDetailPage = lazy(() =>
  import('./pages/DepartmentDetailPage').then((m) => ({ default: m.DepartmentDetailPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PortalPage = lazy(() =>
  import('./pages/PortalPage').then((m) => ({ default: m.PortalPage }))
);
const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((m) => ({ default: m.AdminApp }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

const AppContent: React.FC = () => {
  const [globalBookingOpen, setGlobalBookingOpen] = useState(false);
  const [globalDoctorId, setGlobalDoctorId] = useState<string | undefined>(undefined);
  const [globalServiceId, setGlobalServiceId] = useState<string | undefined>(undefined);
  const location = useLocation();

  React.useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ doctorId?: string; departmentId?: string; serviceId?: string }>;
      if (customEvent && customEvent.detail) {
        setGlobalDoctorId(customEvent.detail.doctorId);
        setGlobalServiceId(customEvent.detail.departmentId || customEvent.detail.serviceId);
      } else {
        setGlobalDoctorId(undefined);
        setGlobalServiceId(undefined);
      }
      setGlobalBookingOpen(true);
    };
    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  // Hide WhatsApp & Booking floating buttons on standalone admin route
  const isHideWhatsApp = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1F2937]">
      <Navbar onOpenBooking={() => setGlobalBookingOpen(true)} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<HomeSkeleton />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/departments"
            element={
              <Suspense fallback={<ServicesSkeleton />}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="/departments/:departmentId"
            element={
              <Suspense fallback={<DoctorsSkeleton />}>
                <DepartmentDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/departments.html"
            element={
              <Suspense fallback={<ServicesSkeleton />}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="/services"
            element={
              <Suspense fallback={<ServicesSkeleton />}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="/services.html"
            element={
              <Suspense fallback={<ServicesSkeleton />}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="/doctors"
            element={
              <Suspense fallback={<ServicesSkeleton />}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="/doctors.html"
            element={
              <Suspense fallback={<ServicesSkeleton />}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<AboutSkeleton />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/about.html"
            element={
              <Suspense fallback={<AboutSkeleton />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<ContactSkeleton />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/contact.html"
            element={
              <Suspense fallback={<ContactSkeleton />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/portal/*"
            element={
              <Suspense fallback={<PortalSkeleton />}>
                <PortalPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route
            path="/admin.html"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <TermsPage />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <PrivacyPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </main>

      <Footer />

      {!isHideWhatsApp && <FloatingWhatsApp onOpenBooking={() => setGlobalBookingOpen(true)} />}

      <BookingModal
        isOpen={globalBookingOpen}
        onClose={() => {
          setGlobalBookingOpen(false);
          setGlobalDoctorId(undefined);
          setGlobalServiceId(undefined);
        }}
        preselectedDoctorId={globalDoctorId}
        preselectedServiceId={globalServiceId}
      />
    </div>
  );
};


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

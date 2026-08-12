import React from 'react';
import { ShieldCheck, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-[#1F2937] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xs border border-gray-200 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#22A25A] hover:text-[#1E834B]">
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1F2937]">
          Terms of Service & Healthcare Disclaimer
        </h1>

        <div className="p-4 bg-[#FBEAE0] border border-[#D9691F]/20 rounded-xl text-xs text-[#1F2937] space-y-1">
          <div className="font-bold text-sm flex items-center gap-2 text-[#D9691F]">
            <Phone className="w-4 h-4" /> Medical Emergency Disclaimer
          </div>
          <p className="text-[#6B7280]">
            Online appointment booking forms and website requests are NOT intended for immediate life-threatening medical emergencies. If you or a family member are facing a critical emergency, please visit our hospital emergency ward immediately at St-10, Block 13, Gulberg Town, Karachi, or call our 24/7 hotline at +92 21 36342011.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#6B7280] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#1F2937]">1. Scope of Clinical Services</h2>
            <p>
              Rafah-E-Aam Medical Centre provides outpatient consultations, diagnostic laboratory testing, maternity care, and round-the-clock emergency triage. Appointment requests submitted online are subject to confirmation by clinic staff based on doctor availability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#1F2937]">2. Patient Records & Accuracy</h2>
            <p>
              Patients are responsible for providing accurate contact numbers and medical history when scheduling visits or uploading previous medical prescriptions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#1F2937]">3. Contact Information</h2>
            <p>
              For inquiries, cancellations, or medical assistance, please contact us at +92 21 36342011 or visit our medical center in Gulberg Town, Karachi.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

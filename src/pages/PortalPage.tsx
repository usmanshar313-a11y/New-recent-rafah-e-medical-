import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Calendar,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Heart,
  Plus,
  Bell,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  FileText,
  Download,
  RefreshCw,
  Copy,
  Check,
  HelpCircle,
  KeyRound,
  Sparkles,
  Info,
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Appointment, AppointmentStatus, MedicalReport } from '../types';
import { Toast, ToastMessage } from '../components/common/Toast';

export const PortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    patientProfile, 
    loading, 
    signInWithGoogle, 
    sendPasswordlessEmailLink, 
    completePasswordlessEmailSignIn, 
    isPasswordlessEmailLink, 
    signUpWithEmail,
    signInWithEmail,
    updatePatientProfile, 
    logout 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'appointments' | 'reports' | 'profile'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);

  // Authentication Mode & Method States
  const [authMethod, setAuthMethod] = useState<'passwordless' | 'password'>('passwordless');
  const [passwordMode, setPasswordMode] = useState<'login' | 'signup'>('login');

  // Passwordless Authentication States
  const [authEmail, setAuthEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isEmailLinkNotAllowed, setIsEmailLinkNotAllowed] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailSentAddress, setEmailSentAddress] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifyingEmailLink, setVerifyingEmailLink] = useState(false);
  const [emailPromptRequired, setEmailPromptRequired] = useState(false);
  const [promptEmailInput, setPromptEmailInput] = useState('');

  // Password-based Form States
  const [passEmail, setPassEmail] = useState('');
  const [passPassword, setPassPassword] = useState('');
  const [passName, setPassName] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [showPassPassword, setShowPassPassword] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleCopyDomain = () => {
    try {
      const hostname = window.location.hostname;
      navigator.clipboard.writeText(hostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 3000);
    } catch (e) {
      console.error('Failed to copy domain:', e);
    }
  };

  // Profile Edit Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileBloodGroup, setProfileBloodGroup] = useState('A+');
  const [profileEmergencyContact, setProfileEmergencyContact] = useState('');
  const [profileZipCode, setProfileZipCode] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Target ZIP Code & ZIP Verification Modal state
  const [patientZipCode, setPatientZipCode] = useState<string | null>(null);
  const [selectedReportForView, setSelectedReportForView] = useState<MedicalReport | null>(null);
  const [zipModalOpen, setZipModalOpen] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [zipError, setZipError] = useState('');
  const [isVerifyingZip, setIsVerifyingZip] = useState(false);

  // Toast & Confirm Modal state
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  // Detect and process email sign-in link automatically on mount
  useEffect(() => {
    const checkIncomingEmailLink = async () => {
      if (isPasswordlessEmailLink()) {
        setVerifyingEmailLink(true);
        setAuthError('');
        try {
          const storedEmail = window.localStorage.getItem('emailForSignIn');
          if (!storedEmail) {
            setEmailPromptRequired(true);
            setVerifyingEmailLink(false);
            return;
          }
          await completePasswordlessEmailSignIn(storedEmail);
          window.history.replaceState({}, document.title, window.location.pathname);
          setToast({ message: 'Welcome to Rafah-E-Aam Patient Portal!', type: 'success' });
        } catch (err: any) {
          console.error('Email sign in error:', err);
          const code = err?.code || '';
          if (code === 'auth/invalid-action-code' || err?.message?.includes('invalid-action-code')) {
            setAuthError('This sign-in link has expired or has already been used. Please request a new one.');
          } else if (code === 'auth/invalid-email') {
            setAuthError('Invalid email address for sign-in verification.');
          } else {
            setAuthError(err?.message || 'Unable to complete sign in. Please request a new link.');
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        } finally {
          setVerifyingEmailLink(false);
        }
      }
    };

    checkIncomingEmailLink();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (patientProfile) {
      setProfileName(patientProfile.name || '');
      setProfilePhone(patientProfile.phone || '');
      setProfileDob(patientProfile.dob || '');
      setProfileBloodGroup(patientProfile.bloodGroup || 'A+');
      setProfileEmergencyContact(patientProfile.emergencyContact || '');
      setProfileZipCode(patientProfile.zipCode || '');
      if (patientProfile.zipCode) {
        setPatientZipCode(patientProfile.zipCode);
      }
    }
  }, [patientProfile]);

  useEffect(() => {
    if (user) {
      fetchPatientData();
    }
  }, [user]);

  const fetchPatientZipCode = async () => {
    const currentUid = auth.currentUser?.uid || user?.uid;
    if (!currentUid) return null;
    try {
      const patientDocRef = doc(db, 'patients', currentUid);
      const patientSnap = await getDoc(patientDocRef);
      let zip = '';
      if (patientSnap.exists()) {
        const data = patientSnap.data();
        zip = (data.zipCode || data.postalCode || data.zip || '').toString().trim();
        // If zipCode is missing in Firestore, automatically set it to patientId (currentUid)
        if (!zip) {
          zip = currentUid;
          await updateDoc(patientDocRef, { zipCode: currentUid }).catch(() => {
            setDoc(patientDocRef, { zipCode: currentUid }, { merge: true }).catch(console.error);
          });
        }
      } else {
        // Automatically create patient document with zipCode = currentUid
        zip = currentUid;
        await setDoc(patientDocRef, { uid: currentUid, zipCode: currentUid, createdAt: new Date().toISOString() }, { merge: true }).catch(console.error);
      }
      setPatientZipCode(zip);
      setProfileZipCode(zip);
      return zip;
    } catch (err) {
      console.error('Error fetching patient ZIP code:', err);
      setPatientZipCode(currentUid);
      setProfileZipCode(currentUid);
      return currentUid;
    }
  };

  const handleOpenReportWithZipCheck = (report: MedicalReport) => {
    setSelectedReportForView(report);
    setZipInput('');
    setZipError('');
    setZipModalOpen(true);
  };

  const closeZipModal = () => {
    setZipModalOpen(false);
    setSelectedReportForView(null);
    setZipInput('');
    setZipError('');
  };

  const handleVerifyZipAndOpenReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportForView) return;

    const entered = zipInput.trim().toLowerCase();
    if (!entered) {
      setZipError('Please enter your ZIP code.');
      return;
    }

    setIsVerifyingZip(true);
    setZipError('');

    try {
      // Retrieve target security access code from Firestore patients/{uid}
      const currentUid = auth.currentUser?.uid || user?.uid;
      let targetCode = patientZipCode || currentUid || '';

      if (currentUid) {
        const pDocRef = doc(db, 'patients', currentUid);
        const pSnap = await getDoc(pDocRef);
        if (pSnap.exists()) {
          const pData = pSnap.data();
          const validCodes = [
            pData.patientCode,
            pData.mrNumber,
            pData.zipCode,
            pData.postalCode,
            pData.zip,
            currentUid,
          ]
            .filter(Boolean)
            .map((c) => c.toString().trim().toLowerCase());

          targetCode = (pData.patientCode || pData.mrNumber || pData.zipCode || pData.postalCode || pData.zip || currentUid).toString().trim();
          
          const isMatch = validCodes.includes(entered) || entered === currentUid.toLowerCase();

          if (isMatch) {
            // MATCH: Close modal, clear input, and open Google Drive link in a new tab
            const targetUrl = selectedReportForView.driveUrl || selectedReportForView.fileUrl;
            closeZipModal();

            if (targetUrl) {
              window.open(targetUrl, '_blank', 'noopener,noreferrer');
            } else {
              alert('Report Google Drive link is unavailable.');
            }
            return;
          } else {
            setZipError('Incorrect Access Code / PIN / ZIP code. Please try again.');
            return;
          }
        } else {
          targetCode = currentUid;
          await setDoc(pDocRef, { uid: currentUid, zipCode: currentUid, patientCode: currentUid, createdAt: new Date().toISOString() }, { merge: true }).catch(console.error);
        }
        setPatientZipCode(targetCode);
      }

      // Step 3: Fallback check against targetCode OR currentUid
      const isMatch =
        entered === targetCode.toLowerCase() ||
        (currentUid && entered === currentUid.toLowerCase());

      if (isMatch) {
        const targetUrl = selectedReportForView.driveUrl || selectedReportForView.fileUrl;
        closeZipModal();

        if (targetUrl) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
          alert('Report Google Drive link is unavailable.');
        }
      } else {
        setZipError('Incorrect Access Code / PIN / ZIP code. Please try again.');
      }
    } catch (err) {
      console.error('Security code verification error:', err);
      setZipError('Verification failed. Please check your network connection and try again.');
    } finally {
      setIsVerifyingZip(false);
    }
  };

  const fetchPatientReports = async () => {
    const currentUid = auth.currentUser?.uid || user?.uid;
    if (!currentUid) return;
    setLoadingReports(true);
    try {
      // Query reports strictly where patientId == currentUserUid
      const reportsQ = query(collection(db, 'reports'), where('patientId', '==', currentUid));
      const reportsSnap = await getDocs(reportsQ);
      const fetchedReports: MedicalReport[] = [];

      reportsSnap.forEach((d) => {
        fetchedReports.push({ id: d.id, ...d.data() } as MedicalReport);
      });

      fetchedReports.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime());
      setReports(fetchedReports);
    } catch (err) {
      console.error('Error fetching patient medical reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchPatientData = async () => {
    const currentUid = auth.currentUser?.uid || user?.uid;
    if (!currentUid) return;
    setLoadingData(true);
    try {
      // Retrieve patient profile ZIP code
      fetchPatientZipCode();

      // Fetch Appointments strictly by patientId (auth.currentUser.uid)
      const apptQ = query(collection(db, 'appointments'), where('patientId', '==', currentUid));
      const apptSnap = await getDocs(apptQ);
      const fetchedAppts: Appointment[] = [];

      apptSnap.forEach((d) => {
        const apptData = { id: d.id, ...d.data() } as Appointment;
        if (!apptData.hiddenForPatient && !apptData.patientArchived) {
          fetchedAppts.push(apptData);
        }
      });

      fetchedAppts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAppointments(fetchedAppts);

      // Also fetch patient reports
      fetchPatientReports();
    } catch (err) {
      console.error('Error fetching patient data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    if (authLoading) return;
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      setToast({ message: 'Welcome to Rafah-E-Aam Patient Portal!', type: 'success' });
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err?.code || '';
      const message = err?.message || '';
      if (code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed. Please try again.');
      } else if (code === 'auth/cancelled-popup-request') {
        // Ignored
      } else if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
        setAuthError('auth/unauthorized-domain: This domain is not listed in Firebase Authorized Domains. Follow the guide below to add it in Firebase Console, or use Email & Password.');
      } else {
        setAuthError(message || 'Google sign-in failed. Please try again or use email.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendEmailLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading || resendCooldown > 0) return;
    setAuthError('');

    const cleanEmail = authEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setAuthLoading(true);
    try {
      await sendPasswordlessEmailLink(cleanEmail);
      setEmailSentAddress(cleanEmail);
      setEmailSentSuccess(true);
      setResendCooldown(60); // 60s cooldown
    } catch (err: any) {
      console.error('Send Email Link Error:', err);
      const code = err?.code || '';
      const message = err?.message || '';
      if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
        setAuthError('auth/unauthorized-domain: This domain is not listed in Firebase Authorized Domains. Follow the guide below to add it in Firebase Console, or use Email & Password.');
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError('Email link sign-in is not enabled in Firebase Console. Enable "Email link (passwordless sign-in)" under Authentication → Sign-in method, or use Email & Password.');
      } else {
        setAuthError(message || 'Failed to send secure sign-in link. Please check your email and try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthError('');

    const cleanEmail = passEmail.trim().toLowerCase();
    if (!cleanEmail || !passPassword) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    setAuthLoading(true);
    try {
      await signInWithEmail(cleanEmail, passPassword);
      setToast({ message: 'Welcome to Rafah-E-Aam Patient Portal!', type: 'success' });
    } catch (err: any) {
      console.error('Password Login Error:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setAuthError('Invalid email or password. Please verify your credentials or create a new account.');
      } else if (code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setAuthError('Too many failed attempts. Please wait a moment before trying again.');
      } else {
        setAuthError(err?.message || 'Login failed. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthError('');

    const cleanEmail = passEmail.trim().toLowerCase();
    const cleanName = passName.trim();
    if (!cleanName) {
      setAuthError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!passPassword || passPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (passPassword !== passConfirm) {
      setAuthError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setAuthLoading(true);
    try {
      await signUpWithEmail(cleanEmail, passPassword, cleanName);
      setToast({ message: 'Account created! Welcome to Rafah-E-Aam Patient Portal.', type: 'success' });
    } catch (err: any) {
      console.error('Password Signup Error:', err);
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please switch to "Log In" above.');
      } else if (code === 'auth/weak-password') {
        setAuthError('Password is too weak. Please use at least 6 characters.');
      } else {
        setAuthError(err?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePromptEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthError('');

    const cleanEmail = promptEmailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setAuthError('Please enter a valid email address to complete sign-in.');
      return;
    }

    setAuthLoading(true);
    try {
      await completePasswordlessEmailSignIn(cleanEmail);
      setEmailPromptRequired(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      setToast({ message: 'Welcome to Rafah-E-Aam Patient Portal!', type: 'success' });
    } catch (err: any) {
      console.error('Email sign in error:', err);
      setAuthError(err?.message || 'Unable to sign in with this email and link. Please request a new link.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAppointments([]);
    setReports([]);
    setAuthEmail('');
    setAuthError('');
    setEmailSentSuccess(false);
    setEmailSentAddress('');
  };

  const handleCancelAppointment = (apptId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment?',
      confirmLabel: 'Confirm Cancel',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          const ref = doc(db, 'appointments', apptId);
          await updateDoc(ref, { status: 'cancelled' });
          setAppointments((prev) =>
            prev.map((a) => (a.id === apptId ? { ...a, status: 'cancelled' } : a))
          );
          setToast({ message: 'Your appointment has been cancelled successfully.', type: 'success' });
        } catch (err) {
          console.error('Failed to cancel appointment:', err);
          setToast({
            message: 'Failed to cancel appointment. Please check your network connection or try again.',
            type: 'error',
          });
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleDeleteAppointment = (apptId: string) => {
    const targetAppt = appointments.find((a) => a.id === apptId);
    const isCancelled = targetAppt
      ? targetAppt.status === 'cancelled' || String(targetAppt.status).toLowerCase() === 'canceled'
      : false;

    setConfirmModal({
      isOpen: true,
      title: isCancelled ? 'Delete Appointment' : 'Remove Appointment',
      message: isCancelled
        ? 'Please confirm permanent deletion of this cancelled appointment from your schedule.'
        : 'Please confirm removal of this appointment from your dashboard.',
      confirmLabel: isCancelled ? 'Delete Permanently' : 'Remove',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          if (isCancelled) {
            // Permanent Delete from Firestore ONLY if appointment status is cancelled
            await deleteDoc(doc(db, 'appointments', apptId));
            setToast({ message: 'Cancelled appointment permanently deleted.', type: 'success' });
          } else {
            // Soft Delete for Patient Portal only (keep Firestore document intact for hospital records)
            const ref = doc(db, 'appointments', apptId);
            await updateDoc(ref, {
              hiddenForPatient: true,
              patientArchived: true,
            });
            setToast({ message: 'Appointment removed from your dashboard.', type: 'success' });
          }
          setAppointments((prev) => prev.filter((a) => a.id !== apptId));
        } catch (err) {
          console.error('Failed to remove appointment:', err);
          setToast({ message: 'Failed to remove appointment. Please try again.', type: 'error' });
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccessMsg('');
    try {
      await updatePatientProfile({
        name: profileName,
        phone: profilePhone,
        dob: profileDob,
        bloodGroup: profileBloodGroup,
        emergencyContact: profileEmergencyContact,
        zipCode: profileZipCode,
      });
      setPatientZipCode(profileZipCode);
      setProfileSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Helper countdown text calculation
  const getCountdownText = (dateStr: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past date';
  };

  const normalizeAppointmentStatus = (status: AppointmentStatus) => String(status || '').trim().toLowerCase();

  const getStatusBadge = (status: AppointmentStatus) => {
    const normalizedStatus = normalizeAppointmentStatus(status);
    switch (normalizedStatus) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-[#EAF6F0] text-[#22A25A] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#22A25A]/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'completed':
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Pending Confirmation
          </span>
        );
    }
  };

  const isAppointmentCancelled = (status: AppointmentStatus) => {
    const normalizedStatus = normalizeAppointmentStatus(status);
    return normalizedStatus === 'cancelled' || normalizedStatus === 'canceled';
  };

  const isAppointmentCompleted = (status: AppointmentStatus) => {
    const normalizedStatus = normalizeAppointmentStatus(status);
    return normalizedStatus === 'completed' || normalizedStatus === 'done';
  };

  const getAppointmentActionLabel = (status: AppointmentStatus) => {
    return isAppointmentCompleted(status) || isAppointmentCancelled(status)
      ? 'Delete Appointment'
      : 'Cancel Appointment';
  };

  const shouldUseDeleteAction = (status: AppointmentStatus) => {
    return isAppointmentCompleted(status) || isAppointmentCancelled(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#22A25A] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm font-bold text-[#1F2937]">Loading Patient Portal...</div>
        </div>
      </div>
    );
  }

  // Render Authentication UI if not authenticated
  if (!user) {
    const isUnauthorizedDomain =
      authError.toLowerCase().includes('unauthorized-domain') ||
      authError.toLowerCase().includes('authorized domain');

    return (
      <div className="min-h-screen bg-[#F5F1E8] py-12 px-4 flex items-center justify-center text-[#182334]">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-200/80 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#22A25A] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-[#22A25A]/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-[#182334] tracking-tight">
              Patient Portal Sign In
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto">
              Access your appointments, medical records, and reports securely.
            </p>
          </div>

          {/* Top Method Tabs */}
          <div className="bg-gray-100 p-1 rounded-2xl flex gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('passwordless');
                setAuthError('');
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'passwordless'
                  ? 'bg-white text-[#182334] shadow-xs'
                  : 'text-gray-500 hover:text-[#182334]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#22A25A]" />
              <span>Google / Link</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setAuthError('');
              }}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'password'
                  ? 'bg-white text-[#182334] shadow-xs'
                  : 'text-gray-500 hover:text-[#182334]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#22A25A]" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Link Verification in Progress */}
          {verifyingEmailLink ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#22A25A] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#182334]">Verifying your sign-in link...</p>
                <p className="text-xs text-gray-500">Please wait while we log you in securely.</p>
              </div>
            </div>
          ) : emailPromptRequired ? (
            /* Email confirmation prompt for cross-device sign-in link clicks */
            <form onSubmit={handlePromptEmailSubmit} className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
                Please confirm the email address you used to request this sign-in link to complete your login.
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#182334] mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={promptEmailInput}
                    onChange={(e) => setPromptEmailInput(e.target.value)}
                    placeholder="patient@example.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#22A25A] hover:bg-[#1E834B] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-[#22A25A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Complete Sign In</span>
                  </>
                )}
              </button>
            </form>
          ) : emailSentSuccess ? (
            /* "CHECK YOUR EMAIL" VIEW */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-[#EFF4EC] text-[#22A25A] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-heading font-extrabold text-xl text-[#182334]">
                  Check your email
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  We sent a secure sign-in link to:
                </p>
                <p className="text-sm font-bold text-[#22A25A] bg-[#EFF4EC] py-1.5 px-3 rounded-lg inline-block break-all">
                  {emailSentAddress}
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-left space-y-2 text-xs text-gray-600 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22A25A] shrink-0 mt-0.5" />
                  <span>Click the link in your email to sign in instantly.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22A25A] shrink-0 mt-0.5" />
                  <span>No password needed. You'll be logged in automatically.</span>
                </div>
                <div className="flex items-start gap-2 text-gray-500 pt-1 border-t border-gray-200/60">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Don't see it? Check your Spam or Promotions folder.</span>
                </div>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendEmailLinkSubmit}
                  disabled={authLoading || resendCooldown > 0}
                  className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm font-bold text-[#182334] rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${authLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `Resend sign-in link (${resendCooldown}s)`
                      : 'Resend sign-in email'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmailSentSuccess(false);
                    setAuthError('');
                  }}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-[#182334] transition-colors cursor-pointer"
                >
                  Use a different email address
                </button>
              </div>
            </div>
          ) : authMethod === 'passwordless' ? (
            /* PASSWORDLESS (GOOGLE / MAGIC LINK) VIEW */
            <div className="space-y-4">
              {/* UNAUTHORIZED DOMAIN DETECTED HELPER */}
              {isUnauthorizedDomain ? (
                <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 space-y-3 text-left">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">
                        Firebase Domain Authorization Required
                      </h4>
                      <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                        Google Sign-In & Email Links require this app’s domain to be added to Authorized Domains in Firebase.
                      </p>
                    </div>
                  </div>

                  {/* Copy Domain Box */}
                  <div className="bg-white border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-medium text-gray-800 truncate select-all">
                      {typeof window !== 'undefined' ? window.location.hostname : ''}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedDomain ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-700" />
                          <span className="text-green-800">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Domain</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 3 Step Instructions */}
                  <ol className="text-[11px] text-amber-900 space-y-1 list-decimal list-inside pl-1 leading-snug">
                    <li>Open <strong>Firebase Console</strong> → Select your project</li>
                    <li>Go to <strong>Authentication → Settings → Authorized domains</strong></li>
                    <li>Click <strong>Add domain</strong> and paste the copied domain</li>
                  </ol>

                  <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('password');
                        setAuthError('');
                      }}
                      className="text-xs font-bold text-[#22A25A] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Or sign in with Email & Password</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ) : authError ? (
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              ) : null}

              {/* CONTINUE WITH GOOGLE */}
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                disabled={authLoading}
                className="w-full bg-white hover:bg-gray-50 text-[#182334] font-bold py-3 px-4 rounded-xl border border-gray-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* DIVIDER */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  or
                </span>
                <div className="border-t border-gray-200 w-full" />
              </div>

              {/* CONTINUE WITH EMAIL LINK */}
              <form onSubmit={handleSendEmailLinkSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#182334] mb-1.5">
                    Continue with Email Link
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#22A25A] hover:bg-[#1E834B] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-[#22A25A]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
                >
                  {authLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending link...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Sign-In Link</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center flex flex-col gap-1.5 text-xs text-gray-500">
                <button
                  type="button"
                  onClick={() => setShowGuideModal(true)}
                  className="text-[11px] text-[#22A25A] font-semibold hover:underline inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How to authorize domain in Firebase</span>
                </button>
              </div>
            </div>
          ) : (
            /* EMAIL & PASSWORD AUTHENTICATION VIEW */
            <div className="space-y-4">
              {/* Login / Sign Up Pill Switch */}
              <div className="bg-gray-50 p-1 rounded-xl flex gap-1 border border-gray-200/70">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordMode('login');
                    setAuthError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    passwordMode === 'login'
                      ? 'bg-[#22A25A] text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-200/60'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordMode('signup');
                    setAuthError('');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    passwordMode === 'signup'
                      ? 'bg-[#22A25A] text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-200/60'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              {passwordMode === 'login' ? (
                /* PASSWORD LOGIN FORM */
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#182334] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={passEmail}
                        onChange={(e) => setPassEmail(e.target.value)}
                        placeholder="patient@example.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#182334] mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassPassword ? 'text' : 'password'}
                        value={passPassword}
                        onChange={(e) => setPassPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassPassword((p) => !p)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-[#22A25A] hover:bg-[#1E834B] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-[#22A25A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
                  >
                    {authLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Log In</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* PASSWORD SIGNUP FORM */
                <form onSubmit={handlePasswordSignup} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#182334] mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={passName}
                        onChange={(e) => setPassName(e.target.value)}
                        placeholder="e.g. Fatima Ali"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#182334] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={passEmail}
                        onChange={(e) => setPassEmail(e.target.value)}
                        placeholder="patient@example.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#182334] mb-1.5">
                      Password (min 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassPassword ? 'text' : 'password'}
                        value={passPassword}
                        onChange={(e) => setPassPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassPassword((p) => !p)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#182334] mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassConfirm ? 'text' : 'password'}
                        value={passConfirm}
                        onChange={(e) => setPassConfirm(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#22A25A] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassConfirm((p) => !p)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-[#22A25A] hover:bg-[#1E834B] text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-[#22A25A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
                  >
                    {authLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Patient Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* DOMAIN AUTHORIZATION GUIDE MODAL */}
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#182334]">
                      How to Authorize Domain in Firebase
                    </h3>
                    <p className="text-xs text-gray-500">
                      Step-by-step instructions for Google OAuth and Email Link sign-ins
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 text-xs text-gray-700">
                  <p className="leading-relaxed">
                    Firebase Authentication requires every domain that uses Google OAuth popups or passwordless email sign-ins to be added to your Firebase project's <strong>Authorized Domains</strong>.
                  </p>

                  <div className="space-y-1">
                    <div className="font-semibold text-[#182334]">Your Current Domain:</div>
                    <div className="bg-white border border-gray-300 rounded-xl p-2.5 flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[#182334] font-semibold truncate select-all">
                        {typeof window !== 'undefined' ? window.location.hostname : ''}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyDomain}
                        className="bg-[#22A25A] hover:bg-[#1E834B] text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedDomain ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Domain</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="font-semibold text-[#182334]">Steps in Firebase Console:</div>
                    <ol className="list-decimal list-inside space-y-1 pl-1 text-gray-600">
                      <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#22A25A] font-bold hover:underline">Firebase Console <ExternalLink className="w-3 h-3 inline" /></a></li>
                      <li>Select your Firebase project</li>
                      <li>In the left sidebar, click <strong>Authentication</strong></li>
                      <li>Select the <strong>Settings</strong> tab at the top</li>
                      <li>Scroll to <strong>Authorized domains</strong> and click <strong>Add domain</strong></li>
                      <li>Paste the copied domain and click <strong>Save</strong></li>
                    </ol>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-500">
                    Email & Password login works immediately without this step.
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(false)}
                    className="bg-[#182334] hover:bg-[#2A3B54] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Close Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Check for confirmed notification banner
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-white text-[#1F2937] pb-20">
      
      {/* Portal Header */}
      <div className="bg-[#22A25A] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 text-white font-bold text-xl flex items-center justify-center border-2 border-white/40 shadow-xs">
              {(patientProfile?.name || auth.currentUser?.displayName || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Welcome, {patientProfile?.name || auth.currentUser?.displayName || 'Patient'}
              </h1>
              <p className="text-xs text-white/90 flex flex-wrap items-center gap-2 mt-0.5">
                <span>Patient ID: {(auth.currentUser?.uid || user.uid).slice(0, 8)}</span>
                <span>•</span>
                <span>Email: {auth.currentUser?.email || user.email}</span>
                <span>•</span>
                <span>Phone: {patientProfile?.phone || 'Not set'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-white/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Confirmed Banner Notification */}
        {confirmedCount > 0 && (
          <div className="bg-[#22A25A] text-white p-4 rounded-2xl shadow-xs border border-[#1E834B] flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Appointment Confirmed!</span> You have{' '}
                <span className="font-bold text-amber-200">{confirmedCount}</span> confirmed appointment(s) at Rafah-E-Aam Medical Center.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="bg-white text-[#22A25A] font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs cursor-pointer"
            >
              View Details
            </button>
          </div>
        )}

        {/* Portal Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl shadow-xs border border-gray-200 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#22A25A] text-white shadow-xs'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('reports');
              fetchPatientReports();
            }}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-[#22A25A] text-white shadow-xs'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Medical Reports ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#22A25A] text-white shadow-xs'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>

        {/* Tab 1: My Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-heading font-bold text-xl text-[#1F2937]">
                Scheduled Appointments
              </h2>
              <button
                onClick={() => {
                  navigate('/doctors');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#D9691F] hover:bg-[#C25B18] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book New Appointment</span>
              </button>
            </div>

            {loadingData ? (
              <div className="bg-white p-8 rounded-2xl text-center text-sm font-medium text-[#6B7280] border border-gray-200">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-2xs border border-gray-200 text-center space-y-4">
                <Calendar className="w-12 h-12 text-[#22A25A]/40 mx-auto" />
                <h3 className="font-bold text-base text-[#1F2937]">No appointments found</h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  You haven't requested any medical appointments yet. Click below to browse departments, select your specialist, and schedule a visit.
                </p>
                <button
                  onClick={() => {
                    navigate('/doctors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#D9691F] hover:bg-[#C25B18] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appt) => {
                  const countdown = getCountdownText(appt.preferredDate);
                  return (
                    <div
                      key={appt.id}
                      className="bg-white p-6 rounded-2xl shadow-2xs border border-gray-200 flex flex-col justify-between space-y-4 relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {getStatusBadge(appt.status)}

                          {countdown && appt.status !== 'cancelled' && (
                            <span className="text-[11px] font-bold text-[#D9691F] bg-[#FBEAE0] px-2 py-0.5 rounded-md border border-[#D9691F]/20">
                              {countdown}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-heading font-bold text-base text-[#1F2937]">
                            {appt.service}
                          </h3>
                          <div className="text-xs text-[#6B7280] font-medium">
                            Doctor: {appt.doctorName || 'Duty Specialist'}
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs border border-gray-100">
                          <div className="flex items-center gap-2 text-[#1F2937] font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#22A25A]" />
                            <span>Date: {appt.preferredDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1F2937] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#22A25A]" />
                            <span>Time Slot: {appt.preferredTime}</span>
                          </div>
                          {appt.reason && (
                            <div className="text-[#6B7280] pt-1 text-[11px]">
                              Reason: {appt.reason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                        <button
                          onClick={() =>
                            shouldUseDeleteAction(appt.status)
                              ? handleDeleteAppointment(appt.id)
                              : handleCancelAppointment(appt.id)
                          }
                          className="text-red-600 hover:text-red-800 font-bold text-xs py-1 px-3 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        >
                          {getAppointmentActionLabel(appt.status)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Medical Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl shadow-2xs border border-gray-200">
              <div>
                <h2 className="font-heading font-bold text-xl text-[#1F2937] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#22A25A]" />
                  <span>My Patient Medical Reports</span>
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  View and download lab test results, diagnostic scans, and medical documents uploaded by Rafah-E-Aam Medical Center.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchPatientReports}
                disabled={loadingReports}
                className="bg-gray-100 hover:bg-gray-200 text-[#1F2937] px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer border border-gray-200 transition-colors shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingReports ? 'animate-spin' : ''}`} />
                <span>Refresh Reports</span>
              </button>
            </div>

            {loadingReports ? (
              <div className="py-12 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#22A25A]" />
                <div className="text-xs font-bold text-[#6B7280]">Retrieving your secure medical reports...</div>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
                <FileText className="w-12 h-12 text-[#22A25A]/40 mx-auto" />
                <div className="text-base font-bold text-[#1F2937]">No Medical Reports On File</div>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  You currently have no medical reports uploaded. When our pathology lab or medical team uploads your diagnostic test results, they will appear here securely.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#22A25A]/40 transition-all shadow-2xs flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-[#1F2937] line-clamp-1">
                              {report.reportName || report.fileName}
                            </h3>
                            <div className="text-[11px] text-[#6B7280] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#22A25A]" />
                              <span>
                                Uploaded on {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {report.fileSize && (
                          <span className="text-[10px] font-bold text-[#22A25A] bg-[#EAF6F0] px-2 py-0.5 rounded-md border border-[#22A25A]/20 shrink-0">
                            {report.fileSize}
                          </span>
                        )}
                      </div>

                      {report.description && (
                        <div className="bg-gray-50 p-3 rounded-xl text-xs text-[#6B7280] border border-gray-100 leading-relaxed">
                          <span className="font-bold text-[#1F2937]">Lab Notes: </span>
                          {report.description}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#6B7280] font-semibold truncate max-w-[150px]">
                        {report.fileName}
                      </span>

                      <div className="flex items-center gap-2">
                        {report.driveUrl || report.fileUrl ? (
                          <button
                            type="button"
                            onClick={() => handleOpenReportWithZipCheck(report)}
                            className="bg-[#22A25A] hover:bg-[#1E834B] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open PDF Link</span>
                          </button>
                        ) : null}

                        {report.fileUrl && (
                          <button
                            type="button"
                            onClick={() => handleOpenReportWithZipCheck(report)}
                            className="bg-gray-100 hover:bg-gray-200 text-[#1F2937] p-1.5 rounded-xl text-xs font-bold border border-gray-200 cursor-pointer transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xs border border-gray-200 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-xl text-[#1F2937]">
              Edit Patient Profile
            </h2>

            {profileSuccessMsg && (
              <div className="p-3 bg-[#EAF6F0] text-[#22A25A] text-xs font-bold rounded-xl border border-[#22A25A]/20">
                {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-[#1F2937]">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-[#1F2937]">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-[#1F2937]">Date of Birth</label>
                  <input
                    type="date"
                    value={profileDob}
                    onChange={(e) => setProfileDob(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-[#1F2937]">Blood Group</label>
                  <select
                    value={profileBloodGroup}
                    onChange={(e) => setProfileBloodGroup(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-[#1F2937]">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={profileEmergencyContact}
                    onChange={(e) => setProfileEmergencyContact(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-[#1F2937]">ZIP Code / Postal Code (For Medical Report Security)</label>
                <input
                  type="text"
                  value={profileZipCode}
                  onChange={(e) => setProfileZipCode(e.target.value)}
                  placeholder="e.g. 75210"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full bg-[#D9691F] hover:bg-[#C25B18] text-white py-3 rounded-xl font-bold text-sm shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
              >
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ZIP Code Security Verification Modal */}
      {zipModalOpen && selectedReportForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-7 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#EAF6F0] text-[#22A25A] rounded-2xl shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F2937]">Verify Security Access Code</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Please enter your Security Access Code, PIN, MR #, or ZIP Code to unlock your medical report.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeZipModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleVerifyZipAndOpenReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2937] mb-1.5">
                    Security Code / PIN / ZIP Code / MR #
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={zipInput}
                    onChange={(e) => {
                      setZipInput(e.target.value);
                      if (zipError) setZipError('');
                    }}
                    placeholder="e.g. MR-2026-0042, 75210, or your access code"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#22A25A]"
                  />
                </div>

                {zipError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{zipError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeZipModal}
                    className="bg-gray-100 hover:bg-gray-200 text-[#1F2937] px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingZip}
                    className="bg-[#22A25A] hover:bg-[#1E834B] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingZip ? 'Verifying...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937]">{confirmModal.title}</h3>
                  <p className="mt-2 text-sm text-[#6B7280]">{confirmModal.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-gray-400 hover:text-gray-600 font-semibold"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-full sm:w-auto flex-1 rounded-xl border border-gray-200 bg-gray-50 text-[#1F2937] py-3 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                disabled={confirmModal.isLoading}
                className="w-full sm:w-auto flex-1 rounded-xl bg-red-600 text-white py-3 text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {confirmModal.isLoading ? 'Processing...' : confirmModal.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
};


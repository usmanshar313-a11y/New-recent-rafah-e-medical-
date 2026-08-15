import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Patient } from '../types';

interface AuthContextType {
  user: User | null;
  patientProfile: Patient | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  sendPasswordlessEmailLink: (email: string) => Promise<void>;
  completePasswordlessEmailSignIn: (email?: string, linkUrl?: string) => Promise<User | null>;
  isPasswordlessEmailLink: (linkUrl?: string) => boolean;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string) => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updatePatientProfile: (updatedData: Partial<Patient>) => Promise<void>;
  refreshPatientProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getConfiguredAppUrl = (): string => {
  const envUrl = (import.meta as any)?.env?.VITE_APP_URL || (import.meta as any)?.env?.VITE_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/$/, '');
  return window.location.origin;
};

const getAuthErrorMessage = (error: any): string => {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
    return 'This app domain is not authorized in Firebase Authentication. Add the current domain in Firebase Console → Authentication → Settings → Authorized domains, then retry.';
  }

  if (code === 'auth/invalid-domain') {
    return 'The current app URL is not valid for Firebase sign-in. Check the deployed domain and Firebase Auth configuration.';
  }

  return message || 'Authentication failed. Please try again.';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrCreatePatient = async (firebaseUser: User, extraData?: Partial<Patient>) => {
    try {
      const patientRef = doc(db, 'patients', firebaseUser.uid);
      const snap = await getDoc(patientRef);

      if (snap.exists()) {
        const data = snap.data() as Patient;
        // Automatically ensure zipCode and patientCode are set
        if (!data.zipCode || !data.patientCode) {
          const updates: Partial<Patient> = {};
          if (!data.zipCode) updates.zipCode = firebaseUser.uid;
          if (!data.patientCode) updates.patientCode = data.mrNumber || firebaseUser.uid;
          await updateDoc(patientRef, updates).catch(() => {
            setDoc(patientRef, updates, { merge: true }).catch(console.error);
          });
          data.zipCode = data.zipCode || firebaseUser.uid;
          data.patientCode = data.patientCode || data.mrNumber || firebaseUser.uid;
        }
        setPatientProfile(data);
      } else {
        const displayName = extraData?.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Patient');
        const newPatient: Patient = {
          uid: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || extraData?.email || '',
          phone: extraData?.phone || firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          zipCode: extraData?.zipCode || firebaseUser.uid,
          patientCode: extraData?.patientCode || firebaseUser.uid,
          createdAt: new Date().toISOString(),
          ...extraData,
        };
        await setDoc(patientRef, newPatient);
        setPatientProfile(newPatient);
      }
    } catch (err) {
      console.error('Error in fetchOrCreatePatient:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreatePatient(currentUser);
      } else {
        setPatientProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // GOOGLE SIGN-IN (Popup)
  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        await fetchOrCreatePatient(res.user, {
          name: res.user.displayName || 'Patient',
          email: res.user.email || '',
          photoURL: res.user.photoURL || '',
        });
        return res.user;
      }
      return null;
    } catch (error: any) {
      const friendlyError = getAuthErrorMessage(error);
      if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('unauthorized-domain')) {
        throw new Error(friendlyError);
      }
      throw error;
    }
  };

  // PASSWORDLESS EMAIL LINK (Send Link)
  const sendPasswordlessEmailLink = async (email: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();
    const appUrl = getConfiguredAppUrl();
    const actionUrl = `${appUrl}/portal`;

    const actionCodeSettings = {
      url: actionUrl,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', cleanEmail);
    } catch (error: any) {
      const friendlyError = getAuthErrorMessage(error);
      if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('unauthorized-domain')) {
        throw new Error(friendlyError);
      }
      throw error;
    }
  };

  // PASSWORDLESS EMAIL LINK (Complete Sign In)
  const completePasswordlessEmailSignIn = async (email?: string, linkUrl?: string): Promise<User | null> => {
    const currentUrl = linkUrl || window.location.href;
    if (!isSignInWithEmailLink(auth, currentUrl)) {
      throw new Error('Invalid sign-in link or link has already been used.');
    }

    let targetEmail = email?.trim().toLowerCase() || window.localStorage.getItem('emailForSignIn');
    if (!targetEmail) {
      throw new Error('EMAIL_REQUIRED_FOR_SIGNIN');
    }

    const res = await signInWithEmailLink(auth, targetEmail, currentUrl);
    window.localStorage.removeItem('emailForSignIn');
    
    if (res.user) {
      await fetchOrCreatePatient(res.user, {
        email: targetEmail,
        name: res.user.displayName || targetEmail.split('@')[0] || 'Patient',
      });
      return res.user;
    }
    return null;
  };

  const isPasswordlessEmailLink = (linkUrl?: string): boolean => {
    return isSignInWithEmailLink(auth, linkUrl || window.location.href);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string = '') => {
    const cleanEmail = email.trim().toLowerCase();
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (res.user) {
      const patientData: Patient = {
        uid: res.user.uid,
        name: name.trim() || 'Patient',
        email: cleanEmail,
        phone: phone.trim(),
        zipCode: res.user.uid,
        patientCode: res.user.uid,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'patients', res.user.uid), patientData);
      setPatientProfile(patientData);
    }
    return res.user;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    if (res.user) {
      await fetchOrCreatePatient(res.user);
    }
    return res.user;
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setPatientProfile(null);
  };

  const updatePatientProfile = async (updatedData: Partial<Patient>) => {
    if (!user) return;
    const patientRef = doc(db, 'patients', user.uid);
    await updateDoc(patientRef, updatedData);
    setPatientProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const refreshPatientProfile = async () => {
    if (user) {
      await fetchOrCreatePatient(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        loading,
        signInWithGoogle,
        sendPasswordlessEmailLink,
        completePasswordlessEmailSignIn,
        isPasswordlessEmailLink,
        signUpWithEmail,
        signInWithEmail,
        logout,
        updatePatientProfile,
        refreshPatientProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

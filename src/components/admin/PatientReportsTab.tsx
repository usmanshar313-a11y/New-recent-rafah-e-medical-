import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Search,
  Download,
  Trash2,
  Eye,
  User,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  RefreshCw,
  ExternalLink,
  Shield,
  Clock,
  Filter,
  Link,
  Key,
  Edit2,
  Copy,
  Check,
  Lock,
} from 'lucide-react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../../firebase';
import { Patient, MedicalReport } from '../../types';

interface PatientReportsTabProps {
  patientsList?: Patient[];
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const PatientReportsTab: React.FC<PatientReportsTabProps> = ({
  patientsList = [],
  showToast,
}) => {
  const [patients, setPatients] = useState<Patient[]>(patientsList);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);

  // Search and Filter States
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [reportSearchQuery, setReportSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'all_reports'>('upload');

  // Modal / Form State for Adding Report Link
  const [selectedPatientForUpload, setSelectedPatientForUpload] = useState<Patient | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Modal / Form State for Editing Patient Security ID / Access Code (ZIP / MR Number)
  const [editingPatientCodeModal, setEditingPatientCodeModal] = useState<Patient | null>(null);
  const [customSecurityCode, setCustomSecurityCode] = useState('');
  const [isSavingSecurityCode, setIsSavingSecurityCode] = useState(false);
  const [securityCodeError, setSecurityCodeError] = useState('');
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Delete modal state
  const [reportToDelete, setReportToDelete] = useState<MedicalReport | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchReports();
  }, []);

  useEffect(() => {
    if (patientsList && patientsList.length > 0) {
      setPatients(patientsList);
    }
  }, [patientsList]);

  useEffect(() => {
    if (!selectedPatientForUpload && !editingPatientCodeModal && !reportToDelete) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPatientForUpload && !isUploading) {
          setSelectedPatientForUpload(null);
          setReportTitle('');
          setDriveUrlInput('');
          setReportDescription('');
          setUploadError('');
        }
        if (editingPatientCodeModal && !isSavingSecurityCode) {
          closeEditSecurityCodeModal();
        }
        if (reportToDelete && !isDeleting) {
          setReportToDelete(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPatientForUpload, editingPatientCodeModal, reportToDelete, isUploading, isSavingSecurityCode, isDeleting]);

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUid(text);
    setTimeout(() => setCopiedUid(null), 2000);
    showToast('Copied to clipboard!', 'success');
  };

  // Open Edit Security ID / Access Code Modal
  const openEditSecurityCodeModal = (patient: Patient) => {
    setEditingPatientCodeModal(patient);
    setCustomSecurityCode(patient.patientCode || patient.zipCode || patient.uid || '');
    setSecurityCodeError('');
  };

  const closeEditSecurityCodeModal = () => {
    if (isSavingSecurityCode) return;
    setEditingPatientCodeModal(null);
    setCustomSecurityCode('');
    setSecurityCodeError('');
  };

  const handleSaveSecurityCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatientCodeModal) return;

    const trimmedCode = customSecurityCode.trim();
    if (!trimmedCode) {
      setSecurityCodeError('Please enter a valid Patient Security Access Code, MR Number, or ZIP Code.');
      return;
    }

    setIsSavingSecurityCode(true);
    setSecurityCodeError('');

    try {
      const patientRef = doc(db, 'patients', editingPatientCodeModal.uid);
      const updatePayload = {
        patientCode: trimmedCode,
        zipCode: trimmedCode,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(patientRef, updatePayload);

      // Update local state instantly
      setPatients((prev) =>
        prev.map((p) =>
          p.uid === editingPatientCodeModal.uid
            ? { ...p, patientCode: trimmedCode, zipCode: trimmedCode, updatedAt: updatePayload.updatedAt }
            : p
        )
      );

      showToast(
        `✅ Security Access Code / ZIP updated to "${trimmedCode}" for ${editingPatientCodeModal.name}`,
        'success'
      );
      setEditingPatientCodeModal(null);
    } catch (err: any) {
      console.error('Error updating patient security access code:', err);
      setSecurityCodeError(err?.message || 'Failed to update patient security code in Firestore.');
    } finally {
      setIsSavingSecurityCode(false);
    }
  };

  // Helper quick generator presets
  const generateMRNumber = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setCustomSecurityCode(`MR-${year}-${rand}`);
  };

  const generatePinCode = () => {
    const rand = Math.floor(10000 + Math.random() * 90000);
    setCustomSecurityCode(rand.toString());
  };

  const resetToAuthUid = () => {
    if (editingPatientCodeModal) {
      setCustomSecurityCode(editingPatientCodeModal.uid);
    }
  };

  // ----------------------------------------------------------------------
  // ALPHABETICAL PATIENT SORTING (A-Z)
  // Demonstrating both approaches requested:
  // Way A: Firestore Query Sorting using query(collection, orderBy("name", "asc"))
  // Way B: Client-Side Sorting using JavaScript .sort() and localeCompare()
  // ----------------------------------------------------------------------
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      // --- WAY A: Firestore Query Sort (orderBy "name") ---
      const patientsRef = collection(db, 'patients');
      const q = query(patientsRef, orderBy('name', 'asc'));

      let snap;
      try {
        snap = await getDocs(q);
      } catch (firestoreSortErr) {
        console.warn('Firestore orderBy("name") failed (e.g. missing index), falling back to unordered collection query:', firestoreSortErr);
        snap = await getDocs(patientsRef);
      }

      const list: Patient[] = [];
      snap.forEach((d) => {
        const data = d.data() as Omit<Patient, 'uid'>;
        list.push({ ...data, uid: d.id });
      });

      // --- WAY B: Client-Side Sorting (JavaScript .sort() with localeCompare) ---
      list.sort((a, b) => {
        const nameA = (a.name || 'Unnamed Patient').trim();
        const nameB = (b.name || 'Unnamed Patient').trim();
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });

      setPatients(list);
    } catch (err) {
      console.error('Error fetching patients for reports tab:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const reportsRef = collection(db, 'reports');
      const snap = await getDocs(reportsRef);
      const list: MedicalReport[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as MedicalReport);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime());
      setReports(list);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const openUploadModal = (patient: Patient) => {
    setSelectedPatientForUpload(patient);
    setReportTitle('');
    setDriveUrlInput('');
    setReportDescription('');
    setUploadError('');
  };

  const closeUploadModal = () => {
    if (isUploading) return;
    setSelectedPatientForUpload(null);
    setReportTitle('');
    setDriveUrlInput('');
    setReportDescription('');
    setUploadError('');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForUpload) return;

    const trimmedTitle = reportTitle.trim();
    const trimmedDriveUrl = driveUrlInput.trim();

    if (!trimmedTitle) {
      setUploadError('Please provide a Report Name (e.g. "Blood Test Results").');
      return;
    }

    if (!trimmedDriveUrl) {
      setUploadError('Please enter a valid Google Drive PDF link.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const patientUid = selectedPatientForUpload.uid;

    try {
      console.log(`[ReportSave] Saving Google Drive report link for ${selectedPatientForUpload.name} (UID: ${patientUid})`);

      // Prepare metadata document for global 'reports' collection in Firestore
      const newReport = {
        patientId: patientUid,
        patientName: selectedPatientForUpload.name || 'Patient',
        patientEmail: selectedPatientForUpload.email || '',
        reportName: trimmedTitle,
        driveUrl: trimmedDriveUrl,
        fileUrl: trimmedDriveUrl,
        fileName: `${trimmedTitle}.pdf`,
        fileSize: 'Google Drive PDF',
        uploadedAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
        uploadedBy: 'admin',
        description: reportDescription.trim() || '',
      };

      console.log('[ReportSave] Writing report document to Firestore reports collection:', newReport);
      await addDoc(collection(db, 'reports'), newReport);

      showToast(`✅ Medical report link saved successfully for ${selectedPatientForUpload.name}`, 'success');
      closeUploadModal();
      fetchReports();
    } catch (err: any) {
      console.error('[ReportSave Fatal Error] Exception during report link save:', err);

      const errorMessage = err?.message || err?.code || 'Failed to save report link.';
      setUploadError(`Save Failed: ${errorMessage}`);
      alert(`⚠️ Medical Report Save Failed:\n\n${errorMessage}\n\nPlease verify your network connectivity or Firestore security rules. Detailed error logged in browser console.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'reports', reportToDelete.id));

      if (reportToDelete.fileUrl && reportToDelete.fileUrl.includes('firebasestorage.googleapis.com')) {
        try {
          const fileRef = ref(storage, reportToDelete.fileUrl);
          await deleteObject(fileRef);
        } catch (storageErr) {
          console.warn('Could not delete storage file or already deleted:', storageErr);
        }
      }

      showToast('✅ Medical report deleted successfully.', 'success');
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
      setReportToDelete(null);
    } catch (err: any) {
      console.error('Error deleting report:', err);
      showToast(`Failed to delete report: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const q = patientSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q)) ||
      (p.uid && p.uid.toLowerCase().includes(q)) ||
      (p.patientCode && p.patientCode.toLowerCase().includes(q)) ||
      (p.zipCode && p.zipCode.toLowerCase().includes(q)) ||
      (p.mrNumber && p.mrNumber.toLowerCase().includes(q))
    );
  });

  const filteredReports = reports.filter((r) => {
    const q = reportSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.reportName && r.reportName.toLowerCase().includes(q)) ||
      (r.patientName && r.patientName.toLowerCase().includes(q)) ||
      (r.fileName && r.fileName.toLowerCase().includes(q)) ||
      (r.patientId && r.patientId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Sub-navigation pill toggle */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-[#0B6B4E] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0B6B4E]" />
            Patient Medical Reports & Security Codes Management
          </h2>
          <p className="text-xs text-emerald-800/70">
            Attach Google Drive PDF links and manage patient Security Access Identifiers (MR Numbers / ZIP codes) in Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F5F1E8] p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('upload')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === 'upload'
                ? 'bg-[#0B6B4E] text-white shadow-xs'
                : 'text-emerald-900 hover:bg-emerald-900/10'
            }`}
          >
            Patients List ({patients.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('all_reports')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === 'all_reports'
                ? 'bg-[#0B6B4E] text-white shadow-xs'
                : 'text-emerald-900 hover:bg-emerald-900/10'
            }`}
          >
            All Reports ({reports.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PATIENTS LIST (A-Z) */}
      {activeSubTab === 'upload' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-[#0B6B4E]">
                Patient Accounts & Security Access Codes
              </h3>
              <p className="text-xs text-emerald-800/70">
                Manage patient report links and edit their custom Security Access Code / ZIP code used to unlock PDF reports.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, email, UID, MR #, Security Code..."
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F5F1E8] border border-emerald-900/20 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
              />
            </div>
          </div>

          {loadingPatients ? (
            <div className="py-12 text-center text-xs font-bold text-emerald-800 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0B6B4E]" />
              <span>Fetching patient records from Firestore...</span>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-8 text-center bg-[#F5F1E8]/50 rounded-2xl border border-dashed border-emerald-900/20 space-y-2">
              <User className="w-10 h-10 text-emerald-700/40 mx-auto" />
              <div className="text-sm font-bold text-[#0B6B4E]">No patients found</div>
              <p className="text-xs text-emerald-800/70">
                {patientSearchQuery
                  ? 'No patient matched your search criteria.'
                  : 'No registered patient records available in the database yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-emerald-900/10 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B6B4E] text-white text-xs font-bold">
                    <th className="p-3.5">Patient Name (A-Z)</th>
                    <th className="p-3.5">Security Code / Access PIN</th>
                    <th className="p-3.5">Auth UID (Doc ID)</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Blood Group & DOB</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10 text-xs font-medium">
                  {filteredPatients.map((patient) => {
                    const patientReportsCount = reports.filter((r) => r.patientId === patient.uid).length;
                    const displayCode = patient.patientCode || patient.zipCode || patient.uid;
                    const isCustomCode = Boolean(patient.patientCode || (patient.zipCode && patient.zipCode !== patient.uid));

                    return (
                      <tr key={patient.uid} className="hover:bg-[#F5F1E8]/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#0B6B4E] text-sm flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B6B4E] font-bold text-xs flex items-center justify-center shrink-0">
                              {(patient.name || 'P').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div>{patient.name || 'Unnamed Patient'}</div>
                              {patientReportsCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
                                  <FileCheck className="w-3 h-3 text-[#0B6B4E]" />
                                  {patientReportsCount} Report(s) Linked
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Security Access Code / ZIP / MR Number */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono border ${
                                isCustomCode
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              }`}
                              title={isCustomCode ? 'Custom Security Access PIN / MR ID' : 'Default Auth UID'}
                            >
                              <Key className="w-3 h-3 text-[#0B6B4E]" />
                              <span>{displayCode}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => openEditSecurityCodeModal(patient)}
                              className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 cursor-pointer transition-colors"
                              title="Edit Patient Security Code / Access PIN"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[10px] text-emerald-800/70 mt-0.5">
                            {isCustomCode ? 'Custom Access Code' : 'Default (Auth UID)'}
                          </div>
                        </td>

                        {/* Firebase Auth UID with Copy Button */}
                        <td className="p-3.5 font-mono text-[11px] text-emerald-900/80">
                          <div className="flex items-center gap-1">
                            <span className="bg-[#F5F1E8] px-2 py-1 rounded-md border border-emerald-900/10 select-all font-semibold max-w-[140px] truncate block" title={patient.uid}>
                              {patient.uid}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(patient.uid)}
                              className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 cursor-pointer transition-colors"
                              title="Copy Firebase Auth UID"
                            >
                              {copiedUid === patient.uid ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="p-3.5 space-y-0.5">
                          <div className="text-emerald-900">{patient.email || 'No email'}</div>
                          <div className="text-emerald-900/70 text-[11px]">{patient.phone || 'No phone'}</div>
                        </td>

                        <td className="p-3.5 space-y-0.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-700">Blood: </span>
                            <span className="font-bold text-[#D64545]">{patient.bloodGroup || 'N/A'}</span>
                          </div>
                          <div className="text-emerald-900/70 text-[11px]">
                            DOB: {patient.dob || 'Not provided'}
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditSecurityCodeModal(patient)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                              title="Edit Patient Security ID / PIN Code"
                            >
                              <Key className="w-3 h-3 text-amber-700" />
                              <span className="hidden xl:inline">Edit ID</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openUploadModal(patient)}
                              className="bg-[#0B6B4E] hover:bg-[#08523c] text-white px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                            >
                              <Link className="w-3.5 h-3.5" />
                              <span>Add Link</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ALL REPORTS */}
      {activeSubTab === 'all_reports' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-[#0B6B4E]">
                Patient Medical Reports Repository
              </h3>
              <p className="text-xs text-emerald-800/70">
                All patient report links stored in Cloud Firestore.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by report title or patient..."
                  value={reportSearchQuery}
                  onChange={(e) => setReportSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#F5F1E8] border border-emerald-900/20 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>

              <button
                type="button"
                onClick={fetchReports}
                disabled={loadingReports}
                className="bg-[#F5F1E8] hover:bg-emerald-100 text-[#0B6B4E] p-2 rounded-xl border border-emerald-900/20 cursor-pointer"
                title="Refresh Reports List"
              >
                <RefreshCw className={`w-4 h-4 ${loadingReports ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loadingReports ? (
            <div className="py-12 text-center text-xs font-bold text-emerald-800 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0B6B4E]" />
              <span>Fetching report records from database...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center bg-[#F5F1E8]/50 rounded-2xl border border-dashed border-emerald-900/20 space-y-3">
              <FileText className="w-12 h-12 text-emerald-700/40 mx-auto" />
              <div className="text-base font-bold text-[#0B6B4E]">No medical reports linked yet</div>
              <p className="text-xs text-emerald-800/70 max-w-md mx-auto">
                {reportSearchQuery
                  ? 'No reports matched your search query.'
                  : 'When you add Google Drive report links for patients, they will be listed here.'}
              </p>
              {!reportSearchQuery && (
                <button
                  type="button"
                  onClick={() => setActiveSubTab('upload')}
                  className="bg-[#0B6B4E] hover:bg-[#08523c] text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>Go to Patients List to Add Links</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto border border-emerald-900/10 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B6B4E] text-white text-xs font-bold">
                    <th className="p-3.5">Report Title</th>
                    <th className="p-3.5">Patient Name & UID</th>
                    <th className="p-3.5">Google Drive URL</th>
                    <th className="p-3.5">Date Created</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10 text-xs font-medium">
                  {filteredReports.map((report) => {
                    const targetUrl = report.driveUrl || report.fileUrl || '#';
                    return (
                      <tr key={report.id} className="hover:bg-[#F5F1E8]/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#0B6B4E] text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{report.reportName || report.fileName || 'Medical Report'}</span>
                          </div>
                          {report.description && (
                            <div className="text-[11px] text-emerald-800/70 italic mt-0.5 line-clamp-1">
                              {report.description}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-emerald-950">{report.patientName || 'Patient'}</div>
                          <div className="font-mono text-[10px] text-emerald-800/70 select-all">
                            UID: {report.patientId}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline font-mono text-[11px] truncate block max-w-[220px]"
                            title={targetUrl}
                          >
                            {targetUrl}
                          </a>
                        </td>

                        <td className="p-3.5 text-emerald-900 text-[11px]">
                          <div className="flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3 text-emerald-700" />
                            {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-100 hover:bg-emerald-200 text-[#0B6B4E] p-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="Open PDF Link in New Window"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Open Drive Link</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => setReportToDelete(report)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="Delete Medical Report"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EDIT PATIENT SECURITY ID / ACCESS CODE (ZIP / MR NUMBER) MODAL */}
      {editingPatientCodeModal && (
        <div 
          onClick={closeEditSecurityCodeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-emerald-900/10 overflow-hidden animate-in zoom-in-95"
          >
            <div className="bg-[#0B6B4E] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base">Edit Patient Security Access Code</h3>
                  <p className="text-xs text-emerald-200">
                    Patient: <strong className="text-white">{editingPatientCodeModal.name || 'Unnamed Patient'}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEditSecurityCodeModal}
                disabled={isSavingSecurityCode}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSecurityCode} className="p-6 space-y-4">
              <div className="p-3 bg-[#F5F1E8] rounded-xl text-xs space-y-1.5 border border-emerald-900/10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B6B4E]">Patient Email:</span>
                  <span className="text-emerald-950 font-medium">{editingPatientCodeModal.email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0B6B4E]">Auth UID (Immutable):</span>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-900/10 select-all font-bold">
                    {editingPatientCodeModal.uid}
                  </span>
                </div>
              </div>

              {securityCodeError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{securityCodeError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Custom Security ID / Access PIN / ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  disabled={isSavingSecurityCode}
                  placeholder="e.g. MR-2026-0042, 75210, or SEC-9912"
                  value={customSecurityCode}
                  onChange={(e) => setCustomSecurityCode(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2.5 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
                <p className="text-[11px] text-emerald-800/80 mt-1 leading-relaxed">
                  🔒 This security identifier / PIN is used by the patient to unlock and view their medical reports in the Patient Portal. Updating this changes the access key in Firestore without altering the underlying Firebase Auth credentials.
                </p>
              </div>

              {/* Quick generator buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Quick Presets:</span>
                <button
                  type="button"
                  onClick={generateMRNumber}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Generate MR #
                </button>
                <button
                  type="button"
                  onClick={generatePinCode}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Generate 5-Digit PIN
                </button>
                <button
                  type="button"
                  onClick={resetToAuthUid}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Reset to UID
                </button>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-emerald-900/10">
                <button
                  type="button"
                  onClick={closeEditSecurityCodeModal}
                  disabled={isSavingSecurityCode}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSecurityCode}
                  className="px-5 py-2 bg-[#0B6B4E] hover:bg-[#08523c] disabled:bg-gray-400 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors inline-flex items-center gap-1.5 disabled:cursor-not-allowed"
                >
                  {isSavingSecurityCode ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Code...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Save Security Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD REPORT LINK MODAL */}
      {selectedPatientForUpload && (
        <div 
          onClick={closeUploadModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-emerald-900/10 overflow-hidden animate-in zoom-in-95"
          >
            <div className="bg-[#0B6B4E] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Link className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base">Add Medical Report Link</h3>
                  <p className="text-xs text-emerald-200">
                    For Patient: <strong className="text-white">{selectedPatientForUpload.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={isUploading}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-[#F5F1E8] rounded-xl text-xs space-y-1 border border-emerald-900/10">
                <div className="flex items-center justify-between font-bold text-[#0B6B4E]">
                  <span>Target Patient Auth UID:</span>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-900/10 select-all font-bold">
                    {selectedPatientForUpload.uid}
                  </span>
                </div>
                <div className="text-emerald-900/70 text-[11px]">
                  Patient Email: {selectedPatientForUpload.email || 'N/A'}
                </div>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Report Title / Test Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={isUploading}
                  placeholder="e.g. Complete Blood Count (CBC) Lab Test"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Google Drive PDF Share Link *
                </label>
                <input
                  type="url"
                  required
                  disabled={isUploading}
                  placeholder="https://drive.google.com/file/d/12345/view?usp=sharing"
                  value={driveUrlInput}
                  onChange={(e) => setDriveUrlInput(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
                <p className="text-[10px] text-emerald-700 mt-1">
                  Paste the public or viewable Google Drive shareable link for the PDF report.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Additional Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  disabled={isUploading}
                  placeholder="e.g. Conducted by Pathology Dept. All values within normal reference range."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-emerald-900/10">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={isUploading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#0B6B4E] hover:bg-[#08523c] disabled:bg-gray-400 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors inline-flex items-center gap-1.5 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Report...</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-3.5 h-3.5" />
                      <span>Save Report Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {reportToDelete && (
        <div 
          onClick={() => {
            if (!isDeleting) setReportToDelete(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-emerald-900/10 space-y-4"
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-gray-900">Delete Medical Report</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-red-50 p-3 rounded-xl border border-red-200">
              Are you sure you want to delete <strong className="text-red-900">{reportToDelete.reportName || reportToDelete.fileName}</strong> for patient <strong className="text-red-900">{reportToDelete.patientName}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReport}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors inline-flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
} from 'lucide-react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
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

  // Modal / Form State
  const [selectedPatientForUpload, setSelectedPatientForUpload] = useState<Patient | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [driveUrlInput, setDriveUrlInput] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [reportDescription, setReportDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openUploadModal = (patient: Patient) => {
    setSelectedPatientForUpload(patient);
    setUploadFile(null);
    setReportTitle('');
    setDriveUrlInput('');
    setReportDescription('');
    setUploadError('');
    setUploadProgress(null);
  };

  const closeUploadModal = () => {
    if (isUploading) return;
    setSelectedPatientForUpload(null);
    setUploadFile(null);
    setReportTitle('');
    setDriveUrlInput('');
    setReportDescription('');
    setUploadError('');
    setUploadProgress(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setUploadError('Please select a valid PDF file (.pdf).');
        setUploadFile(null);
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setUploadError('File size exceeds the 20MB limit.');
        setUploadFile(null);
        return;
      }
      setUploadError('');
      setUploadFile(file);
      if (!reportTitle) {
        const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
        setReportTitle(cleanName);
      }
    }
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

    if (!trimmedDriveUrl && !uploadFile) {
      setUploadError('Please enter a Google Drive PDF Link OR select a PDF file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    const patientUid = selectedPatientForUpload.uid;

    try {
      console.log(`[ReportSave] Processing report for ${selectedPatientForUpload.name} (UID: ${patientUid})`);
      let finalFileUrl = trimmedDriveUrl;
      let finalFileSize = 'Google Drive PDF';

      // If a local PDF file was selected, upload it to Cloud Storage
      if (uploadFile) {
        const sanitizedFileName = `${Date.now()}_${uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storagePath = `patients/${patientUid}/reports/${sanitizedFileName}`;
        const storageRef = ref(storage, storagePath);

        try {
          finalFileUrl = await new Promise<string>((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, uploadFile);

            uploadTask.on(
              'state_changed',
              (snapshot) => {
                if (snapshot.totalBytes > 0) {
                  const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  setUploadProgress(progress);
                }
              },
              (error) => {
                console.error('[ReportSave Error] Storage upload failed:', error);
                reject(error);
              },
              async () => {
                try {
                  const url = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(url);
                } catch (urlErr) {
                  reject(urlErr);
                }
              }
            );
          });
          finalFileSize = formatFileSize(uploadFile.size);
        } catch (storageErr: any) {
          console.warn('[ReportSave] Cloud Storage upload fallback to Base64/Drive URL:', storageErr);
          if (!trimmedDriveUrl && uploadFile.size <= 5 * 1024 * 1024) {
            finalFileUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (e) => reject(e);
              reader.readAsDataURL(uploadFile);
            });
          } else if (trimmedDriveUrl) {
            finalFileUrl = trimmedDriveUrl;
          } else {
            throw storageErr;
          }
        }
      }

      // Prepare metadata document for global 'reports' collection in Firestore
      const newReport = {
        patientId: patientUid,
        patientName: selectedPatientForUpload.name || 'Patient',
        patientEmail: selectedPatientForUpload.email || '',
        reportName: trimmedTitle,
        driveUrl: trimmedDriveUrl || finalFileUrl,
        fileUrl: finalFileUrl || trimmedDriveUrl,
        fileName: uploadFile ? uploadFile.name : `${trimmedTitle}.pdf`,
        fileSize: finalFileSize,
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
      setUploadProgress(null);
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
      (p.uid && p.uid.toLowerCase().includes(q))
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
            Patient Medical Reports Management
          </h2>
          <p className="text-xs text-emerald-800/70">
            Attach Google Drive PDF links or upload lab test results to patient accounts securely in Firestore.
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
                Select Patient to Add Report Link
              </h3>
              <p className="text-xs text-emerald-800/70">
                Patients are sorted alphabetically (A-Z). Click "Add Report Link" next to any patient to attach a Google Drive PDF link.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient name, email, UID..."
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
                    <th className="p-3.5">Firestore Document ID (Auth UID)</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Blood Group & DOB</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/10 text-xs font-medium">
                  {filteredPatients.map((patient) => {
                    const patientReportsCount = reports.filter((r) => r.patientId === patient.uid).length;
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

                        <td className="p-3.5 font-mono text-[11px] text-emerald-900/80">
                          <span className="bg-[#F5F1E8] px-2 py-1 rounded-md border border-emerald-900/10 select-all font-semibold">
                            {patient.uid}
                          </span>
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
                          <button
                            type="button"
                            onClick={() => openUploadModal(patient)}
                            className="bg-[#0B6B4E] hover:bg-[#08523c] text-white px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                          >
                            <Link className="w-3.5 h-3.5" />
                            <span>Add Report Link</span>
                          </button>
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

      {/* ADD REPORT LINK MODAL */}
      {selectedPatientForUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-emerald-900/10 overflow-hidden animate-in zoom-in-95">
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

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-emerald-900/10"></div>
                <span className="flex-shrink mx-2 text-[10px] font-bold text-emerald-800/60 uppercase">OR Upload PDF File</span>
                <div className="flex-grow border-t border-emerald-900/10"></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Attach PDF File (Optional)
                </label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={isUploading}
                  onChange={handleFileChange}
                  className="w-full text-xs text-emerald-900 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0B6B4E] file:text-white hover:file:bg-[#08523c] file:cursor-pointer bg-[#F5F1E8] p-2 rounded-xl border border-emerald-900/20"
                />
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

              {isUploading && uploadProgress !== null && uploadProgress > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-[#0B6B4E]">
                    <span>Uploading PDF attachment...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#0B6B4E] h-2.5 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-emerald-900/10 space-y-4">
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

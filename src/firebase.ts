import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const appExists = getApps().length > 0;
const app = appExists ? getApp() : initializeApp(firebaseConfig);

const dbId = config.firestoreDatabaseId || '(default)';

let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    dbId
  );
} catch (e) {
  try {
    firestoreDb = initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      dbId
    );
  } catch (err) {
    firestoreDb = getFirestore(app, dbId);
  }
}

export const db = firestoreDb;
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

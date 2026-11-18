import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  type Auth,
  connectAuthEmulator,
} from 'firebase/auth'

let app: FirebaseApp | undefined
let auth: Auth | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(
      {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      },
      'lena-app',
    )
    if (
      process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true' &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
    ) {
      connectAuthEmulator(
        getAuth(app),
        `http://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`,
      )
    }
  }
  return app
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}

// Backwards-compatible singletons (lazily initialized on first access)
export const firebaseApp = (() => {
  if (typeof window === 'undefined' && !getApps().length) return null as unknown as FirebaseApp
  if (getApps().length > 0) return getApps()[0]
  return getFirebaseApp()
})()
export function getClientFirebaseAuth(): Auth {
  if (typeof window === 'undefined') return null as unknown as Auth
  return getFirebaseAuth()
}
export const firebaseAuth = getClientFirebaseAuth()

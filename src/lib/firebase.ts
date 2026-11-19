import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  type Auth,
  connectAuthEmulator,
} from 'firebase/auth'

let app: FirebaseApp | undefined
let auth: Auth | undefined

/**
 * Firebase is optional at runtime: the public marketing pages must render even
 * when no NEXT_PUBLIC_FIREBASE_* credentials are present (local preview, static
 * export). Auth calls fail loudly only when actually used.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  )
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_APP_ID to .env.local.',
    )
  }
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

// Backwards-compatible singletons (lazily initialized on first access).
// Null when Firebase is not configured, so public pages render without creds.
export const firebaseApp: FirebaseApp | null = (() => {
  if (typeof window === 'undefined') return null
  if (!isFirebaseConfigured()) return null
  if (getApps().length > 0) return getApps()[0] ?? null
  try {
    return getFirebaseApp()
  } catch {
    return null
  }
})()
export function getClientFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null
  if (!firebaseApp) return null
  return getFirebaseAuth()
}
export const firebaseAuth = getClientFirebaseAuth()

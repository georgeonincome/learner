import {
  getApps,
  initializeApp,
  cert,
  type App,
} from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'

let adminApp: App | undefined
let adminAuth: Auth | undefined

export function getFirebaseAdminApp(): App {
  if (!adminApp) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n',
    )

    if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp(
        {
          credential: cert({ projectId, clientEmail, privateKey }),
          projectId,
        },
        'lena-admin',
      )
    } else {
      // Fallback: default credentials (emulator / local dev without explicit SA)
      adminApp = initializeApp({}, 'lena-admin')
    }
  }
  return adminApp
}

export function getFirebaseAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getFirebaseAdminApp())
  }
  return adminAuth
}

export const firebaseAdminApp = (() => {
  const existing = getApps().find((a) => a.name === 'lena-admin')
  if (existing) return existing
  return getFirebaseAdminApp()
})()
export const firebaseAdminAuth = getAuth(firebaseAdminApp)

export const SESSION_COOKIE_NAME = 'lena_session'
export const SESSION_COOKIE_MAX_AGE = 5 * 24 * 60 * 60 // 5 days

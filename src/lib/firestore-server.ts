import {
  getFirestore,
  type Firestore,
} from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'

let db: Firestore | undefined

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseAdminApp())
  }
  return db
}

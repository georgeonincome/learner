/**
 * Lightweight in-memory community store used for the local/demo build.
 * In production this maps to the Firestore `communityGroups` hierarchy
 * (see firestore.rules). Kept on globalThis so it survives module reloads
 * during development. Group data mirrors the captured reference UI.
 */

export interface CommunityComment {
  id: string
  authorId: string
  authorName: string
  body: string
  createdAt: string
}

export interface CommunityPost {
  id: string
  groupId: string
  channel: string
  authorId: string
  authorName: string
  title: string
  body: string
  createdAt: string
  likes: string[]
  comments: CommunityComment[]
}

export interface CommunityGroup {
  id: string
  name: string
  tagline: string
  description: string
  price?: string
  memberCount: number
  channelCount: number
  postCount: number
  channels: string[]
  posts: CommunityPost[]
}

interface CommunityStore {
  groups: CommunityGroup[]
}

const seedGroups: CommunityGroup[] = [
  {
    id: '834',
    name: 'SavvyPro Starter Chatgroup',
    tagline: 'Discover ways to earn through online gigs',
    description: "Discover ways to earn through online gigs. Ask questions, share wins, and learn alongside other members.",
    memberCount: 1505,
    channelCount: 3,
    postCount: 82,
    channels: ['General', 'Ask a Question', 'Affiliates'],
    posts: [],
  },
  {
    id: '853',
    name: 'Content Creation School Chatgroup',
    tagline: 'Let’s discuss Freelancing',
    description: "A community for Content Creation School students to discuss freelancing and digital skills.",
    price: '$67 / one time',
    memberCount: 0,
    channelCount: 1,
    postCount: 108,
    channels: ['General'],
    posts: [],
  },
  {
    id: '650',
    name: 'VIP',
    tagline: 'By invitation only.',
    description: 'By invitation only. A private space for VIP members.',
    price: '$250 / one time',
    memberCount: 0,
    channelCount: 1,
    postCount: 6,
    channels: ['General'],
    posts: [],
  },
  {
    id: '4943',
    name: 'Digital Skills Bundle Forum',
    tagline: 'Digital Skills Bundle Forum',
    description: 'Discuss the Digital Skills Bundle with other learners.',
    memberCount: 1,
    channelCount: 1,
    postCount: 0,
    channels: ['General'],
    posts: [],
  },
  {
    id: '4944',
    name: 'Digital Skills Bundle Forum',
    tagline: 'Digital Skills Bundle Forum',
    description: 'Discuss the Digital Skills Bundle with other learners.',
    memberCount: 0,
    channelCount: 1,
    postCount: 0,
    channels: ['General'],
    posts: [],
  },
]

const globalStore = globalThis as unknown as { __communityStore?: CommunityStore }

export const communityStore: CommunityStore =
  globalStore.__communityStore ??
  (globalStore.__communityStore = { groups: seedGroups })

export function findGroup(groupId: string) {
  return communityStore.groups.find((g) => g.id === groupId)
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

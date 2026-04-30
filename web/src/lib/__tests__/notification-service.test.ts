import { notifyUsersOfUnreadMessages } from '@/lib/notification-service'

const now = new Date('2026-04-29T12:00:00.000Z')

const makeDateMinutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60 * 1000)
const makeDateDaysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

const dbState = {
  users: [] as any[],
  messagesByRoom: new Map<string, { created_at: Date; sender_id: string }[]>(),
}

jest.mock('@/lib/db', () => {
  return {
    __esModule: true,
    default: {
      user: {
        findMany: jest.fn(async (args: any) => {
          const where = args?.where || {}

          return dbState.users.filter((u) => {
            if (where.email_notifications_enabled !== undefined) {
              if (u.email_notifications_enabled !== where.email_notifications_enabled) return false
            }

            if (where.last_active_at?.lt) {
              if (!(u.last_active_at < where.last_active_at.lt)) return false
            }

            if (where.OR?.length) {
              const ok = where.OR.some((c: any) => {
                if (c.last_email_notification_at === null) return u.last_email_notification_at == null
                if (c.last_email_notification_at?.lt) {
                  return u.last_email_notification_at != null && u.last_email_notification_at < c.last_email_notification_at.lt
                }
                return false
              })
              if (!ok) return false
            }

            return true
          })
        }),
        update: jest.fn(async (args: any) => {
          const u = dbState.users.find((x) => x.id === args.where.id)
          if (u && args.data?.last_email_notification_at) {
            u.last_email_notification_at = args.data.last_email_notification_at
          }
          return u
        }),
      },
      message: {
        findMany: jest.fn(async (args: any) => {
          const roomId = args?.where?.room_id
          const senderNot = args?.where?.sender_id?.not
          const createdAt = args?.where?.created_at || {}

          const all = dbState.messagesByRoom.get(roomId) || []
          const filtered = all.filter((m) => {
            if (senderNot && m.sender_id === senderNot) return false
            if (createdAt.gt && !(m.created_at > createdAt.gt)) return false
            if (createdAt.lte && !(m.created_at <= createdAt.lte)) return false
            return true
          })

          filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
          return filtered.map((m) => ({ created_at: m.created_at }))
        }),
      },
      notificationLog: {
        create: jest.fn(async () => ({ id: 'log' })),
      },
    },
  }
})

jest.mock('@/lib/email', () => {
  return {
    __esModule: true,
    sendEmail: jest.fn(async () => ({ success: true, messageId: 'msg' })),
  }
})

describe('notifyUsersOfUnreadMessages', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(now)
    jest.clearAllMocks()
    dbState.users = []
    dbState.messagesByRoom = new Map()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('sends email for offline user when there are unread messages older than 10 minutes', async () => {
    const userId = 'u1'
    const roomId = 'r1'

    dbState.users.push({
      id: userId,
      email: 'u1@example.com',
      full_name: 'U1',
      preferred_language: 'ru',
      email_notifications_enabled: true,
      last_active_at: makeDateMinutesAgo(3),
      last_email_notification_at: null,
      room_participations: [
        {
          room_id: roomId,
          last_read_at: makeDateDaysAgo(1),
          room: { name: 'Room 1' },
        },
      ],
    })

    dbState.messagesByRoom.set(roomId, [
      { created_at: makeDateMinutesAgo(11), sender_id: 'u2' },
    ])

    await notifyUsersOfUnreadMessages()

    const { sendEmail } = await import('@/lib/email')
    expect(sendEmail).toHaveBeenCalledTimes(1)
  })

  it('does not send email when unread messages are newer than 10 minutes', async () => {
    const userId = 'u1'
    const roomId = 'r1'

    dbState.users.push({
      id: userId,
      email: 'u1@example.com',
      full_name: 'U1',
      preferred_language: 'ru',
      email_notifications_enabled: true,
      last_active_at: makeDateMinutesAgo(3),
      last_email_notification_at: null,
      room_participations: [
        {
          room_id: roomId,
          last_read_at: makeDateDaysAgo(1),
          room: { name: 'Room 1' },
        },
      ],
    })

    dbState.messagesByRoom.set(roomId, [
      { created_at: makeDateMinutesAgo(5), sender_id: 'u2' },
    ])

    await notifyUsersOfUnreadMessages()

    const { sendEmail } = await import('@/lib/email')
    expect(sendEmail).toHaveBeenCalledTimes(0)
  })

  it('does not send email when user is online', async () => {
    const userId = 'u1'
    const roomId = 'r1'

    dbState.users.push({
      id: userId,
      email: 'u1@example.com',
      full_name: 'U1',
      preferred_language: 'ru',
      email_notifications_enabled: true,
      last_active_at: makeDateMinutesAgo(1),
      last_email_notification_at: null,
      room_participations: [
        {
          room_id: roomId,
          last_read_at: makeDateDaysAgo(1),
          room: { name: 'Room 1' },
        },
      ],
    })

    dbState.messagesByRoom.set(roomId, [
      { created_at: makeDateMinutesAgo(20), sender_id: 'u2' },
    ])

    await notifyUsersOfUnreadMessages()

    const { sendEmail } = await import('@/lib/email')
    expect(sendEmail).toHaveBeenCalledTimes(0)
  })
})

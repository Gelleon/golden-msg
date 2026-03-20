
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  full_name: 'full_name',
  avatar_url: 'avatar_url',
  role: 'role',
  preferred_language: 'preferred_language',
  password_hash: 'password_hash',
  created_at: 'created_at',
  email_notifications_enabled: 'email_notifications_enabled',
  push_notifications_enabled: 'push_notifications_enabled',
  last_email_notification_at: 'last_email_notification_at',
  last_push_notification_at: 'last_push_notification_at',
  last_password_reset_at: 'last_password_reset_at'
};

exports.Prisma.PushSubscriptionScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  endpoint: 'endpoint',
  p256dh: 'p256dh',
  auth: 'auth',
  created_at: 'created_at'
};

exports.Prisma.PasswordResetTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  user_id: 'user_id',
  expires_at: 'expires_at',
  created_at: 'created_at'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  ip_address: 'ip_address',
  action: 'action',
  details: 'details',
  created_at: 'created_at'
};

exports.Prisma.RoomScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  capacity: 'capacity',
  equipment: 'equipment',
  type: 'type',
  created_by: 'created_by',
  room_id: 'room_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RoomParticipantScalarFieldEnum = {
  id: 'id',
  room_id: 'room_id',
  user_id: 'user_id',
  role: 'role',
  joined_at: 'joined_at',
  last_read_at: 'last_read_at',
  last_active_at: 'last_active_at',
  typing_at: 'typing_at'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  room_id: 'room_id',
  sender_id: 'sender_id',
  content: 'content',
  content_translated: 'content_translated',
  language_original: 'language_original',
  message_type: 'message_type',
  file_url: 'file_url',
  voice_transcription: 'voice_transcription',
  created_at: 'created_at',
  is_edited: 'is_edited',
  reply_to_id: 'reply_to_id',
  translation_status: 'translation_status',
  translation_error: 'translation_error',
  is_pinned: 'is_pinned',
  is_important: 'is_important'
};

exports.Prisma.FileDeletionLogScalarFieldEnum = {
  id: 'id',
  message_id: 'message_id',
  room_id: 'room_id',
  file_url: 'file_url',
  backup_path: 'backup_path',
  deleted_at: 'deleted_at',
  expires_at: 'expires_at'
};

exports.Prisma.RoomInviteScalarFieldEnum = {
  id: 'id',
  token: 'token',
  room_id: 'room_id',
  created_by: 'created_by',
  role: 'role',
  expires_at: 'expires_at',
  max_uses: 'max_uses',
  uses: 'uses',
  created_at: 'created_at'
};

exports.Prisma.NotificationLogScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  email: 'email',
  type: 'type',
  status: 'status',
  error: 'error',
  sent_at: 'sent_at',
  metadata: 'metadata'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  PushSubscription: 'PushSubscription',
  PasswordResetToken: 'PasswordResetToken',
  AuditLog: 'AuditLog',
  Room: 'Room',
  RoomParticipant: 'RoomParticipant',
  Message: 'Message',
  FileDeletionLog: 'FileDeletionLog',
  RoomInvite: 'RoomInvite',
  NotificationLog: 'NotificationLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

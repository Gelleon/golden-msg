
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PushSubscription
 * 
 */
export type PushSubscription = $Result.DefaultSelection<Prisma.$PushSubscriptionPayload>
/**
 * Model PasswordResetToken
 * 
 */
export type PasswordResetToken = $Result.DefaultSelection<Prisma.$PasswordResetTokenPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model Room
 * 
 */
export type Room = $Result.DefaultSelection<Prisma.$RoomPayload>
/**
 * Model RoomParticipant
 * 
 */
export type RoomParticipant = $Result.DefaultSelection<Prisma.$RoomParticipantPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model RoomInvite
 * 
 */
export type RoomInvite = $Result.DefaultSelection<Prisma.$RoomInvitePayload>
/**
 * Model NotificationLog
 * 
 */
export type NotificationLog = $Result.DefaultSelection<Prisma.$NotificationLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.pushSubscription`: Exposes CRUD operations for the **PushSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PushSubscriptions
    * const pushSubscriptions = await prisma.pushSubscription.findMany()
    * ```
    */
  get pushSubscription(): Prisma.PushSubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetTokens
    * const passwordResetTokens = await prisma.passwordResetToken.findMany()
    * ```
    */
  get passwordResetToken(): Prisma.PasswordResetTokenDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;

  /**
   * `prisma.room`: Exposes CRUD operations for the **Room** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rooms
    * const rooms = await prisma.room.findMany()
    * ```
    */
  get room(): Prisma.RoomDelegate<ExtArgs>;

  /**
   * `prisma.roomParticipant`: Exposes CRUD operations for the **RoomParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoomParticipants
    * const roomParticipants = await prisma.roomParticipant.findMany()
    * ```
    */
  get roomParticipant(): Prisma.RoomParticipantDelegate<ExtArgs>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs>;

  /**
   * `prisma.roomInvite`: Exposes CRUD operations for the **RoomInvite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoomInvites
    * const roomInvites = await prisma.roomInvite.findMany()
    * ```
    */
  get roomInvite(): Prisma.RoomInviteDelegate<ExtArgs>;

  /**
   * `prisma.notificationLog`: Exposes CRUD operations for the **NotificationLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationLogs
    * const notificationLogs = await prisma.notificationLog.findMany()
    * ```
    */
  get notificationLog(): Prisma.NotificationLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PushSubscription: 'PushSubscription',
    PasswordResetToken: 'PasswordResetToken',
    AuditLog: 'AuditLog',
    Room: 'Room',
    RoomParticipant: 'RoomParticipant',
    Message: 'Message',
    RoomInvite: 'RoomInvite',
    NotificationLog: 'NotificationLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "pushSubscription" | "passwordResetToken" | "auditLog" | "room" | "roomParticipant" | "message" | "roomInvite" | "notificationLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PushSubscription: {
        payload: Prisma.$PushSubscriptionPayload<ExtArgs>
        fields: Prisma.PushSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PushSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PushSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.PushSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PushSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          findMany: {
            args: Prisma.PushSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>[]
          }
          create: {
            args: Prisma.PushSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          createMany: {
            args: Prisma.PushSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PushSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.PushSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          update: {
            args: Prisma.PushSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.PushSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PushSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PushSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PushSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.PushSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePushSubscription>
          }
          groupBy: {
            args: Prisma.PushSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PushSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PushSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<PushSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetToken: {
        payload: Prisma.$PasswordResetTokenPayload<ExtArgs>
        fields: Prisma.PasswordResetTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findMany: {
            args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          create: {
            args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          createMany: {
            args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          update: {
            args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetToken>
          }
          groupBy: {
            args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetTokenCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      Room: {
        payload: Prisma.$RoomPayload<ExtArgs>
        fields: Prisma.RoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findFirst: {
            args: Prisma.RoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findMany: {
            args: Prisma.RoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          create: {
            args: Prisma.RoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          createMany: {
            args: Prisma.RoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          delete: {
            args: Prisma.RoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          update: {
            args: Prisma.RoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          deleteMany: {
            args: Prisma.RoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          aggregate: {
            args: Prisma.RoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoom>
          }
          groupBy: {
            args: Prisma.RoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomCountArgs<ExtArgs>
            result: $Utils.Optional<RoomCountAggregateOutputType> | number
          }
        }
      }
      RoomParticipant: {
        payload: Prisma.$RoomParticipantPayload<ExtArgs>
        fields: Prisma.RoomParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>
          }
          findFirst: {
            args: Prisma.RoomParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>
          }
          findMany: {
            args: Prisma.RoomParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>[]
          }
          create: {
            args: Prisma.RoomParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>
          }
          createMany: {
            args: Prisma.RoomParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>[]
          }
          delete: {
            args: Prisma.RoomParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>
          }
          update: {
            args: Prisma.RoomParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>
          }
          deleteMany: {
            args: Prisma.RoomParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoomParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomParticipantPayload>
          }
          aggregate: {
            args: Prisma.RoomParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoomParticipant>
          }
          groupBy: {
            args: Prisma.RoomParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<RoomParticipantCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      RoomInvite: {
        payload: Prisma.$RoomInvitePayload<ExtArgs>
        fields: Prisma.RoomInviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomInviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomInviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>
          }
          findFirst: {
            args: Prisma.RoomInviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomInviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>
          }
          findMany: {
            args: Prisma.RoomInviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>[]
          }
          create: {
            args: Prisma.RoomInviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>
          }
          createMany: {
            args: Prisma.RoomInviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomInviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>[]
          }
          delete: {
            args: Prisma.RoomInviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>
          }
          update: {
            args: Prisma.RoomInviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>
          }
          deleteMany: {
            args: Prisma.RoomInviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomInviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoomInviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomInvitePayload>
          }
          aggregate: {
            args: Prisma.RoomInviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoomInvite>
          }
          groupBy: {
            args: Prisma.RoomInviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomInviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomInviteCountArgs<ExtArgs>
            result: $Utils.Optional<RoomInviteCountAggregateOutputType> | number
          }
        }
      }
      NotificationLog: {
        payload: Prisma.$NotificationLogPayload<ExtArgs>
        fields: Prisma.NotificationLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          findFirst: {
            args: Prisma.NotificationLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          findMany: {
            args: Prisma.NotificationLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>[]
          }
          create: {
            args: Prisma.NotificationLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          createMany: {
            args: Prisma.NotificationLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>[]
          }
          delete: {
            args: Prisma.NotificationLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          update: {
            args: Prisma.NotificationLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          deleteMany: {
            args: Prisma.NotificationLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationLogPayload>
          }
          aggregate: {
            args: Prisma.NotificationLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationLog>
          }
          groupBy: {
            args: Prisma.NotificationLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationLogCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    messages_sent: number
    room_participations: number
    owned_rooms: number
    created_invites: number
    sent_notifications: number
    reset_tokens: number
    audit_logs: number
    push_subscriptions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages_sent?: boolean | UserCountOutputTypeCountMessages_sentArgs
    room_participations?: boolean | UserCountOutputTypeCountRoom_participationsArgs
    owned_rooms?: boolean | UserCountOutputTypeCountOwned_roomsArgs
    created_invites?: boolean | UserCountOutputTypeCountCreated_invitesArgs
    sent_notifications?: boolean | UserCountOutputTypeCountSent_notificationsArgs
    reset_tokens?: boolean | UserCountOutputTypeCountReset_tokensArgs
    audit_logs?: boolean | UserCountOutputTypeCountAudit_logsArgs
    push_subscriptions?: boolean | UserCountOutputTypeCountPush_subscriptionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessages_sentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRoom_participationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomParticipantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwned_roomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreated_invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomInviteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSent_notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReset_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAudit_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPush_subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PushSubscriptionWhereInput
  }


  /**
   * Count Type RoomCountOutputType
   */

  export type RoomCountOutputType = {
    participants: number
    messages: number
    invites: number
  }

  export type RoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | RoomCountOutputTypeCountParticipantsArgs
    messages?: boolean | RoomCountOutputTypeCountMessagesArgs
    invites?: boolean | RoomCountOutputTypeCountInvitesArgs
  }

  // Custom InputTypes
  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomCountOutputType
     */
    select?: RoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomParticipantWhereInput
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomInviteWhereInput
  }


  /**
   * Count Type MessageCountOutputType
   */

  export type MessageCountOutputType = {
    replies: number
  }

  export type MessageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | MessageCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MessageCountOutputType
     */
    select?: MessageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    full_name: string | null
    avatar_url: string | null
    role: string | null
    preferred_language: string | null
    password_hash: string | null
    created_at: Date | null
    email_notifications_enabled: boolean | null
    push_notifications_enabled: boolean | null
    last_email_notification_at: Date | null
    last_push_notification_at: Date | null
    last_password_reset_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    full_name: string | null
    avatar_url: string | null
    role: string | null
    preferred_language: string | null
    password_hash: string | null
    created_at: Date | null
    email_notifications_enabled: boolean | null
    push_notifications_enabled: boolean | null
    last_email_notification_at: Date | null
    last_push_notification_at: Date | null
    last_password_reset_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    full_name: number
    avatar_url: number
    role: number
    preferred_language: number
    password_hash: number
    created_at: number
    email_notifications_enabled: number
    push_notifications_enabled: number
    last_email_notification_at: number
    last_push_notification_at: number
    last_password_reset_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    role?: true
    preferred_language?: true
    password_hash?: true
    created_at?: true
    email_notifications_enabled?: true
    push_notifications_enabled?: true
    last_email_notification_at?: true
    last_push_notification_at?: true
    last_password_reset_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    role?: true
    preferred_language?: true
    password_hash?: true
    created_at?: true
    email_notifications_enabled?: true
    push_notifications_enabled?: true
    last_email_notification_at?: true
    last_push_notification_at?: true
    last_password_reset_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    role?: true
    preferred_language?: true
    password_hash?: true
    created_at?: true
    email_notifications_enabled?: true
    push_notifications_enabled?: true
    last_email_notification_at?: true
    last_push_notification_at?: true
    last_password_reset_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: string
    preferred_language: string
    password_hash: string
    created_at: Date
    email_notifications_enabled: boolean
    push_notifications_enabled: boolean
    last_email_notification_at: Date | null
    last_push_notification_at: Date | null
    last_password_reset_at: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    preferred_language?: boolean
    password_hash?: boolean
    created_at?: boolean
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: boolean
    last_push_notification_at?: boolean
    last_password_reset_at?: boolean
    messages_sent?: boolean | User$messages_sentArgs<ExtArgs>
    room_participations?: boolean | User$room_participationsArgs<ExtArgs>
    owned_rooms?: boolean | User$owned_roomsArgs<ExtArgs>
    created_invites?: boolean | User$created_invitesArgs<ExtArgs>
    sent_notifications?: boolean | User$sent_notificationsArgs<ExtArgs>
    reset_tokens?: boolean | User$reset_tokensArgs<ExtArgs>
    audit_logs?: boolean | User$audit_logsArgs<ExtArgs>
    push_subscriptions?: boolean | User$push_subscriptionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    preferred_language?: boolean
    password_hash?: boolean
    created_at?: boolean
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: boolean
    last_push_notification_at?: boolean
    last_password_reset_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    preferred_language?: boolean
    password_hash?: boolean
    created_at?: boolean
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: boolean
    last_push_notification_at?: boolean
    last_password_reset_at?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages_sent?: boolean | User$messages_sentArgs<ExtArgs>
    room_participations?: boolean | User$room_participationsArgs<ExtArgs>
    owned_rooms?: boolean | User$owned_roomsArgs<ExtArgs>
    created_invites?: boolean | User$created_invitesArgs<ExtArgs>
    sent_notifications?: boolean | User$sent_notificationsArgs<ExtArgs>
    reset_tokens?: boolean | User$reset_tokensArgs<ExtArgs>
    audit_logs?: boolean | User$audit_logsArgs<ExtArgs>
    push_subscriptions?: boolean | User$push_subscriptionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      messages_sent: Prisma.$MessagePayload<ExtArgs>[]
      room_participations: Prisma.$RoomParticipantPayload<ExtArgs>[]
      owned_rooms: Prisma.$RoomPayload<ExtArgs>[]
      created_invites: Prisma.$RoomInvitePayload<ExtArgs>[]
      sent_notifications: Prisma.$NotificationLogPayload<ExtArgs>[]
      reset_tokens: Prisma.$PasswordResetTokenPayload<ExtArgs>[]
      audit_logs: Prisma.$AuditLogPayload<ExtArgs>[]
      push_subscriptions: Prisma.$PushSubscriptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      full_name: string | null
      avatar_url: string | null
      role: string
      preferred_language: string
      password_hash: string
      created_at: Date
      email_notifications_enabled: boolean
      push_notifications_enabled: boolean
      last_email_notification_at: Date | null
      last_push_notification_at: Date | null
      last_password_reset_at: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages_sent<T extends User$messages_sentArgs<ExtArgs> = {}>(args?: Subset<T, User$messages_sentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    room_participations<T extends User$room_participationsArgs<ExtArgs> = {}>(args?: Subset<T, User$room_participationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findMany"> | Null>
    owned_rooms<T extends User$owned_roomsArgs<ExtArgs> = {}>(args?: Subset<T, User$owned_roomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany"> | Null>
    created_invites<T extends User$created_invitesArgs<ExtArgs> = {}>(args?: Subset<T, User$created_invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findMany"> | Null>
    sent_notifications<T extends User$sent_notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$sent_notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findMany"> | Null>
    reset_tokens<T extends User$reset_tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$reset_tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany"> | Null>
    audit_logs<T extends User$audit_logsArgs<ExtArgs> = {}>(args?: Subset<T, User$audit_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany"> | Null>
    push_subscriptions<T extends User$push_subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, User$push_subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly full_name: FieldRef<"User", 'String'>
    readonly avatar_url: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly preferred_language: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly email_notifications_enabled: FieldRef<"User", 'Boolean'>
    readonly push_notifications_enabled: FieldRef<"User", 'Boolean'>
    readonly last_email_notification_at: FieldRef<"User", 'DateTime'>
    readonly last_push_notification_at: FieldRef<"User", 'DateTime'>
    readonly last_password_reset_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.messages_sent
   */
  export type User$messages_sentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User.room_participations
   */
  export type User$room_participationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    where?: RoomParticipantWhereInput
    orderBy?: RoomParticipantOrderByWithRelationInput | RoomParticipantOrderByWithRelationInput[]
    cursor?: RoomParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomParticipantScalarFieldEnum | RoomParticipantScalarFieldEnum[]
  }

  /**
   * User.owned_rooms
   */
  export type User$owned_roomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    cursor?: RoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * User.created_invites
   */
  export type User$created_invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    where?: RoomInviteWhereInput
    orderBy?: RoomInviteOrderByWithRelationInput | RoomInviteOrderByWithRelationInput[]
    cursor?: RoomInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomInviteScalarFieldEnum | RoomInviteScalarFieldEnum[]
  }

  /**
   * User.sent_notifications
   */
  export type User$sent_notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    where?: NotificationLogWhereInput
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    cursor?: NotificationLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * User.reset_tokens
   */
  export type User$reset_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    cursor?: PasswordResetTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * User.audit_logs
   */
  export type User$audit_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.push_subscriptions
   */
  export type User$push_subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    where?: PushSubscriptionWhereInput
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    cursor?: PushSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PushSubscription
   */

  export type AggregatePushSubscription = {
    _count: PushSubscriptionCountAggregateOutputType | null
    _min: PushSubscriptionMinAggregateOutputType | null
    _max: PushSubscriptionMaxAggregateOutputType | null
  }

  export type PushSubscriptionMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    endpoint: string | null
    p256dh: string | null
    auth: string | null
    created_at: Date | null
  }

  export type PushSubscriptionMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    endpoint: string | null
    p256dh: string | null
    auth: string | null
    created_at: Date | null
  }

  export type PushSubscriptionCountAggregateOutputType = {
    id: number
    user_id: number
    endpoint: number
    p256dh: number
    auth: number
    created_at: number
    _all: number
  }


  export type PushSubscriptionMinAggregateInputType = {
    id?: true
    user_id?: true
    endpoint?: true
    p256dh?: true
    auth?: true
    created_at?: true
  }

  export type PushSubscriptionMaxAggregateInputType = {
    id?: true
    user_id?: true
    endpoint?: true
    p256dh?: true
    auth?: true
    created_at?: true
  }

  export type PushSubscriptionCountAggregateInputType = {
    id?: true
    user_id?: true
    endpoint?: true
    p256dh?: true
    auth?: true
    created_at?: true
    _all?: true
  }

  export type PushSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PushSubscription to aggregate.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PushSubscriptions
    **/
    _count?: true | PushSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PushSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PushSubscriptionMaxAggregateInputType
  }

  export type GetPushSubscriptionAggregateType<T extends PushSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregatePushSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePushSubscription[P]>
      : GetScalarType<T[P], AggregatePushSubscription[P]>
  }




  export type PushSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PushSubscriptionWhereInput
    orderBy?: PushSubscriptionOrderByWithAggregationInput | PushSubscriptionOrderByWithAggregationInput[]
    by: PushSubscriptionScalarFieldEnum[] | PushSubscriptionScalarFieldEnum
    having?: PushSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PushSubscriptionCountAggregateInputType | true
    _min?: PushSubscriptionMinAggregateInputType
    _max?: PushSubscriptionMaxAggregateInputType
  }

  export type PushSubscriptionGroupByOutputType = {
    id: string
    user_id: string
    endpoint: string
    p256dh: string
    auth: string
    created_at: Date
    _count: PushSubscriptionCountAggregateOutputType | null
    _min: PushSubscriptionMinAggregateOutputType | null
    _max: PushSubscriptionMaxAggregateOutputType | null
  }

  type GetPushSubscriptionGroupByPayload<T extends PushSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PushSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PushSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PushSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], PushSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type PushSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    endpoint?: boolean
    p256dh?: boolean
    auth?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pushSubscription"]>

  export type PushSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    endpoint?: boolean
    p256dh?: boolean
    auth?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pushSubscription"]>

  export type PushSubscriptionSelectScalar = {
    id?: boolean
    user_id?: boolean
    endpoint?: boolean
    p256dh?: boolean
    auth?: boolean
    created_at?: boolean
  }

  export type PushSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PushSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PushSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PushSubscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      endpoint: string
      p256dh: string
      auth: string
      created_at: Date
    }, ExtArgs["result"]["pushSubscription"]>
    composites: {}
  }

  type PushSubscriptionGetPayload<S extends boolean | null | undefined | PushSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$PushSubscriptionPayload, S>

  type PushSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PushSubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PushSubscriptionCountAggregateInputType | true
    }

  export interface PushSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PushSubscription'], meta: { name: 'PushSubscription' } }
    /**
     * Find zero or one PushSubscription that matches the filter.
     * @param {PushSubscriptionFindUniqueArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PushSubscriptionFindUniqueArgs>(args: SelectSubset<T, PushSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PushSubscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PushSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PushSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, PushSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PushSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindFirstArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PushSubscriptionFindFirstArgs>(args?: SelectSubset<T, PushSubscriptionFindFirstArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PushSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindFirstOrThrowArgs} args - Arguments to find a PushSubscription
     * @example
     * // Get one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PushSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, PushSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PushSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PushSubscriptions
     * const pushSubscriptions = await prisma.pushSubscription.findMany()
     * 
     * // Get first 10 PushSubscriptions
     * const pushSubscriptions = await prisma.pushSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pushSubscriptionWithIdOnly = await prisma.pushSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PushSubscriptionFindManyArgs>(args?: SelectSubset<T, PushSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PushSubscription.
     * @param {PushSubscriptionCreateArgs} args - Arguments to create a PushSubscription.
     * @example
     * // Create one PushSubscription
     * const PushSubscription = await prisma.pushSubscription.create({
     *   data: {
     *     // ... data to create a PushSubscription
     *   }
     * })
     * 
     */
    create<T extends PushSubscriptionCreateArgs>(args: SelectSubset<T, PushSubscriptionCreateArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PushSubscriptions.
     * @param {PushSubscriptionCreateManyArgs} args - Arguments to create many PushSubscriptions.
     * @example
     * // Create many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PushSubscriptionCreateManyArgs>(args?: SelectSubset<T, PushSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PushSubscriptions and returns the data saved in the database.
     * @param {PushSubscriptionCreateManyAndReturnArgs} args - Arguments to create many PushSubscriptions.
     * @example
     * // Create many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PushSubscriptions and only return the `id`
     * const pushSubscriptionWithIdOnly = await prisma.pushSubscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PushSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, PushSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PushSubscription.
     * @param {PushSubscriptionDeleteArgs} args - Arguments to delete one PushSubscription.
     * @example
     * // Delete one PushSubscription
     * const PushSubscription = await prisma.pushSubscription.delete({
     *   where: {
     *     // ... filter to delete one PushSubscription
     *   }
     * })
     * 
     */
    delete<T extends PushSubscriptionDeleteArgs>(args: SelectSubset<T, PushSubscriptionDeleteArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PushSubscription.
     * @param {PushSubscriptionUpdateArgs} args - Arguments to update one PushSubscription.
     * @example
     * // Update one PushSubscription
     * const pushSubscription = await prisma.pushSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PushSubscriptionUpdateArgs>(args: SelectSubset<T, PushSubscriptionUpdateArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PushSubscriptions.
     * @param {PushSubscriptionDeleteManyArgs} args - Arguments to filter PushSubscriptions to delete.
     * @example
     * // Delete a few PushSubscriptions
     * const { count } = await prisma.pushSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PushSubscriptionDeleteManyArgs>(args?: SelectSubset<T, PushSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PushSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PushSubscriptions
     * const pushSubscription = await prisma.pushSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PushSubscriptionUpdateManyArgs>(args: SelectSubset<T, PushSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PushSubscription.
     * @param {PushSubscriptionUpsertArgs} args - Arguments to update or create a PushSubscription.
     * @example
     * // Update or create a PushSubscription
     * const pushSubscription = await prisma.pushSubscription.upsert({
     *   create: {
     *     // ... data to create a PushSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PushSubscription we want to update
     *   }
     * })
     */
    upsert<T extends PushSubscriptionUpsertArgs>(args: SelectSubset<T, PushSubscriptionUpsertArgs<ExtArgs>>): Prisma__PushSubscriptionClient<$Result.GetResult<Prisma.$PushSubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PushSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionCountArgs} args - Arguments to filter PushSubscriptions to count.
     * @example
     * // Count the number of PushSubscriptions
     * const count = await prisma.pushSubscription.count({
     *   where: {
     *     // ... the filter for the PushSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends PushSubscriptionCountArgs>(
      args?: Subset<T, PushSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PushSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PushSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PushSubscriptionAggregateArgs>(args: Subset<T, PushSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetPushSubscriptionAggregateType<T>>

    /**
     * Group by PushSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PushSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PushSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PushSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: PushSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PushSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPushSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PushSubscription model
   */
  readonly fields: PushSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PushSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PushSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PushSubscription model
   */ 
  interface PushSubscriptionFieldRefs {
    readonly id: FieldRef<"PushSubscription", 'String'>
    readonly user_id: FieldRef<"PushSubscription", 'String'>
    readonly endpoint: FieldRef<"PushSubscription", 'String'>
    readonly p256dh: FieldRef<"PushSubscription", 'String'>
    readonly auth: FieldRef<"PushSubscription", 'String'>
    readonly created_at: FieldRef<"PushSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PushSubscription findUnique
   */
  export type PushSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription findUniqueOrThrow
   */
  export type PushSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription findFirst
   */
  export type PushSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription findFirstOrThrow
   */
  export type PushSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscription to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PushSubscriptions.
     */
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription findMany
   */
  export type PushSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which PushSubscriptions to fetch.
     */
    where?: PushSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PushSubscriptions to fetch.
     */
    orderBy?: PushSubscriptionOrderByWithRelationInput | PushSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PushSubscriptions.
     */
    cursor?: PushSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PushSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PushSubscriptions.
     */
    skip?: number
    distinct?: PushSubscriptionScalarFieldEnum | PushSubscriptionScalarFieldEnum[]
  }

  /**
   * PushSubscription create
   */
  export type PushSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a PushSubscription.
     */
    data: XOR<PushSubscriptionCreateInput, PushSubscriptionUncheckedCreateInput>
  }

  /**
   * PushSubscription createMany
   */
  export type PushSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PushSubscriptions.
     */
    data: PushSubscriptionCreateManyInput | PushSubscriptionCreateManyInput[]
  }

  /**
   * PushSubscription createManyAndReturn
   */
  export type PushSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PushSubscriptions.
     */
    data: PushSubscriptionCreateManyInput | PushSubscriptionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PushSubscription update
   */
  export type PushSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a PushSubscription.
     */
    data: XOR<PushSubscriptionUpdateInput, PushSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which PushSubscription to update.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription updateMany
   */
  export type PushSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PushSubscriptions.
     */
    data: XOR<PushSubscriptionUpdateManyMutationInput, PushSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which PushSubscriptions to update
     */
    where?: PushSubscriptionWhereInput
  }

  /**
   * PushSubscription upsert
   */
  export type PushSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the PushSubscription to update in case it exists.
     */
    where: PushSubscriptionWhereUniqueInput
    /**
     * In case the PushSubscription found by the `where` argument doesn't exist, create a new PushSubscription with this data.
     */
    create: XOR<PushSubscriptionCreateInput, PushSubscriptionUncheckedCreateInput>
    /**
     * In case the PushSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PushSubscriptionUpdateInput, PushSubscriptionUncheckedUpdateInput>
  }

  /**
   * PushSubscription delete
   */
  export type PushSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which PushSubscription to delete.
     */
    where: PushSubscriptionWhereUniqueInput
  }

  /**
   * PushSubscription deleteMany
   */
  export type PushSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PushSubscriptions to delete
     */
    where?: PushSubscriptionWhereInput
  }

  /**
   * PushSubscription without action
   */
  export type PushSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PushSubscription
     */
    select?: PushSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PushSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetToken
   */

  export type AggregatePasswordResetToken = {
    _count: PasswordResetTokenCountAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  export type PasswordResetTokenMinAggregateOutputType = {
    id: string | null
    token: string | null
    user_id: string | null
    expires_at: Date | null
    created_at: Date | null
  }

  export type PasswordResetTokenMaxAggregateOutputType = {
    id: string | null
    token: string | null
    user_id: string | null
    expires_at: Date | null
    created_at: Date | null
  }

  export type PasswordResetTokenCountAggregateOutputType = {
    id: number
    token: number
    user_id: number
    expires_at: number
    created_at: number
    _all: number
  }


  export type PasswordResetTokenMinAggregateInputType = {
    id?: true
    token?: true
    user_id?: true
    expires_at?: true
    created_at?: true
  }

  export type PasswordResetTokenMaxAggregateInputType = {
    id?: true
    token?: true
    user_id?: true
    expires_at?: true
    created_at?: true
  }

  export type PasswordResetTokenCountAggregateInputType = {
    id?: true
    token?: true
    user_id?: true
    expires_at?: true
    created_at?: true
    _all?: true
  }

  export type PasswordResetTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetToken to aggregate.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetTokens
    **/
    _count?: true | PasswordResetTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type GetPasswordResetTokenAggregateType<T extends PasswordResetTokenAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetToken[P]>
      : GetScalarType<T[P], AggregatePasswordResetToken[P]>
  }




  export type PasswordResetTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithAggregationInput | PasswordResetTokenOrderByWithAggregationInput[]
    by: PasswordResetTokenScalarFieldEnum[] | PasswordResetTokenScalarFieldEnum
    having?: PasswordResetTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetTokenCountAggregateInputType | true
    _min?: PasswordResetTokenMinAggregateInputType
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type PasswordResetTokenGroupByOutputType = {
    id: string
    token: string
    user_id: string
    expires_at: Date
    created_at: Date
    _count: PasswordResetTokenCountAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  type GetPasswordResetTokenGroupByPayload<T extends PasswordResetTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    user_id?: boolean
    expires_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    user_id?: boolean
    expires_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectScalar = {
    id?: boolean
    token?: boolean
    user_id?: boolean
    expires_at?: boolean
    created_at?: boolean
  }

  export type PasswordResetTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      user_id: string
      expires_at: Date
      created_at: Date
    }, ExtArgs["result"]["passwordResetToken"]>
    composites: {}
  }

  type PasswordResetTokenGetPayload<S extends boolean | null | undefined | PasswordResetTokenDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetTokenPayload, S>

  type PasswordResetTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PasswordResetTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PasswordResetTokenCountAggregateInputType | true
    }

  export interface PasswordResetTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetToken'], meta: { name: 'PasswordResetToken' } }
    /**
     * Find zero or one PasswordResetToken that matches the filter.
     * @param {PasswordResetTokenFindUniqueArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokenFindUniqueArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PasswordResetToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PasswordResetTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PasswordResetToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokenFindFirstArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PasswordResetToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany()
     * 
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetTokenFindManyArgs>(args?: SelectSubset<T, PasswordResetTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PasswordResetToken.
     * @param {PasswordResetTokenCreateArgs} args - Arguments to create a PasswordResetToken.
     * @example
     * // Create one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.create({
     *   data: {
     *     // ... data to create a PasswordResetToken
     *   }
     * })
     * 
     */
    create<T extends PasswordResetTokenCreateArgs>(args: SelectSubset<T, PasswordResetTokenCreateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokenCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetTokenCreateManyArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PasswordResetToken.
     * @param {PasswordResetTokenDeleteArgs} args - Arguments to delete one PasswordResetToken.
     * @example
     * // Delete one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetToken
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetTokenDeleteArgs>(args: SelectSubset<T, PasswordResetTokenDeleteArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PasswordResetToken.
     * @param {PasswordResetTokenUpdateArgs} args - Arguments to update one PasswordResetToken.
     * @example
     * // Update one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetTokenUpdateArgs>(args: SelectSubset<T, PasswordResetTokenUpdateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokenDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetTokenDeleteManyArgs>(args?: SelectSubset<T, PasswordResetTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetTokenUpdateManyArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PasswordResetToken.
     * @param {PasswordResetTokenUpsertArgs} args - Arguments to update or create a PasswordResetToken.
     * @example
     * // Update or create a PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.upsert({
     *   create: {
     *     // ... data to create a PasswordResetToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokenUpsertArgs>(args: SelectSubset<T, PasswordResetTokenUpsertArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetToken.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetTokenCountArgs>(
      args?: Subset<T, PasswordResetTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetTokenAggregateArgs>(args: Subset<T, PasswordResetTokenAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetTokenAggregateType<T>>

    /**
     * Group by PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetToken model
   */
  readonly fields: PasswordResetTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetToken model
   */ 
  interface PasswordResetTokenFieldRefs {
    readonly id: FieldRef<"PasswordResetToken", 'String'>
    readonly token: FieldRef<"PasswordResetToken", 'String'>
    readonly user_id: FieldRef<"PasswordResetToken", 'String'>
    readonly expires_at: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly created_at: FieldRef<"PasswordResetToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetToken findUnique
   */
  export type PasswordResetTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findUniqueOrThrow
   */
  export type PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findFirst
   */
  export type PasswordResetTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findFirstOrThrow
   */
  export type PasswordResetTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findMany
   */
  export type PasswordResetTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken create
   */
  export type PasswordResetTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
  }

  /**
   * PasswordResetToken createMany
   */
  export type PasswordResetTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
  }

  /**
   * PasswordResetToken createManyAndReturn
   */
  export type PasswordResetTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken update
   */
  export type PasswordResetTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetToken to update.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken updateMany
   */
  export type PasswordResetTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
  }

  /**
   * PasswordResetToken upsert
   */
  export type PasswordResetTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetToken to update in case it exists.
     */
    where: PasswordResetTokenWhereUniqueInput
    /**
     * In case the PasswordResetToken found by the `where` argument doesn't exist, create a new PasswordResetToken with this data.
     */
    create: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
    /**
     * In case the PasswordResetToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
  }

  /**
   * PasswordResetToken delete
   */
  export type PasswordResetTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter which PasswordResetToken to delete.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken deleteMany
   */
  export type PasswordResetTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokenWhereInput
  }

  /**
   * PasswordResetToken without action
   */
  export type PasswordResetTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    ip_address: string | null
    action: string | null
    details: string | null
    created_at: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    ip_address: string | null
    action: string | null
    details: string | null
    created_at: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    user_id: number
    ip_address: number
    action: number
    details: number
    created_at: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    user_id?: true
    ip_address?: true
    action?: true
    details?: true
    created_at?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    user_id?: true
    ip_address?: true
    action?: true
    details?: true
    created_at?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    user_id?: true
    ip_address?: true
    action?: true
    details?: true
    created_at?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    user_id: string | null
    ip_address: string | null
    action: string
    details: string | null
    created_at: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    ip_address?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    ip_address?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    user_id?: boolean
    ip_address?: boolean
    action?: boolean
    details?: boolean
    created_at?: boolean
  }

  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string | null
      ip_address: string | null
      action: string
      details: string | null
      created_at: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */ 
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly user_id: FieldRef<"AuditLog", 'String'>
    readonly ip_address: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly created_at: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model Room
   */

  export type AggregateRoom = {
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  export type RoomAvgAggregateOutputType = {
    capacity: number | null
  }

  export type RoomSumAggregateOutputType = {
    capacity: number | null
  }

  export type RoomMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    capacity: number | null
    equipment: string | null
    type: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type RoomMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    capacity: number | null
    equipment: string | null
    type: string | null
    created_by: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type RoomCountAggregateOutputType = {
    id: number
    name: number
    description: number
    capacity: number
    equipment: number
    type: number
    created_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type RoomAvgAggregateInputType = {
    capacity?: true
  }

  export type RoomSumAggregateInputType = {
    capacity?: true
  }

  export type RoomMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    capacity?: true
    equipment?: true
    type?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type RoomMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    capacity?: true
    equipment?: true
    type?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type RoomCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    capacity?: true
    equipment?: true
    type?: true
    created_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type RoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Room to aggregate.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rooms
    **/
    _count?: true | RoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomMaxAggregateInputType
  }

  export type GetRoomAggregateType<T extends RoomAggregateArgs> = {
        [P in keyof T & keyof AggregateRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom[P]>
      : GetScalarType<T[P], AggregateRoom[P]>
  }




  export type RoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithAggregationInput | RoomOrderByWithAggregationInput[]
    by: RoomScalarFieldEnum[] | RoomScalarFieldEnum
    having?: RoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomCountAggregateInputType | true
    _avg?: RoomAvgAggregateInputType
    _sum?: RoomSumAggregateInputType
    _min?: RoomMinAggregateInputType
    _max?: RoomMaxAggregateInputType
  }

  export type RoomGroupByOutputType = {
    id: string
    name: string | null
    description: string | null
    capacity: number | null
    equipment: string | null
    type: string
    created_by: string | null
    created_at: Date
    updated_at: Date
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  type GetRoomGroupByPayload<T extends RoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomGroupByOutputType[P]>
            : GetScalarType<T[P], RoomGroupByOutputType[P]>
        }
      >
    >


  export type RoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    capacity?: boolean
    equipment?: boolean
    type?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    owner?: boolean | Room$ownerArgs<ExtArgs>
    participants?: boolean | Room$participantsArgs<ExtArgs>
    messages?: boolean | Room$messagesArgs<ExtArgs>
    invites?: boolean | Room$invitesArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    capacity?: boolean
    equipment?: boolean
    type?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    owner?: boolean | Room$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    capacity?: boolean
    equipment?: boolean
    type?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type RoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Room$ownerArgs<ExtArgs>
    participants?: boolean | Room$participantsArgs<ExtArgs>
    messages?: boolean | Room$messagesArgs<ExtArgs>
    invites?: boolean | Room$invitesArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Room$ownerArgs<ExtArgs>
  }

  export type $RoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Room"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs> | null
      participants: Prisma.$RoomParticipantPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      invites: Prisma.$RoomInvitePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      description: string | null
      capacity: number | null
      equipment: string | null
      type: string
      created_by: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["room"]>
    composites: {}
  }

  type RoomGetPayload<S extends boolean | null | undefined | RoomDefaultArgs> = $Result.GetResult<Prisma.$RoomPayload, S>

  type RoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoomFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoomCountAggregateInputType | true
    }

  export interface RoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Room'], meta: { name: 'Room' } }
    /**
     * Find zero or one Room that matches the filter.
     * @param {RoomFindUniqueArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomFindUniqueArgs>(args: SelectSubset<T, RoomFindUniqueArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Room that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoomFindUniqueOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Room that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomFindFirstArgs>(args?: SelectSubset<T, RoomFindFirstArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Room that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Rooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rooms
     * const rooms = await prisma.room.findMany()
     * 
     * // Get first 10 Rooms
     * const rooms = await prisma.room.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomWithIdOnly = await prisma.room.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomFindManyArgs>(args?: SelectSubset<T, RoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Room.
     * @param {RoomCreateArgs} args - Arguments to create a Room.
     * @example
     * // Create one Room
     * const Room = await prisma.room.create({
     *   data: {
     *     // ... data to create a Room
     *   }
     * })
     * 
     */
    create<T extends RoomCreateArgs>(args: SelectSubset<T, RoomCreateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Rooms.
     * @param {RoomCreateManyArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomCreateManyArgs>(args?: SelectSubset<T, RoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rooms and returns the data saved in the database.
     * @param {RoomCreateManyAndReturnArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Room.
     * @param {RoomDeleteArgs} args - Arguments to delete one Room.
     * @example
     * // Delete one Room
     * const Room = await prisma.room.delete({
     *   where: {
     *     // ... filter to delete one Room
     *   }
     * })
     * 
     */
    delete<T extends RoomDeleteArgs>(args: SelectSubset<T, RoomDeleteArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Room.
     * @param {RoomUpdateArgs} args - Arguments to update one Room.
     * @example
     * // Update one Room
     * const room = await prisma.room.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomUpdateArgs>(args: SelectSubset<T, RoomUpdateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Rooms.
     * @param {RoomDeleteManyArgs} args - Arguments to filter Rooms to delete.
     * @example
     * // Delete a few Rooms
     * const { count } = await prisma.room.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomDeleteManyArgs>(args?: SelectSubset<T, RoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomUpdateManyArgs>(args: SelectSubset<T, RoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Room.
     * @param {RoomUpsertArgs} args - Arguments to update or create a Room.
     * @example
     * // Update or create a Room
     * const room = await prisma.room.upsert({
     *   create: {
     *     // ... data to create a Room
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room we want to update
     *   }
     * })
     */
    upsert<T extends RoomUpsertArgs>(args: SelectSubset<T, RoomUpsertArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomCountArgs} args - Arguments to filter Rooms to count.
     * @example
     * // Count the number of Rooms
     * const count = await prisma.room.count({
     *   where: {
     *     // ... the filter for the Rooms we want to count
     *   }
     * })
    **/
    count<T extends RoomCountArgs>(
      args?: Subset<T, RoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomAggregateArgs>(args: Subset<T, RoomAggregateArgs>): Prisma.PrismaPromise<GetRoomAggregateType<T>>

    /**
     * Group by Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomGroupByArgs['orderBy'] }
        : { orderBy?: RoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Room model
   */
  readonly fields: RoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Room.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends Room$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Room$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    participants<T extends Room$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Room$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findMany"> | Null>
    messages<T extends Room$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Room$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    invites<T extends Room$invitesArgs<ExtArgs> = {}>(args?: Subset<T, Room$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Room model
   */ 
  interface RoomFieldRefs {
    readonly id: FieldRef<"Room", 'String'>
    readonly name: FieldRef<"Room", 'String'>
    readonly description: FieldRef<"Room", 'String'>
    readonly capacity: FieldRef<"Room", 'Int'>
    readonly equipment: FieldRef<"Room", 'String'>
    readonly type: FieldRef<"Room", 'String'>
    readonly created_by: FieldRef<"Room", 'String'>
    readonly created_at: FieldRef<"Room", 'DateTime'>
    readonly updated_at: FieldRef<"Room", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Room findUnique
   */
  export type RoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findUniqueOrThrow
   */
  export type RoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findFirst
   */
  export type RoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findFirstOrThrow
   */
  export type RoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findMany
   */
  export type RoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Rooms to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room create
   */
  export type RoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to create a Room.
     */
    data?: XOR<RoomCreateInput, RoomUncheckedCreateInput>
  }

  /**
   * Room createMany
   */
  export type RoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
  }

  /**
   * Room createManyAndReturn
   */
  export type RoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Room update
   */
  export type RoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to update a Room.
     */
    data: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
    /**
     * Choose, which Room to update.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room updateMany
   */
  export type RoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
  }

  /**
   * Room upsert
   */
  export type RoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The filter to search for the Room to update in case it exists.
     */
    where: RoomWhereUniqueInput
    /**
     * In case the Room found by the `where` argument doesn't exist, create a new Room with this data.
     */
    create: XOR<RoomCreateInput, RoomUncheckedCreateInput>
    /**
     * In case the Room was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
  }

  /**
   * Room delete
   */
  export type RoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter which Room to delete.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room deleteMany
   */
  export type RoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rooms to delete
     */
    where?: RoomWhereInput
  }

  /**
   * Room.owner
   */
  export type Room$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Room.participants
   */
  export type Room$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    where?: RoomParticipantWhereInput
    orderBy?: RoomParticipantOrderByWithRelationInput | RoomParticipantOrderByWithRelationInput[]
    cursor?: RoomParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomParticipantScalarFieldEnum | RoomParticipantScalarFieldEnum[]
  }

  /**
   * Room.messages
   */
  export type Room$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Room.invites
   */
  export type Room$invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    where?: RoomInviteWhereInput
    orderBy?: RoomInviteOrderByWithRelationInput | RoomInviteOrderByWithRelationInput[]
    cursor?: RoomInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomInviteScalarFieldEnum | RoomInviteScalarFieldEnum[]
  }

  /**
   * Room without action
   */
  export type RoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
  }


  /**
   * Model RoomParticipant
   */

  export type AggregateRoomParticipant = {
    _count: RoomParticipantCountAggregateOutputType | null
    _min: RoomParticipantMinAggregateOutputType | null
    _max: RoomParticipantMaxAggregateOutputType | null
  }

  export type RoomParticipantMinAggregateOutputType = {
    id: string | null
    room_id: string | null
    user_id: string | null
    role: string | null
    joined_at: Date | null
    last_read_at: Date | null
    last_active_at: Date | null
    typing_at: Date | null
  }

  export type RoomParticipantMaxAggregateOutputType = {
    id: string | null
    room_id: string | null
    user_id: string | null
    role: string | null
    joined_at: Date | null
    last_read_at: Date | null
    last_active_at: Date | null
    typing_at: Date | null
  }

  export type RoomParticipantCountAggregateOutputType = {
    id: number
    room_id: number
    user_id: number
    role: number
    joined_at: number
    last_read_at: number
    last_active_at: number
    typing_at: number
    _all: number
  }


  export type RoomParticipantMinAggregateInputType = {
    id?: true
    room_id?: true
    user_id?: true
    role?: true
    joined_at?: true
    last_read_at?: true
    last_active_at?: true
    typing_at?: true
  }

  export type RoomParticipantMaxAggregateInputType = {
    id?: true
    room_id?: true
    user_id?: true
    role?: true
    joined_at?: true
    last_read_at?: true
    last_active_at?: true
    typing_at?: true
  }

  export type RoomParticipantCountAggregateInputType = {
    id?: true
    room_id?: true
    user_id?: true
    role?: true
    joined_at?: true
    last_read_at?: true
    last_active_at?: true
    typing_at?: true
    _all?: true
  }

  export type RoomParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomParticipant to aggregate.
     */
    where?: RoomParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomParticipants to fetch.
     */
    orderBy?: RoomParticipantOrderByWithRelationInput | RoomParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoomParticipants
    **/
    _count?: true | RoomParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomParticipantMaxAggregateInputType
  }

  export type GetRoomParticipantAggregateType<T extends RoomParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateRoomParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoomParticipant[P]>
      : GetScalarType<T[P], AggregateRoomParticipant[P]>
  }




  export type RoomParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomParticipantWhereInput
    orderBy?: RoomParticipantOrderByWithAggregationInput | RoomParticipantOrderByWithAggregationInput[]
    by: RoomParticipantScalarFieldEnum[] | RoomParticipantScalarFieldEnum
    having?: RoomParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomParticipantCountAggregateInputType | true
    _min?: RoomParticipantMinAggregateInputType
    _max?: RoomParticipantMaxAggregateInputType
  }

  export type RoomParticipantGroupByOutputType = {
    id: string
    room_id: string
    user_id: string
    role: string
    joined_at: Date
    last_read_at: Date
    last_active_at: Date
    typing_at: Date | null
    _count: RoomParticipantCountAggregateOutputType | null
    _min: RoomParticipantMinAggregateOutputType | null
    _max: RoomParticipantMaxAggregateOutputType | null
  }

  type GetRoomParticipantGroupByPayload<T extends RoomParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], RoomParticipantGroupByOutputType[P]>
        }
      >
    >


  export type RoomParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    room_id?: boolean
    user_id?: boolean
    role?: boolean
    joined_at?: boolean
    last_read_at?: boolean
    last_active_at?: boolean
    typing_at?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomParticipant"]>

  export type RoomParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    room_id?: boolean
    user_id?: boolean
    role?: boolean
    joined_at?: boolean
    last_read_at?: boolean
    last_active_at?: boolean
    typing_at?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomParticipant"]>

  export type RoomParticipantSelectScalar = {
    id?: boolean
    room_id?: boolean
    user_id?: boolean
    role?: boolean
    joined_at?: boolean
    last_read_at?: boolean
    last_active_at?: boolean
    typing_at?: boolean
  }

  export type RoomParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RoomParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RoomParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoomParticipant"
    objects: {
      room: Prisma.$RoomPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      room_id: string
      user_id: string
      role: string
      joined_at: Date
      last_read_at: Date
      last_active_at: Date
      typing_at: Date | null
    }, ExtArgs["result"]["roomParticipant"]>
    composites: {}
  }

  type RoomParticipantGetPayload<S extends boolean | null | undefined | RoomParticipantDefaultArgs> = $Result.GetResult<Prisma.$RoomParticipantPayload, S>

  type RoomParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoomParticipantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoomParticipantCountAggregateInputType | true
    }

  export interface RoomParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoomParticipant'], meta: { name: 'RoomParticipant' } }
    /**
     * Find zero or one RoomParticipant that matches the filter.
     * @param {RoomParticipantFindUniqueArgs} args - Arguments to find a RoomParticipant
     * @example
     * // Get one RoomParticipant
     * const roomParticipant = await prisma.roomParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomParticipantFindUniqueArgs>(args: SelectSubset<T, RoomParticipantFindUniqueArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RoomParticipant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoomParticipantFindUniqueOrThrowArgs} args - Arguments to find a RoomParticipant
     * @example
     * // Get one RoomParticipant
     * const roomParticipant = await prisma.roomParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RoomParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantFindFirstArgs} args - Arguments to find a RoomParticipant
     * @example
     * // Get one RoomParticipant
     * const roomParticipant = await prisma.roomParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomParticipantFindFirstArgs>(args?: SelectSubset<T, RoomParticipantFindFirstArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RoomParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantFindFirstOrThrowArgs} args - Arguments to find a RoomParticipant
     * @example
     * // Get one RoomParticipant
     * const roomParticipant = await prisma.roomParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RoomParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoomParticipants
     * const roomParticipants = await prisma.roomParticipant.findMany()
     * 
     * // Get first 10 RoomParticipants
     * const roomParticipants = await prisma.roomParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomParticipantWithIdOnly = await prisma.roomParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomParticipantFindManyArgs>(args?: SelectSubset<T, RoomParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RoomParticipant.
     * @param {RoomParticipantCreateArgs} args - Arguments to create a RoomParticipant.
     * @example
     * // Create one RoomParticipant
     * const RoomParticipant = await prisma.roomParticipant.create({
     *   data: {
     *     // ... data to create a RoomParticipant
     *   }
     * })
     * 
     */
    create<T extends RoomParticipantCreateArgs>(args: SelectSubset<T, RoomParticipantCreateArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RoomParticipants.
     * @param {RoomParticipantCreateManyArgs} args - Arguments to create many RoomParticipants.
     * @example
     * // Create many RoomParticipants
     * const roomParticipant = await prisma.roomParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomParticipantCreateManyArgs>(args?: SelectSubset<T, RoomParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoomParticipants and returns the data saved in the database.
     * @param {RoomParticipantCreateManyAndReturnArgs} args - Arguments to create many RoomParticipants.
     * @example
     * // Create many RoomParticipants
     * const roomParticipant = await prisma.roomParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoomParticipants and only return the `id`
     * const roomParticipantWithIdOnly = await prisma.roomParticipant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RoomParticipant.
     * @param {RoomParticipantDeleteArgs} args - Arguments to delete one RoomParticipant.
     * @example
     * // Delete one RoomParticipant
     * const RoomParticipant = await prisma.roomParticipant.delete({
     *   where: {
     *     // ... filter to delete one RoomParticipant
     *   }
     * })
     * 
     */
    delete<T extends RoomParticipantDeleteArgs>(args: SelectSubset<T, RoomParticipantDeleteArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RoomParticipant.
     * @param {RoomParticipantUpdateArgs} args - Arguments to update one RoomParticipant.
     * @example
     * // Update one RoomParticipant
     * const roomParticipant = await prisma.roomParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomParticipantUpdateArgs>(args: SelectSubset<T, RoomParticipantUpdateArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RoomParticipants.
     * @param {RoomParticipantDeleteManyArgs} args - Arguments to filter RoomParticipants to delete.
     * @example
     * // Delete a few RoomParticipants
     * const { count } = await prisma.roomParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomParticipantDeleteManyArgs>(args?: SelectSubset<T, RoomParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoomParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoomParticipants
     * const roomParticipant = await prisma.roomParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomParticipantUpdateManyArgs>(args: SelectSubset<T, RoomParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RoomParticipant.
     * @param {RoomParticipantUpsertArgs} args - Arguments to update or create a RoomParticipant.
     * @example
     * // Update or create a RoomParticipant
     * const roomParticipant = await prisma.roomParticipant.upsert({
     *   create: {
     *     // ... data to create a RoomParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoomParticipant we want to update
     *   }
     * })
     */
    upsert<T extends RoomParticipantUpsertArgs>(args: SelectSubset<T, RoomParticipantUpsertArgs<ExtArgs>>): Prisma__RoomParticipantClient<$Result.GetResult<Prisma.$RoomParticipantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RoomParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantCountArgs} args - Arguments to filter RoomParticipants to count.
     * @example
     * // Count the number of RoomParticipants
     * const count = await prisma.roomParticipant.count({
     *   where: {
     *     // ... the filter for the RoomParticipants we want to count
     *   }
     * })
    **/
    count<T extends RoomParticipantCountArgs>(
      args?: Subset<T, RoomParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoomParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomParticipantAggregateArgs>(args: Subset<T, RoomParticipantAggregateArgs>): Prisma.PrismaPromise<GetRoomParticipantAggregateType<T>>

    /**
     * Group by RoomParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomParticipantGroupByArgs['orderBy'] }
        : { orderBy?: RoomParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoomParticipant model
   */
  readonly fields: RoomParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoomParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoomParticipant model
   */ 
  interface RoomParticipantFieldRefs {
    readonly id: FieldRef<"RoomParticipant", 'String'>
    readonly room_id: FieldRef<"RoomParticipant", 'String'>
    readonly user_id: FieldRef<"RoomParticipant", 'String'>
    readonly role: FieldRef<"RoomParticipant", 'String'>
    readonly joined_at: FieldRef<"RoomParticipant", 'DateTime'>
    readonly last_read_at: FieldRef<"RoomParticipant", 'DateTime'>
    readonly last_active_at: FieldRef<"RoomParticipant", 'DateTime'>
    readonly typing_at: FieldRef<"RoomParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoomParticipant findUnique
   */
  export type RoomParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * Filter, which RoomParticipant to fetch.
     */
    where: RoomParticipantWhereUniqueInput
  }

  /**
   * RoomParticipant findUniqueOrThrow
   */
  export type RoomParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * Filter, which RoomParticipant to fetch.
     */
    where: RoomParticipantWhereUniqueInput
  }

  /**
   * RoomParticipant findFirst
   */
  export type RoomParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * Filter, which RoomParticipant to fetch.
     */
    where?: RoomParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomParticipants to fetch.
     */
    orderBy?: RoomParticipantOrderByWithRelationInput | RoomParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomParticipants.
     */
    cursor?: RoomParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomParticipants.
     */
    distinct?: RoomParticipantScalarFieldEnum | RoomParticipantScalarFieldEnum[]
  }

  /**
   * RoomParticipant findFirstOrThrow
   */
  export type RoomParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * Filter, which RoomParticipant to fetch.
     */
    where?: RoomParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomParticipants to fetch.
     */
    orderBy?: RoomParticipantOrderByWithRelationInput | RoomParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomParticipants.
     */
    cursor?: RoomParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomParticipants.
     */
    distinct?: RoomParticipantScalarFieldEnum | RoomParticipantScalarFieldEnum[]
  }

  /**
   * RoomParticipant findMany
   */
  export type RoomParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * Filter, which RoomParticipants to fetch.
     */
    where?: RoomParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomParticipants to fetch.
     */
    orderBy?: RoomParticipantOrderByWithRelationInput | RoomParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoomParticipants.
     */
    cursor?: RoomParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomParticipants.
     */
    skip?: number
    distinct?: RoomParticipantScalarFieldEnum | RoomParticipantScalarFieldEnum[]
  }

  /**
   * RoomParticipant create
   */
  export type RoomParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a RoomParticipant.
     */
    data: XOR<RoomParticipantCreateInput, RoomParticipantUncheckedCreateInput>
  }

  /**
   * RoomParticipant createMany
   */
  export type RoomParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoomParticipants.
     */
    data: RoomParticipantCreateManyInput | RoomParticipantCreateManyInput[]
  }

  /**
   * RoomParticipant createManyAndReturn
   */
  export type RoomParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RoomParticipants.
     */
    data: RoomParticipantCreateManyInput | RoomParticipantCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoomParticipant update
   */
  export type RoomParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a RoomParticipant.
     */
    data: XOR<RoomParticipantUpdateInput, RoomParticipantUncheckedUpdateInput>
    /**
     * Choose, which RoomParticipant to update.
     */
    where: RoomParticipantWhereUniqueInput
  }

  /**
   * RoomParticipant updateMany
   */
  export type RoomParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoomParticipants.
     */
    data: XOR<RoomParticipantUpdateManyMutationInput, RoomParticipantUncheckedUpdateManyInput>
    /**
     * Filter which RoomParticipants to update
     */
    where?: RoomParticipantWhereInput
  }

  /**
   * RoomParticipant upsert
   */
  export type RoomParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the RoomParticipant to update in case it exists.
     */
    where: RoomParticipantWhereUniqueInput
    /**
     * In case the RoomParticipant found by the `where` argument doesn't exist, create a new RoomParticipant with this data.
     */
    create: XOR<RoomParticipantCreateInput, RoomParticipantUncheckedCreateInput>
    /**
     * In case the RoomParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomParticipantUpdateInput, RoomParticipantUncheckedUpdateInput>
  }

  /**
   * RoomParticipant delete
   */
  export type RoomParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
    /**
     * Filter which RoomParticipant to delete.
     */
    where: RoomParticipantWhereUniqueInput
  }

  /**
   * RoomParticipant deleteMany
   */
  export type RoomParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomParticipants to delete
     */
    where?: RoomParticipantWhereInput
  }

  /**
   * RoomParticipant without action
   */
  export type RoomParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomParticipant
     */
    select?: RoomParticipantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomParticipantInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    room_id: string | null
    sender_id: string | null
    content: string | null
    content_translated: string | null
    message_type: string | null
    file_url: string | null
    voice_transcription: string | null
    created_at: Date | null
    is_edited: boolean | null
    reply_to_id: string | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    room_id: string | null
    sender_id: string | null
    content: string | null
    content_translated: string | null
    message_type: string | null
    file_url: string | null
    voice_transcription: string | null
    created_at: Date | null
    is_edited: boolean | null
    reply_to_id: string | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    room_id: number
    sender_id: number
    content: number
    content_translated: number
    message_type: number
    file_url: number
    voice_transcription: number
    created_at: number
    is_edited: number
    reply_to_id: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    room_id?: true
    sender_id?: true
    content?: true
    content_translated?: true
    message_type?: true
    file_url?: true
    voice_transcription?: true
    created_at?: true
    is_edited?: true
    reply_to_id?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    room_id?: true
    sender_id?: true
    content?: true
    content_translated?: true
    message_type?: true
    file_url?: true
    voice_transcription?: true
    created_at?: true
    is_edited?: true
    reply_to_id?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    room_id?: true
    sender_id?: true
    content?: true
    content_translated?: true
    message_type?: true
    file_url?: true
    voice_transcription?: true
    created_at?: true
    is_edited?: true
    reply_to_id?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    room_id: string
    sender_id: string
    content: string | null
    content_translated: string | null
    message_type: string
    file_url: string | null
    voice_transcription: string | null
    created_at: Date
    is_edited: boolean
    reply_to_id: string | null
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    room_id?: boolean
    sender_id?: boolean
    content?: boolean
    content_translated?: boolean
    message_type?: boolean
    file_url?: boolean
    voice_transcription?: boolean
    created_at?: boolean
    is_edited?: boolean
    reply_to_id?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    reply_to?: boolean | Message$reply_toArgs<ExtArgs>
    replies?: boolean | Message$repliesArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    room_id?: boolean
    sender_id?: boolean
    content?: boolean
    content_translated?: boolean
    message_type?: boolean
    file_url?: boolean
    voice_transcription?: boolean
    created_at?: boolean
    is_edited?: boolean
    reply_to_id?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    reply_to?: boolean | Message$reply_toArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    room_id?: boolean
    sender_id?: boolean
    content?: boolean
    content_translated?: boolean
    message_type?: boolean
    file_url?: boolean
    voice_transcription?: boolean
    created_at?: boolean
    is_edited?: boolean
    reply_to_id?: boolean
  }

  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    reply_to?: boolean | Message$reply_toArgs<ExtArgs>
    replies?: boolean | Message$repliesArgs<ExtArgs>
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    sender?: boolean | UserDefaultArgs<ExtArgs>
    reply_to?: boolean | Message$reply_toArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      room: Prisma.$RoomPayload<ExtArgs>
      sender: Prisma.$UserPayload<ExtArgs>
      reply_to: Prisma.$MessagePayload<ExtArgs> | null
      replies: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      room_id: string
      sender_id: string
      content: string | null
      content_translated: string | null
      message_type: string
      file_url: string | null
      voice_transcription: string | null
      created_at: Date
      is_edited: boolean
      reply_to_id: string | null
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    reply_to<T extends Message$reply_toArgs<ExtArgs> = {}>(args?: Subset<T, Message$reply_toArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    replies<T extends Message$repliesArgs<ExtArgs> = {}>(args?: Subset<T, Message$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */ 
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly room_id: FieldRef<"Message", 'String'>
    readonly sender_id: FieldRef<"Message", 'String'>
    readonly content: FieldRef<"Message", 'String'>
    readonly content_translated: FieldRef<"Message", 'String'>
    readonly message_type: FieldRef<"Message", 'String'>
    readonly file_url: FieldRef<"Message", 'String'>
    readonly voice_transcription: FieldRef<"Message", 'String'>
    readonly created_at: FieldRef<"Message", 'DateTime'>
    readonly is_edited: FieldRef<"Message", 'Boolean'>
    readonly reply_to_id: FieldRef<"Message", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
  }

  /**
   * Message.reply_to
   */
  export type Message$reply_toArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
  }

  /**
   * Message.replies
   */
  export type Message$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model RoomInvite
   */

  export type AggregateRoomInvite = {
    _count: RoomInviteCountAggregateOutputType | null
    _avg: RoomInviteAvgAggregateOutputType | null
    _sum: RoomInviteSumAggregateOutputType | null
    _min: RoomInviteMinAggregateOutputType | null
    _max: RoomInviteMaxAggregateOutputType | null
  }

  export type RoomInviteAvgAggregateOutputType = {
    max_uses: number | null
    uses: number | null
  }

  export type RoomInviteSumAggregateOutputType = {
    max_uses: number | null
    uses: number | null
  }

  export type RoomInviteMinAggregateOutputType = {
    id: string | null
    token: string | null
    room_id: string | null
    created_by: string | null
    role: string | null
    expires_at: Date | null
    max_uses: number | null
    uses: number | null
    created_at: Date | null
  }

  export type RoomInviteMaxAggregateOutputType = {
    id: string | null
    token: string | null
    room_id: string | null
    created_by: string | null
    role: string | null
    expires_at: Date | null
    max_uses: number | null
    uses: number | null
    created_at: Date | null
  }

  export type RoomInviteCountAggregateOutputType = {
    id: number
    token: number
    room_id: number
    created_by: number
    role: number
    expires_at: number
    max_uses: number
    uses: number
    created_at: number
    _all: number
  }


  export type RoomInviteAvgAggregateInputType = {
    max_uses?: true
    uses?: true
  }

  export type RoomInviteSumAggregateInputType = {
    max_uses?: true
    uses?: true
  }

  export type RoomInviteMinAggregateInputType = {
    id?: true
    token?: true
    room_id?: true
    created_by?: true
    role?: true
    expires_at?: true
    max_uses?: true
    uses?: true
    created_at?: true
  }

  export type RoomInviteMaxAggregateInputType = {
    id?: true
    token?: true
    room_id?: true
    created_by?: true
    role?: true
    expires_at?: true
    max_uses?: true
    uses?: true
    created_at?: true
  }

  export type RoomInviteCountAggregateInputType = {
    id?: true
    token?: true
    room_id?: true
    created_by?: true
    role?: true
    expires_at?: true
    max_uses?: true
    uses?: true
    created_at?: true
    _all?: true
  }

  export type RoomInviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomInvite to aggregate.
     */
    where?: RoomInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomInvites to fetch.
     */
    orderBy?: RoomInviteOrderByWithRelationInput | RoomInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoomInvites
    **/
    _count?: true | RoomInviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomInviteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomInviteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomInviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomInviteMaxAggregateInputType
  }

  export type GetRoomInviteAggregateType<T extends RoomInviteAggregateArgs> = {
        [P in keyof T & keyof AggregateRoomInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoomInvite[P]>
      : GetScalarType<T[P], AggregateRoomInvite[P]>
  }




  export type RoomInviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomInviteWhereInput
    orderBy?: RoomInviteOrderByWithAggregationInput | RoomInviteOrderByWithAggregationInput[]
    by: RoomInviteScalarFieldEnum[] | RoomInviteScalarFieldEnum
    having?: RoomInviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomInviteCountAggregateInputType | true
    _avg?: RoomInviteAvgAggregateInputType
    _sum?: RoomInviteSumAggregateInputType
    _min?: RoomInviteMinAggregateInputType
    _max?: RoomInviteMaxAggregateInputType
  }

  export type RoomInviteGroupByOutputType = {
    id: string
    token: string
    room_id: string
    created_by: string
    role: string
    expires_at: Date
    max_uses: number
    uses: number
    created_at: Date
    _count: RoomInviteCountAggregateOutputType | null
    _avg: RoomInviteAvgAggregateOutputType | null
    _sum: RoomInviteSumAggregateOutputType | null
    _min: RoomInviteMinAggregateOutputType | null
    _max: RoomInviteMaxAggregateOutputType | null
  }

  type GetRoomInviteGroupByPayload<T extends RoomInviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomInviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomInviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomInviteGroupByOutputType[P]>
            : GetScalarType<T[P], RoomInviteGroupByOutputType[P]>
        }
      >
    >


  export type RoomInviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    room_id?: boolean
    created_by?: boolean
    role?: boolean
    expires_at?: boolean
    max_uses?: boolean
    uses?: boolean
    created_at?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomInvite"]>

  export type RoomInviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    room_id?: boolean
    created_by?: boolean
    role?: boolean
    expires_at?: boolean
    max_uses?: boolean
    uses?: boolean
    created_at?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomInvite"]>

  export type RoomInviteSelectScalar = {
    id?: boolean
    token?: boolean
    room_id?: boolean
    created_by?: boolean
    role?: boolean
    expires_at?: boolean
    max_uses?: boolean
    uses?: boolean
    created_at?: boolean
  }

  export type RoomInviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RoomInviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RoomInvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoomInvite"
    objects: {
      room: Prisma.$RoomPayload<ExtArgs>
      creator: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      room_id: string
      created_by: string
      role: string
      expires_at: Date
      max_uses: number
      uses: number
      created_at: Date
    }, ExtArgs["result"]["roomInvite"]>
    composites: {}
  }

  type RoomInviteGetPayload<S extends boolean | null | undefined | RoomInviteDefaultArgs> = $Result.GetResult<Prisma.$RoomInvitePayload, S>

  type RoomInviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoomInviteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoomInviteCountAggregateInputType | true
    }

  export interface RoomInviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoomInvite'], meta: { name: 'RoomInvite' } }
    /**
     * Find zero or one RoomInvite that matches the filter.
     * @param {RoomInviteFindUniqueArgs} args - Arguments to find a RoomInvite
     * @example
     * // Get one RoomInvite
     * const roomInvite = await prisma.roomInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomInviteFindUniqueArgs>(args: SelectSubset<T, RoomInviteFindUniqueArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RoomInvite that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoomInviteFindUniqueOrThrowArgs} args - Arguments to find a RoomInvite
     * @example
     * // Get one RoomInvite
     * const roomInvite = await prisma.roomInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomInviteFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RoomInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteFindFirstArgs} args - Arguments to find a RoomInvite
     * @example
     * // Get one RoomInvite
     * const roomInvite = await prisma.roomInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomInviteFindFirstArgs>(args?: SelectSubset<T, RoomInviteFindFirstArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RoomInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteFindFirstOrThrowArgs} args - Arguments to find a RoomInvite
     * @example
     * // Get one RoomInvite
     * const roomInvite = await prisma.roomInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomInviteFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RoomInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoomInvites
     * const roomInvites = await prisma.roomInvite.findMany()
     * 
     * // Get first 10 RoomInvites
     * const roomInvites = await prisma.roomInvite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomInviteWithIdOnly = await prisma.roomInvite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomInviteFindManyArgs>(args?: SelectSubset<T, RoomInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RoomInvite.
     * @param {RoomInviteCreateArgs} args - Arguments to create a RoomInvite.
     * @example
     * // Create one RoomInvite
     * const RoomInvite = await prisma.roomInvite.create({
     *   data: {
     *     // ... data to create a RoomInvite
     *   }
     * })
     * 
     */
    create<T extends RoomInviteCreateArgs>(args: SelectSubset<T, RoomInviteCreateArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RoomInvites.
     * @param {RoomInviteCreateManyArgs} args - Arguments to create many RoomInvites.
     * @example
     * // Create many RoomInvites
     * const roomInvite = await prisma.roomInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomInviteCreateManyArgs>(args?: SelectSubset<T, RoomInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoomInvites and returns the data saved in the database.
     * @param {RoomInviteCreateManyAndReturnArgs} args - Arguments to create many RoomInvites.
     * @example
     * // Create many RoomInvites
     * const roomInvite = await prisma.roomInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoomInvites and only return the `id`
     * const roomInviteWithIdOnly = await prisma.roomInvite.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomInviteCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RoomInvite.
     * @param {RoomInviteDeleteArgs} args - Arguments to delete one RoomInvite.
     * @example
     * // Delete one RoomInvite
     * const RoomInvite = await prisma.roomInvite.delete({
     *   where: {
     *     // ... filter to delete one RoomInvite
     *   }
     * })
     * 
     */
    delete<T extends RoomInviteDeleteArgs>(args: SelectSubset<T, RoomInviteDeleteArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RoomInvite.
     * @param {RoomInviteUpdateArgs} args - Arguments to update one RoomInvite.
     * @example
     * // Update one RoomInvite
     * const roomInvite = await prisma.roomInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomInviteUpdateArgs>(args: SelectSubset<T, RoomInviteUpdateArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RoomInvites.
     * @param {RoomInviteDeleteManyArgs} args - Arguments to filter RoomInvites to delete.
     * @example
     * // Delete a few RoomInvites
     * const { count } = await prisma.roomInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomInviteDeleteManyArgs>(args?: SelectSubset<T, RoomInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoomInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoomInvites
     * const roomInvite = await prisma.roomInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomInviteUpdateManyArgs>(args: SelectSubset<T, RoomInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RoomInvite.
     * @param {RoomInviteUpsertArgs} args - Arguments to update or create a RoomInvite.
     * @example
     * // Update or create a RoomInvite
     * const roomInvite = await prisma.roomInvite.upsert({
     *   create: {
     *     // ... data to create a RoomInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoomInvite we want to update
     *   }
     * })
     */
    upsert<T extends RoomInviteUpsertArgs>(args: SelectSubset<T, RoomInviteUpsertArgs<ExtArgs>>): Prisma__RoomInviteClient<$Result.GetResult<Prisma.$RoomInvitePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RoomInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteCountArgs} args - Arguments to filter RoomInvites to count.
     * @example
     * // Count the number of RoomInvites
     * const count = await prisma.roomInvite.count({
     *   where: {
     *     // ... the filter for the RoomInvites we want to count
     *   }
     * })
    **/
    count<T extends RoomInviteCountArgs>(
      args?: Subset<T, RoomInviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomInviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoomInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomInviteAggregateArgs>(args: Subset<T, RoomInviteAggregateArgs>): Prisma.PrismaPromise<GetRoomInviteAggregateType<T>>

    /**
     * Group by RoomInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomInviteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomInviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomInviteGroupByArgs['orderBy'] }
        : { orderBy?: RoomInviteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoomInvite model
   */
  readonly fields: RoomInviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoomInvite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomInviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoomInvite model
   */ 
  interface RoomInviteFieldRefs {
    readonly id: FieldRef<"RoomInvite", 'String'>
    readonly token: FieldRef<"RoomInvite", 'String'>
    readonly room_id: FieldRef<"RoomInvite", 'String'>
    readonly created_by: FieldRef<"RoomInvite", 'String'>
    readonly role: FieldRef<"RoomInvite", 'String'>
    readonly expires_at: FieldRef<"RoomInvite", 'DateTime'>
    readonly max_uses: FieldRef<"RoomInvite", 'Int'>
    readonly uses: FieldRef<"RoomInvite", 'Int'>
    readonly created_at: FieldRef<"RoomInvite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoomInvite findUnique
   */
  export type RoomInviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * Filter, which RoomInvite to fetch.
     */
    where: RoomInviteWhereUniqueInput
  }

  /**
   * RoomInvite findUniqueOrThrow
   */
  export type RoomInviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * Filter, which RoomInvite to fetch.
     */
    where: RoomInviteWhereUniqueInput
  }

  /**
   * RoomInvite findFirst
   */
  export type RoomInviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * Filter, which RoomInvite to fetch.
     */
    where?: RoomInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomInvites to fetch.
     */
    orderBy?: RoomInviteOrderByWithRelationInput | RoomInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomInvites.
     */
    cursor?: RoomInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomInvites.
     */
    distinct?: RoomInviteScalarFieldEnum | RoomInviteScalarFieldEnum[]
  }

  /**
   * RoomInvite findFirstOrThrow
   */
  export type RoomInviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * Filter, which RoomInvite to fetch.
     */
    where?: RoomInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomInvites to fetch.
     */
    orderBy?: RoomInviteOrderByWithRelationInput | RoomInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomInvites.
     */
    cursor?: RoomInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomInvites.
     */
    distinct?: RoomInviteScalarFieldEnum | RoomInviteScalarFieldEnum[]
  }

  /**
   * RoomInvite findMany
   */
  export type RoomInviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * Filter, which RoomInvites to fetch.
     */
    where?: RoomInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomInvites to fetch.
     */
    orderBy?: RoomInviteOrderByWithRelationInput | RoomInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoomInvites.
     */
    cursor?: RoomInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomInvites.
     */
    skip?: number
    distinct?: RoomInviteScalarFieldEnum | RoomInviteScalarFieldEnum[]
  }

  /**
   * RoomInvite create
   */
  export type RoomInviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * The data needed to create a RoomInvite.
     */
    data: XOR<RoomInviteCreateInput, RoomInviteUncheckedCreateInput>
  }

  /**
   * RoomInvite createMany
   */
  export type RoomInviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoomInvites.
     */
    data: RoomInviteCreateManyInput | RoomInviteCreateManyInput[]
  }

  /**
   * RoomInvite createManyAndReturn
   */
  export type RoomInviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RoomInvites.
     */
    data: RoomInviteCreateManyInput | RoomInviteCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoomInvite update
   */
  export type RoomInviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * The data needed to update a RoomInvite.
     */
    data: XOR<RoomInviteUpdateInput, RoomInviteUncheckedUpdateInput>
    /**
     * Choose, which RoomInvite to update.
     */
    where: RoomInviteWhereUniqueInput
  }

  /**
   * RoomInvite updateMany
   */
  export type RoomInviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoomInvites.
     */
    data: XOR<RoomInviteUpdateManyMutationInput, RoomInviteUncheckedUpdateManyInput>
    /**
     * Filter which RoomInvites to update
     */
    where?: RoomInviteWhereInput
  }

  /**
   * RoomInvite upsert
   */
  export type RoomInviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * The filter to search for the RoomInvite to update in case it exists.
     */
    where: RoomInviteWhereUniqueInput
    /**
     * In case the RoomInvite found by the `where` argument doesn't exist, create a new RoomInvite with this data.
     */
    create: XOR<RoomInviteCreateInput, RoomInviteUncheckedCreateInput>
    /**
     * In case the RoomInvite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomInviteUpdateInput, RoomInviteUncheckedUpdateInput>
  }

  /**
   * RoomInvite delete
   */
  export type RoomInviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
    /**
     * Filter which RoomInvite to delete.
     */
    where: RoomInviteWhereUniqueInput
  }

  /**
   * RoomInvite deleteMany
   */
  export type RoomInviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomInvites to delete
     */
    where?: RoomInviteWhereInput
  }

  /**
   * RoomInvite without action
   */
  export type RoomInviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomInvite
     */
    select?: RoomInviteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInviteInclude<ExtArgs> | null
  }


  /**
   * Model NotificationLog
   */

  export type AggregateNotificationLog = {
    _count: NotificationLogCountAggregateOutputType | null
    _min: NotificationLogMinAggregateOutputType | null
    _max: NotificationLogMaxAggregateOutputType | null
  }

  export type NotificationLogMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    email: string | null
    type: string | null
    status: string | null
    error: string | null
    sent_at: Date | null
    metadata: string | null
  }

  export type NotificationLogMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    email: string | null
    type: string | null
    status: string | null
    error: string | null
    sent_at: Date | null
    metadata: string | null
  }

  export type NotificationLogCountAggregateOutputType = {
    id: number
    user_id: number
    email: number
    type: number
    status: number
    error: number
    sent_at: number
    metadata: number
    _all: number
  }


  export type NotificationLogMinAggregateInputType = {
    id?: true
    user_id?: true
    email?: true
    type?: true
    status?: true
    error?: true
    sent_at?: true
    metadata?: true
  }

  export type NotificationLogMaxAggregateInputType = {
    id?: true
    user_id?: true
    email?: true
    type?: true
    status?: true
    error?: true
    sent_at?: true
    metadata?: true
  }

  export type NotificationLogCountAggregateInputType = {
    id?: true
    user_id?: true
    email?: true
    type?: true
    status?: true
    error?: true
    sent_at?: true
    metadata?: true
    _all?: true
  }

  export type NotificationLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationLog to aggregate.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationLogs
    **/
    _count?: true | NotificationLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationLogMaxAggregateInputType
  }

  export type GetNotificationLogAggregateType<T extends NotificationLogAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationLog[P]>
      : GetScalarType<T[P], AggregateNotificationLog[P]>
  }




  export type NotificationLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationLogWhereInput
    orderBy?: NotificationLogOrderByWithAggregationInput | NotificationLogOrderByWithAggregationInput[]
    by: NotificationLogScalarFieldEnum[] | NotificationLogScalarFieldEnum
    having?: NotificationLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationLogCountAggregateInputType | true
    _min?: NotificationLogMinAggregateInputType
    _max?: NotificationLogMaxAggregateInputType
  }

  export type NotificationLogGroupByOutputType = {
    id: string
    user_id: string
    email: string
    type: string
    status: string
    error: string | null
    sent_at: Date
    metadata: string | null
    _count: NotificationLogCountAggregateOutputType | null
    _min: NotificationLogMinAggregateOutputType | null
    _max: NotificationLogMaxAggregateOutputType | null
  }

  type GetNotificationLogGroupByPayload<T extends NotificationLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationLogGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationLogGroupByOutputType[P]>
        }
      >
    >


  export type NotificationLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    email?: boolean
    type?: boolean
    status?: boolean
    error?: boolean
    sent_at?: boolean
    metadata?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationLog"]>

  export type NotificationLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    email?: boolean
    type?: boolean
    status?: boolean
    error?: boolean
    sent_at?: boolean
    metadata?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationLog"]>

  export type NotificationLogSelectScalar = {
    id?: boolean
    user_id?: boolean
    email?: boolean
    type?: boolean
    status?: boolean
    error?: boolean
    sent_at?: boolean
    metadata?: boolean
  }

  export type NotificationLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      email: string
      type: string
      status: string
      error: string | null
      sent_at: Date
      metadata: string | null
    }, ExtArgs["result"]["notificationLog"]>
    composites: {}
  }

  type NotificationLogGetPayload<S extends boolean | null | undefined | NotificationLogDefaultArgs> = $Result.GetResult<Prisma.$NotificationLogPayload, S>

  type NotificationLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationLogCountAggregateInputType | true
    }

  export interface NotificationLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationLog'], meta: { name: 'NotificationLog' } }
    /**
     * Find zero or one NotificationLog that matches the filter.
     * @param {NotificationLogFindUniqueArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationLogFindUniqueArgs>(args: SelectSubset<T, NotificationLogFindUniqueArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NotificationLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationLogFindUniqueOrThrowArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationLogFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NotificationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogFindFirstArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationLogFindFirstArgs>(args?: SelectSubset<T, NotificationLogFindFirstArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NotificationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogFindFirstOrThrowArgs} args - Arguments to find a NotificationLog
     * @example
     * // Get one NotificationLog
     * const notificationLog = await prisma.notificationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationLogFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NotificationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationLogs
     * const notificationLogs = await prisma.notificationLog.findMany()
     * 
     * // Get first 10 NotificationLogs
     * const notificationLogs = await prisma.notificationLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationLogWithIdOnly = await prisma.notificationLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationLogFindManyArgs>(args?: SelectSubset<T, NotificationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NotificationLog.
     * @param {NotificationLogCreateArgs} args - Arguments to create a NotificationLog.
     * @example
     * // Create one NotificationLog
     * const NotificationLog = await prisma.notificationLog.create({
     *   data: {
     *     // ... data to create a NotificationLog
     *   }
     * })
     * 
     */
    create<T extends NotificationLogCreateArgs>(args: SelectSubset<T, NotificationLogCreateArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NotificationLogs.
     * @param {NotificationLogCreateManyArgs} args - Arguments to create many NotificationLogs.
     * @example
     * // Create many NotificationLogs
     * const notificationLog = await prisma.notificationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationLogCreateManyArgs>(args?: SelectSubset<T, NotificationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationLogs and returns the data saved in the database.
     * @param {NotificationLogCreateManyAndReturnArgs} args - Arguments to create many NotificationLogs.
     * @example
     * // Create many NotificationLogs
     * const notificationLog = await prisma.notificationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationLogs and only return the `id`
     * const notificationLogWithIdOnly = await prisma.notificationLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationLogCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NotificationLog.
     * @param {NotificationLogDeleteArgs} args - Arguments to delete one NotificationLog.
     * @example
     * // Delete one NotificationLog
     * const NotificationLog = await prisma.notificationLog.delete({
     *   where: {
     *     // ... filter to delete one NotificationLog
     *   }
     * })
     * 
     */
    delete<T extends NotificationLogDeleteArgs>(args: SelectSubset<T, NotificationLogDeleteArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NotificationLog.
     * @param {NotificationLogUpdateArgs} args - Arguments to update one NotificationLog.
     * @example
     * // Update one NotificationLog
     * const notificationLog = await prisma.notificationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationLogUpdateArgs>(args: SelectSubset<T, NotificationLogUpdateArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NotificationLogs.
     * @param {NotificationLogDeleteManyArgs} args - Arguments to filter NotificationLogs to delete.
     * @example
     * // Delete a few NotificationLogs
     * const { count } = await prisma.notificationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationLogDeleteManyArgs>(args?: SelectSubset<T, NotificationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationLogs
     * const notificationLog = await prisma.notificationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationLogUpdateManyArgs>(args: SelectSubset<T, NotificationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationLog.
     * @param {NotificationLogUpsertArgs} args - Arguments to update or create a NotificationLog.
     * @example
     * // Update or create a NotificationLog
     * const notificationLog = await prisma.notificationLog.upsert({
     *   create: {
     *     // ... data to create a NotificationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationLog we want to update
     *   }
     * })
     */
    upsert<T extends NotificationLogUpsertArgs>(args: SelectSubset<T, NotificationLogUpsertArgs<ExtArgs>>): Prisma__NotificationLogClient<$Result.GetResult<Prisma.$NotificationLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NotificationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogCountArgs} args - Arguments to filter NotificationLogs to count.
     * @example
     * // Count the number of NotificationLogs
     * const count = await prisma.notificationLog.count({
     *   where: {
     *     // ... the filter for the NotificationLogs we want to count
     *   }
     * })
    **/
    count<T extends NotificationLogCountArgs>(
      args?: Subset<T, NotificationLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationLogAggregateArgs>(args: Subset<T, NotificationLogAggregateArgs>): Prisma.PrismaPromise<GetNotificationLogAggregateType<T>>

    /**
     * Group by NotificationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationLogGroupByArgs['orderBy'] }
        : { orderBy?: NotificationLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationLog model
   */
  readonly fields: NotificationLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationLog model
   */ 
  interface NotificationLogFieldRefs {
    readonly id: FieldRef<"NotificationLog", 'String'>
    readonly user_id: FieldRef<"NotificationLog", 'String'>
    readonly email: FieldRef<"NotificationLog", 'String'>
    readonly type: FieldRef<"NotificationLog", 'String'>
    readonly status: FieldRef<"NotificationLog", 'String'>
    readonly error: FieldRef<"NotificationLog", 'String'>
    readonly sent_at: FieldRef<"NotificationLog", 'DateTime'>
    readonly metadata: FieldRef<"NotificationLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * NotificationLog findUnique
   */
  export type NotificationLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog findUniqueOrThrow
   */
  export type NotificationLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog findFirst
   */
  export type NotificationLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationLogs.
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationLogs.
     */
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * NotificationLog findFirstOrThrow
   */
  export type NotificationLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLog to fetch.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationLogs.
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationLogs.
     */
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * NotificationLog findMany
   */
  export type NotificationLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter, which NotificationLogs to fetch.
     */
    where?: NotificationLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationLogs to fetch.
     */
    orderBy?: NotificationLogOrderByWithRelationInput | NotificationLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationLogs.
     */
    cursor?: NotificationLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationLogs.
     */
    skip?: number
    distinct?: NotificationLogScalarFieldEnum | NotificationLogScalarFieldEnum[]
  }

  /**
   * NotificationLog create
   */
  export type NotificationLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationLog.
     */
    data: XOR<NotificationLogCreateInput, NotificationLogUncheckedCreateInput>
  }

  /**
   * NotificationLog createMany
   */
  export type NotificationLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationLogs.
     */
    data: NotificationLogCreateManyInput | NotificationLogCreateManyInput[]
  }

  /**
   * NotificationLog createManyAndReturn
   */
  export type NotificationLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NotificationLogs.
     */
    data: NotificationLogCreateManyInput | NotificationLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NotificationLog update
   */
  export type NotificationLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationLog.
     */
    data: XOR<NotificationLogUpdateInput, NotificationLogUncheckedUpdateInput>
    /**
     * Choose, which NotificationLog to update.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog updateMany
   */
  export type NotificationLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationLogs.
     */
    data: XOR<NotificationLogUpdateManyMutationInput, NotificationLogUncheckedUpdateManyInput>
    /**
     * Filter which NotificationLogs to update
     */
    where?: NotificationLogWhereInput
  }

  /**
   * NotificationLog upsert
   */
  export type NotificationLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationLog to update in case it exists.
     */
    where: NotificationLogWhereUniqueInput
    /**
     * In case the NotificationLog found by the `where` argument doesn't exist, create a new NotificationLog with this data.
     */
    create: XOR<NotificationLogCreateInput, NotificationLogUncheckedCreateInput>
    /**
     * In case the NotificationLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationLogUpdateInput, NotificationLogUncheckedUpdateInput>
  }

  /**
   * NotificationLog delete
   */
  export type NotificationLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
    /**
     * Filter which NotificationLog to delete.
     */
    where: NotificationLogWhereUniqueInput
  }

  /**
   * NotificationLog deleteMany
   */
  export type NotificationLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationLogs to delete
     */
    where?: NotificationLogWhereInput
  }

  /**
   * NotificationLog without action
   */
  export type NotificationLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationLog
     */
    select?: NotificationLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
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

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PushSubscriptionScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    endpoint: 'endpoint',
    p256dh: 'p256dh',
    auth: 'auth',
    created_at: 'created_at'
  };

  export type PushSubscriptionScalarFieldEnum = (typeof PushSubscriptionScalarFieldEnum)[keyof typeof PushSubscriptionScalarFieldEnum]


  export const PasswordResetTokenScalarFieldEnum: {
    id: 'id',
    token: 'token',
    user_id: 'user_id',
    expires_at: 'expires_at',
    created_at: 'created_at'
  };

  export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    ip_address: 'ip_address',
    action: 'action',
    details: 'details',
    created_at: 'created_at'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const RoomScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    capacity: 'capacity',
    equipment: 'equipment',
    type: 'type',
    created_by: 'created_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type RoomScalarFieldEnum = (typeof RoomScalarFieldEnum)[keyof typeof RoomScalarFieldEnum]


  export const RoomParticipantScalarFieldEnum: {
    id: 'id',
    room_id: 'room_id',
    user_id: 'user_id',
    role: 'role',
    joined_at: 'joined_at',
    last_read_at: 'last_read_at',
    last_active_at: 'last_active_at',
    typing_at: 'typing_at'
  };

  export type RoomParticipantScalarFieldEnum = (typeof RoomParticipantScalarFieldEnum)[keyof typeof RoomParticipantScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    room_id: 'room_id',
    sender_id: 'sender_id',
    content: 'content',
    content_translated: 'content_translated',
    message_type: 'message_type',
    file_url: 'file_url',
    voice_transcription: 'voice_transcription',
    created_at: 'created_at',
    is_edited: 'is_edited',
    reply_to_id: 'reply_to_id'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const RoomInviteScalarFieldEnum: {
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

  export type RoomInviteScalarFieldEnum = (typeof RoomInviteScalarFieldEnum)[keyof typeof RoomInviteScalarFieldEnum]


  export const NotificationLogScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    email: 'email',
    type: 'type',
    status: 'status',
    error: 'error',
    sent_at: 'sent_at',
    metadata: 'metadata'
  };

  export type NotificationLogScalarFieldEnum = (typeof NotificationLogScalarFieldEnum)[keyof typeof NotificationLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    full_name?: StringNullableFilter<"User"> | string | null
    avatar_url?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    preferred_language?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    email_notifications_enabled?: BoolFilter<"User"> | boolean
    push_notifications_enabled?: BoolFilter<"User"> | boolean
    last_email_notification_at?: DateTimeNullableFilter<"User"> | Date | string | null
    last_push_notification_at?: DateTimeNullableFilter<"User"> | Date | string | null
    last_password_reset_at?: DateTimeNullableFilter<"User"> | Date | string | null
    messages_sent?: MessageListRelationFilter
    room_participations?: RoomParticipantListRelationFilter
    owned_rooms?: RoomListRelationFilter
    created_invites?: RoomInviteListRelationFilter
    sent_notifications?: NotificationLogListRelationFilter
    reset_tokens?: PasswordResetTokenListRelationFilter
    audit_logs?: AuditLogListRelationFilter
    push_subscriptions?: PushSubscriptionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    role?: SortOrder
    preferred_language?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    email_notifications_enabled?: SortOrder
    push_notifications_enabled?: SortOrder
    last_email_notification_at?: SortOrderInput | SortOrder
    last_push_notification_at?: SortOrderInput | SortOrder
    last_password_reset_at?: SortOrderInput | SortOrder
    messages_sent?: MessageOrderByRelationAggregateInput
    room_participations?: RoomParticipantOrderByRelationAggregateInput
    owned_rooms?: RoomOrderByRelationAggregateInput
    created_invites?: RoomInviteOrderByRelationAggregateInput
    sent_notifications?: NotificationLogOrderByRelationAggregateInput
    reset_tokens?: PasswordResetTokenOrderByRelationAggregateInput
    audit_logs?: AuditLogOrderByRelationAggregateInput
    push_subscriptions?: PushSubscriptionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    full_name?: StringNullableFilter<"User"> | string | null
    avatar_url?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    preferred_language?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    email_notifications_enabled?: BoolFilter<"User"> | boolean
    push_notifications_enabled?: BoolFilter<"User"> | boolean
    last_email_notification_at?: DateTimeNullableFilter<"User"> | Date | string | null
    last_push_notification_at?: DateTimeNullableFilter<"User"> | Date | string | null
    last_password_reset_at?: DateTimeNullableFilter<"User"> | Date | string | null
    messages_sent?: MessageListRelationFilter
    room_participations?: RoomParticipantListRelationFilter
    owned_rooms?: RoomListRelationFilter
    created_invites?: RoomInviteListRelationFilter
    sent_notifications?: NotificationLogListRelationFilter
    reset_tokens?: PasswordResetTokenListRelationFilter
    audit_logs?: AuditLogListRelationFilter
    push_subscriptions?: PushSubscriptionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    role?: SortOrder
    preferred_language?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    email_notifications_enabled?: SortOrder
    push_notifications_enabled?: SortOrder
    last_email_notification_at?: SortOrderInput | SortOrder
    last_push_notification_at?: SortOrderInput | SortOrder
    last_password_reset_at?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    full_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar_url?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    preferred_language?: StringWithAggregatesFilter<"User"> | string
    password_hash?: StringWithAggregatesFilter<"User"> | string
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    email_notifications_enabled?: BoolWithAggregatesFilter<"User"> | boolean
    push_notifications_enabled?: BoolWithAggregatesFilter<"User"> | boolean
    last_email_notification_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    last_push_notification_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    last_password_reset_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type PushSubscriptionWhereInput = {
    AND?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    OR?: PushSubscriptionWhereInput[]
    NOT?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    id?: StringFilter<"PushSubscription"> | string
    user_id?: StringFilter<"PushSubscription"> | string
    endpoint?: StringFilter<"PushSubscription"> | string
    p256dh?: StringFilter<"PushSubscription"> | string
    auth?: StringFilter<"PushSubscription"> | string
    created_at?: DateTimeFilter<"PushSubscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type PushSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PushSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    endpoint?: string
    AND?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    OR?: PushSubscriptionWhereInput[]
    NOT?: PushSubscriptionWhereInput | PushSubscriptionWhereInput[]
    user_id?: StringFilter<"PushSubscription"> | string
    p256dh?: StringFilter<"PushSubscription"> | string
    auth?: StringFilter<"PushSubscription"> | string
    created_at?: DateTimeFilter<"PushSubscription"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "endpoint">

  export type PushSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    created_at?: SortOrder
    _count?: PushSubscriptionCountOrderByAggregateInput
    _max?: PushSubscriptionMaxOrderByAggregateInput
    _min?: PushSubscriptionMinOrderByAggregateInput
  }

  export type PushSubscriptionScalarWhereWithAggregatesInput = {
    AND?: PushSubscriptionScalarWhereWithAggregatesInput | PushSubscriptionScalarWhereWithAggregatesInput[]
    OR?: PushSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: PushSubscriptionScalarWhereWithAggregatesInput | PushSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PushSubscription"> | string
    user_id?: StringWithAggregatesFilter<"PushSubscription"> | string
    endpoint?: StringWithAggregatesFilter<"PushSubscription"> | string
    p256dh?: StringWithAggregatesFilter<"PushSubscription"> | string
    auth?: StringWithAggregatesFilter<"PushSubscription"> | string
    created_at?: DateTimeWithAggregatesFilter<"PushSubscription"> | Date | string
  }

  export type PasswordResetTokenWhereInput = {
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    id?: StringFilter<"PasswordResetToken"> | string
    token?: StringFilter<"PasswordResetToken"> | string
    user_id?: StringFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    created_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type PasswordResetTokenOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PasswordResetTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    user_id?: StringFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    created_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type PasswordResetTokenOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    _count?: PasswordResetTokenCountOrderByAggregateInput
    _max?: PasswordResetTokenMaxOrderByAggregateInput
    _min?: PasswordResetTokenMinOrderByAggregateInput
  }

  export type PasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    OR?: PasswordResetTokenScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    token?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    user_id?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    user_id?: StringNullableFilter<"AuditLog"> | string | null
    ip_address?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    details?: StringNullableFilter<"AuditLog"> | string | null
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    user_id?: StringNullableFilter<"AuditLog"> | string | null
    ip_address?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    details?: StringNullableFilter<"AuditLog"> | string | null
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    ip_address?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    user_id?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    ip_address?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type RoomWhereInput = {
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    id?: StringFilter<"Room"> | string
    name?: StringNullableFilter<"Room"> | string | null
    description?: StringNullableFilter<"Room"> | string | null
    capacity?: IntNullableFilter<"Room"> | number | null
    equipment?: StringNullableFilter<"Room"> | string | null
    type?: StringFilter<"Room"> | string
    created_by?: StringNullableFilter<"Room"> | string | null
    created_at?: DateTimeFilter<"Room"> | Date | string
    updated_at?: DateTimeFilter<"Room"> | Date | string
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    participants?: RoomParticipantListRelationFilter
    messages?: MessageListRelationFilter
    invites?: RoomInviteListRelationFilter
  }

  export type RoomOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    capacity?: SortOrderInput | SortOrder
    equipment?: SortOrderInput | SortOrder
    type?: SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    owner?: UserOrderByWithRelationInput
    participants?: RoomParticipantOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    invites?: RoomInviteOrderByRelationAggregateInput
  }

  export type RoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    name?: StringNullableFilter<"Room"> | string | null
    description?: StringNullableFilter<"Room"> | string | null
    capacity?: IntNullableFilter<"Room"> | number | null
    equipment?: StringNullableFilter<"Room"> | string | null
    type?: StringFilter<"Room"> | string
    created_by?: StringNullableFilter<"Room"> | string | null
    created_at?: DateTimeFilter<"Room"> | Date | string
    updated_at?: DateTimeFilter<"Room"> | Date | string
    owner?: XOR<UserNullableRelationFilter, UserWhereInput> | null
    participants?: RoomParticipantListRelationFilter
    messages?: MessageListRelationFilter
    invites?: RoomInviteListRelationFilter
  }, "id">

  export type RoomOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    capacity?: SortOrderInput | SortOrder
    equipment?: SortOrderInput | SortOrder
    type?: SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: RoomCountOrderByAggregateInput
    _avg?: RoomAvgOrderByAggregateInput
    _max?: RoomMaxOrderByAggregateInput
    _min?: RoomMinOrderByAggregateInput
    _sum?: RoomSumOrderByAggregateInput
  }

  export type RoomScalarWhereWithAggregatesInput = {
    AND?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    OR?: RoomScalarWhereWithAggregatesInput[]
    NOT?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Room"> | string
    name?: StringNullableWithAggregatesFilter<"Room"> | string | null
    description?: StringNullableWithAggregatesFilter<"Room"> | string | null
    capacity?: IntNullableWithAggregatesFilter<"Room"> | number | null
    equipment?: StringNullableWithAggregatesFilter<"Room"> | string | null
    type?: StringWithAggregatesFilter<"Room"> | string
    created_by?: StringNullableWithAggregatesFilter<"Room"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Room"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Room"> | Date | string
  }

  export type RoomParticipantWhereInput = {
    AND?: RoomParticipantWhereInput | RoomParticipantWhereInput[]
    OR?: RoomParticipantWhereInput[]
    NOT?: RoomParticipantWhereInput | RoomParticipantWhereInput[]
    id?: StringFilter<"RoomParticipant"> | string
    room_id?: StringFilter<"RoomParticipant"> | string
    user_id?: StringFilter<"RoomParticipant"> | string
    role?: StringFilter<"RoomParticipant"> | string
    joined_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    last_read_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    last_active_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    typing_at?: DateTimeNullableFilter<"RoomParticipant"> | Date | string | null
    room?: XOR<RoomRelationFilter, RoomWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type RoomParticipantOrderByWithRelationInput = {
    id?: SortOrder
    room_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    last_read_at?: SortOrder
    last_active_at?: SortOrder
    typing_at?: SortOrderInput | SortOrder
    room?: RoomOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type RoomParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    room_id_user_id?: RoomParticipantRoom_idUser_idCompoundUniqueInput
    AND?: RoomParticipantWhereInput | RoomParticipantWhereInput[]
    OR?: RoomParticipantWhereInput[]
    NOT?: RoomParticipantWhereInput | RoomParticipantWhereInput[]
    room_id?: StringFilter<"RoomParticipant"> | string
    user_id?: StringFilter<"RoomParticipant"> | string
    role?: StringFilter<"RoomParticipant"> | string
    joined_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    last_read_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    last_active_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    typing_at?: DateTimeNullableFilter<"RoomParticipant"> | Date | string | null
    room?: XOR<RoomRelationFilter, RoomWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "room_id_user_id">

  export type RoomParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    room_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    last_read_at?: SortOrder
    last_active_at?: SortOrder
    typing_at?: SortOrderInput | SortOrder
    _count?: RoomParticipantCountOrderByAggregateInput
    _max?: RoomParticipantMaxOrderByAggregateInput
    _min?: RoomParticipantMinOrderByAggregateInput
  }

  export type RoomParticipantScalarWhereWithAggregatesInput = {
    AND?: RoomParticipantScalarWhereWithAggregatesInput | RoomParticipantScalarWhereWithAggregatesInput[]
    OR?: RoomParticipantScalarWhereWithAggregatesInput[]
    NOT?: RoomParticipantScalarWhereWithAggregatesInput | RoomParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoomParticipant"> | string
    room_id?: StringWithAggregatesFilter<"RoomParticipant"> | string
    user_id?: StringWithAggregatesFilter<"RoomParticipant"> | string
    role?: StringWithAggregatesFilter<"RoomParticipant"> | string
    joined_at?: DateTimeWithAggregatesFilter<"RoomParticipant"> | Date | string
    last_read_at?: DateTimeWithAggregatesFilter<"RoomParticipant"> | Date | string
    last_active_at?: DateTimeWithAggregatesFilter<"RoomParticipant"> | Date | string
    typing_at?: DateTimeNullableWithAggregatesFilter<"RoomParticipant"> | Date | string | null
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    room_id?: StringFilter<"Message"> | string
    sender_id?: StringFilter<"Message"> | string
    content?: StringNullableFilter<"Message"> | string | null
    content_translated?: StringNullableFilter<"Message"> | string | null
    message_type?: StringFilter<"Message"> | string
    file_url?: StringNullableFilter<"Message"> | string | null
    voice_transcription?: StringNullableFilter<"Message"> | string | null
    created_at?: DateTimeFilter<"Message"> | Date | string
    is_edited?: BoolFilter<"Message"> | boolean
    reply_to_id?: StringNullableFilter<"Message"> | string | null
    room?: XOR<RoomRelationFilter, RoomWhereInput>
    sender?: XOR<UserRelationFilter, UserWhereInput>
    reply_to?: XOR<MessageNullableRelationFilter, MessageWhereInput> | null
    replies?: MessageListRelationFilter
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    room_id?: SortOrder
    sender_id?: SortOrder
    content?: SortOrderInput | SortOrder
    content_translated?: SortOrderInput | SortOrder
    message_type?: SortOrder
    file_url?: SortOrderInput | SortOrder
    voice_transcription?: SortOrderInput | SortOrder
    created_at?: SortOrder
    is_edited?: SortOrder
    reply_to_id?: SortOrderInput | SortOrder
    room?: RoomOrderByWithRelationInput
    sender?: UserOrderByWithRelationInput
    reply_to?: MessageOrderByWithRelationInput
    replies?: MessageOrderByRelationAggregateInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    room_id?: StringFilter<"Message"> | string
    sender_id?: StringFilter<"Message"> | string
    content?: StringNullableFilter<"Message"> | string | null
    content_translated?: StringNullableFilter<"Message"> | string | null
    message_type?: StringFilter<"Message"> | string
    file_url?: StringNullableFilter<"Message"> | string | null
    voice_transcription?: StringNullableFilter<"Message"> | string | null
    created_at?: DateTimeFilter<"Message"> | Date | string
    is_edited?: BoolFilter<"Message"> | boolean
    reply_to_id?: StringNullableFilter<"Message"> | string | null
    room?: XOR<RoomRelationFilter, RoomWhereInput>
    sender?: XOR<UserRelationFilter, UserWhereInput>
    reply_to?: XOR<MessageNullableRelationFilter, MessageWhereInput> | null
    replies?: MessageListRelationFilter
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    room_id?: SortOrder
    sender_id?: SortOrder
    content?: SortOrderInput | SortOrder
    content_translated?: SortOrderInput | SortOrder
    message_type?: SortOrder
    file_url?: SortOrderInput | SortOrder
    voice_transcription?: SortOrderInput | SortOrder
    created_at?: SortOrder
    is_edited?: SortOrder
    reply_to_id?: SortOrderInput | SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    room_id?: StringWithAggregatesFilter<"Message"> | string
    sender_id?: StringWithAggregatesFilter<"Message"> | string
    content?: StringNullableWithAggregatesFilter<"Message"> | string | null
    content_translated?: StringNullableWithAggregatesFilter<"Message"> | string | null
    message_type?: StringWithAggregatesFilter<"Message"> | string
    file_url?: StringNullableWithAggregatesFilter<"Message"> | string | null
    voice_transcription?: StringNullableWithAggregatesFilter<"Message"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    is_edited?: BoolWithAggregatesFilter<"Message"> | boolean
    reply_to_id?: StringNullableWithAggregatesFilter<"Message"> | string | null
  }

  export type RoomInviteWhereInput = {
    AND?: RoomInviteWhereInput | RoomInviteWhereInput[]
    OR?: RoomInviteWhereInput[]
    NOT?: RoomInviteWhereInput | RoomInviteWhereInput[]
    id?: StringFilter<"RoomInvite"> | string
    token?: StringFilter<"RoomInvite"> | string
    room_id?: StringFilter<"RoomInvite"> | string
    created_by?: StringFilter<"RoomInvite"> | string
    role?: StringFilter<"RoomInvite"> | string
    expires_at?: DateTimeFilter<"RoomInvite"> | Date | string
    max_uses?: IntFilter<"RoomInvite"> | number
    uses?: IntFilter<"RoomInvite"> | number
    created_at?: DateTimeFilter<"RoomInvite"> | Date | string
    room?: XOR<RoomRelationFilter, RoomWhereInput>
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type RoomInviteOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    room_id?: SortOrder
    created_by?: SortOrder
    role?: SortOrder
    expires_at?: SortOrder
    max_uses?: SortOrder
    uses?: SortOrder
    created_at?: SortOrder
    room?: RoomOrderByWithRelationInput
    creator?: UserOrderByWithRelationInput
  }

  export type RoomInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: RoomInviteWhereInput | RoomInviteWhereInput[]
    OR?: RoomInviteWhereInput[]
    NOT?: RoomInviteWhereInput | RoomInviteWhereInput[]
    room_id?: StringFilter<"RoomInvite"> | string
    created_by?: StringFilter<"RoomInvite"> | string
    role?: StringFilter<"RoomInvite"> | string
    expires_at?: DateTimeFilter<"RoomInvite"> | Date | string
    max_uses?: IntFilter<"RoomInvite"> | number
    uses?: IntFilter<"RoomInvite"> | number
    created_at?: DateTimeFilter<"RoomInvite"> | Date | string
    room?: XOR<RoomRelationFilter, RoomWhereInput>
    creator?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type RoomInviteOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    room_id?: SortOrder
    created_by?: SortOrder
    role?: SortOrder
    expires_at?: SortOrder
    max_uses?: SortOrder
    uses?: SortOrder
    created_at?: SortOrder
    _count?: RoomInviteCountOrderByAggregateInput
    _avg?: RoomInviteAvgOrderByAggregateInput
    _max?: RoomInviteMaxOrderByAggregateInput
    _min?: RoomInviteMinOrderByAggregateInput
    _sum?: RoomInviteSumOrderByAggregateInput
  }

  export type RoomInviteScalarWhereWithAggregatesInput = {
    AND?: RoomInviteScalarWhereWithAggregatesInput | RoomInviteScalarWhereWithAggregatesInput[]
    OR?: RoomInviteScalarWhereWithAggregatesInput[]
    NOT?: RoomInviteScalarWhereWithAggregatesInput | RoomInviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoomInvite"> | string
    token?: StringWithAggregatesFilter<"RoomInvite"> | string
    room_id?: StringWithAggregatesFilter<"RoomInvite"> | string
    created_by?: StringWithAggregatesFilter<"RoomInvite"> | string
    role?: StringWithAggregatesFilter<"RoomInvite"> | string
    expires_at?: DateTimeWithAggregatesFilter<"RoomInvite"> | Date | string
    max_uses?: IntWithAggregatesFilter<"RoomInvite"> | number
    uses?: IntWithAggregatesFilter<"RoomInvite"> | number
    created_at?: DateTimeWithAggregatesFilter<"RoomInvite"> | Date | string
  }

  export type NotificationLogWhereInput = {
    AND?: NotificationLogWhereInput | NotificationLogWhereInput[]
    OR?: NotificationLogWhereInput[]
    NOT?: NotificationLogWhereInput | NotificationLogWhereInput[]
    id?: StringFilter<"NotificationLog"> | string
    user_id?: StringFilter<"NotificationLog"> | string
    email?: StringFilter<"NotificationLog"> | string
    type?: StringFilter<"NotificationLog"> | string
    status?: StringFilter<"NotificationLog"> | string
    error?: StringNullableFilter<"NotificationLog"> | string | null
    sent_at?: DateTimeFilter<"NotificationLog"> | Date | string
    metadata?: StringNullableFilter<"NotificationLog"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type NotificationLogOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    email?: SortOrder
    type?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    sent_at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationLogWhereInput | NotificationLogWhereInput[]
    OR?: NotificationLogWhereInput[]
    NOT?: NotificationLogWhereInput | NotificationLogWhereInput[]
    user_id?: StringFilter<"NotificationLog"> | string
    email?: StringFilter<"NotificationLog"> | string
    type?: StringFilter<"NotificationLog"> | string
    status?: StringFilter<"NotificationLog"> | string
    error?: StringNullableFilter<"NotificationLog"> | string | null
    sent_at?: DateTimeFilter<"NotificationLog"> | Date | string
    metadata?: StringNullableFilter<"NotificationLog"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationLogOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    email?: SortOrder
    type?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    sent_at?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: NotificationLogCountOrderByAggregateInput
    _max?: NotificationLogMaxOrderByAggregateInput
    _min?: NotificationLogMinOrderByAggregateInput
  }

  export type NotificationLogScalarWhereWithAggregatesInput = {
    AND?: NotificationLogScalarWhereWithAggregatesInput | NotificationLogScalarWhereWithAggregatesInput[]
    OR?: NotificationLogScalarWhereWithAggregatesInput[]
    NOT?: NotificationLogScalarWhereWithAggregatesInput | NotificationLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NotificationLog"> | string
    user_id?: StringWithAggregatesFilter<"NotificationLog"> | string
    email?: StringWithAggregatesFilter<"NotificationLog"> | string
    type?: StringWithAggregatesFilter<"NotificationLog"> | string
    status?: StringWithAggregatesFilter<"NotificationLog"> | string
    error?: StringNullableWithAggregatesFilter<"NotificationLog"> | string | null
    sent_at?: DateTimeWithAggregatesFilter<"NotificationLog"> | Date | string
    metadata?: StringNullableWithAggregatesFilter<"NotificationLog"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PushSubscriptionCreateInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutPush_subscriptionsInput
  }

  export type PushSubscriptionUncheckedCreateInput = {
    id?: string
    user_id: string
    endpoint: string
    p256dh: string
    auth: string
    created_at?: Date | string
  }

  export type PushSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPush_subscriptionsNestedInput
  }

  export type PushSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionCreateManyInput = {
    id?: string
    user_id: string
    endpoint: string
    p256dh: string
    auth: string
    created_at?: Date | string
  }

  export type PushSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateInput = {
    id?: string
    token: string
    expires_at: Date | string
    created_at?: Date | string
    user: UserCreateNestedOneWithoutReset_tokensInput
  }

  export type PasswordResetTokenUncheckedCreateInput = {
    id?: string
    token: string
    user_id: string
    expires_at: Date | string
    created_at?: Date | string
  }

  export type PasswordResetTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReset_tokensNestedInput
  }

  export type PasswordResetTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateManyInput = {
    id?: string
    token: string
    user_id: string
    expires_at: Date | string
    created_at?: Date | string
  }

  export type PasswordResetTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    ip_address?: string | null
    action: string
    details?: string | null
    created_at?: Date | string
    user?: UserCreateNestedOneWithoutAudit_logsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    user_id?: string | null
    ip_address?: string | null
    action: string
    details?: string | null
    created_at?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAudit_logsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    user_id?: string | null
    ip_address?: string | null
    action: string
    details?: string | null
    created_at?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomCreateInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
    owner?: UserCreateNestedOneWithoutOwned_roomsInput
    participants?: RoomParticipantCreateNestedManyWithoutRoomInput
    messages?: MessageCreateNestedManyWithoutRoomInput
    invites?: RoomInviteCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    participants?: RoomParticipantUncheckedCreateNestedManyWithoutRoomInput
    messages?: MessageUncheckedCreateNestedManyWithoutRoomInput
    invites?: RoomInviteUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwned_roomsNestedInput
    participants?: RoomParticipantUpdateManyWithoutRoomNestedInput
    messages?: MessageUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: RoomParticipantUncheckedUpdateManyWithoutRoomNestedInput
    messages?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomCreateManyInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type RoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomParticipantCreateInput = {
    id?: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
    room: RoomCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutRoom_participationsInput
  }

  export type RoomParticipantUncheckedCreateInput = {
    id?: string
    room_id: string
    user_id: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
  }

  export type RoomParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: RoomUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutRoom_participationsNestedInput
  }

  export type RoomParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoomParticipantCreateManyInput = {
    id?: string
    room_id: string
    user_id: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
  }

  export type RoomParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoomParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageCreateInput = {
    id?: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    room: RoomCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessages_sentInput
    reply_to?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReply_toInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    room_id: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutReply_toInput
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    room?: RoomUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessages_sentNestedInput
    reply_to?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutReply_toNestedInput
  }

  export type MessageCreateManyInput = {
    id?: string
    room_id: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoomInviteCreateInput = {
    id?: string
    token: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
    room: RoomCreateNestedOneWithoutInvitesInput
    creator: UserCreateNestedOneWithoutCreated_invitesInput
  }

  export type RoomInviteUncheckedCreateInput = {
    id?: string
    token: string
    room_id: string
    created_by: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
  }

  export type RoomInviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: RoomUpdateOneRequiredWithoutInvitesNestedInput
    creator?: UserUpdateOneRequiredWithoutCreated_invitesNestedInput
  }

  export type RoomInviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomInviteCreateManyInput = {
    id?: string
    token: string
    room_id: string
    created_by: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
  }

  export type RoomInviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomInviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationLogCreateInput = {
    id?: string
    email: string
    type?: string
    status: string
    error?: string | null
    sent_at?: Date | string
    metadata?: string | null
    user: UserCreateNestedOneWithoutSent_notificationsInput
  }

  export type NotificationLogUncheckedCreateInput = {
    id?: string
    user_id: string
    email: string
    type?: string
    status: string
    error?: string | null
    sent_at?: Date | string
    metadata?: string | null
  }

  export type NotificationLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSent_notificationsNestedInput
  }

  export type NotificationLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationLogCreateManyInput = {
    id?: string
    user_id: string
    email: string
    type?: string
    status: string
    error?: string | null
    sent_at?: Date | string
    metadata?: string | null
  }

  export type NotificationLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type RoomParticipantListRelationFilter = {
    every?: RoomParticipantWhereInput
    some?: RoomParticipantWhereInput
    none?: RoomParticipantWhereInput
  }

  export type RoomListRelationFilter = {
    every?: RoomWhereInput
    some?: RoomWhereInput
    none?: RoomWhereInput
  }

  export type RoomInviteListRelationFilter = {
    every?: RoomInviteWhereInput
    some?: RoomInviteWhereInput
    none?: RoomInviteWhereInput
  }

  export type NotificationLogListRelationFilter = {
    every?: NotificationLogWhereInput
    some?: NotificationLogWhereInput
    none?: NotificationLogWhereInput
  }

  export type PasswordResetTokenListRelationFilter = {
    every?: PasswordResetTokenWhereInput
    some?: PasswordResetTokenWhereInput
    none?: PasswordResetTokenWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type PushSubscriptionListRelationFilter = {
    every?: PushSubscriptionWhereInput
    some?: PushSubscriptionWhereInput
    none?: PushSubscriptionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomInviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasswordResetTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PushSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    role?: SortOrder
    preferred_language?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    email_notifications_enabled?: SortOrder
    push_notifications_enabled?: SortOrder
    last_email_notification_at?: SortOrder
    last_push_notification_at?: SortOrder
    last_password_reset_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    role?: SortOrder
    preferred_language?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    email_notifications_enabled?: SortOrder
    push_notifications_enabled?: SortOrder
    last_email_notification_at?: SortOrder
    last_push_notification_at?: SortOrder
    last_password_reset_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    role?: SortOrder
    preferred_language?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    email_notifications_enabled?: SortOrder
    push_notifications_enabled?: SortOrder
    last_email_notification_at?: SortOrder
    last_push_notification_at?: SortOrder
    last_password_reset_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PushSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    created_at?: SortOrder
  }

  export type PushSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    created_at?: SortOrder
  }

  export type PushSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    p256dh?: SortOrder
    auth?: SortOrder
    created_at?: SortOrder
  }

  export type PasswordResetTokenCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type PasswordResetTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type PasswordResetTokenMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    user_id?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    ip_address?: SortOrder
    action?: SortOrder
    details?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    ip_address?: SortOrder
    action?: SortOrder
    details?: SortOrder
    created_at?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    ip_address?: SortOrder
    action?: SortOrder
    details?: SortOrder
    created_at?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type RoomCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    capacity?: SortOrder
    equipment?: SortOrder
    type?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type RoomAvgOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type RoomMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    capacity?: SortOrder
    equipment?: SortOrder
    type?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type RoomMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    capacity?: SortOrder
    equipment?: SortOrder
    type?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type RoomSumOrderByAggregateInput = {
    capacity?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type RoomRelationFilter = {
    is?: RoomWhereInput
    isNot?: RoomWhereInput
  }

  export type RoomParticipantRoom_idUser_idCompoundUniqueInput = {
    room_id: string
    user_id: string
  }

  export type RoomParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    room_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    last_read_at?: SortOrder
    last_active_at?: SortOrder
    typing_at?: SortOrder
  }

  export type RoomParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    room_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    last_read_at?: SortOrder
    last_active_at?: SortOrder
    typing_at?: SortOrder
  }

  export type RoomParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    room_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    last_read_at?: SortOrder
    last_active_at?: SortOrder
    typing_at?: SortOrder
  }

  export type MessageNullableRelationFilter = {
    is?: MessageWhereInput | null
    isNot?: MessageWhereInput | null
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    room_id?: SortOrder
    sender_id?: SortOrder
    content?: SortOrder
    content_translated?: SortOrder
    message_type?: SortOrder
    file_url?: SortOrder
    voice_transcription?: SortOrder
    created_at?: SortOrder
    is_edited?: SortOrder
    reply_to_id?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    room_id?: SortOrder
    sender_id?: SortOrder
    content?: SortOrder
    content_translated?: SortOrder
    message_type?: SortOrder
    file_url?: SortOrder
    voice_transcription?: SortOrder
    created_at?: SortOrder
    is_edited?: SortOrder
    reply_to_id?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    room_id?: SortOrder
    sender_id?: SortOrder
    content?: SortOrder
    content_translated?: SortOrder
    message_type?: SortOrder
    file_url?: SortOrder
    voice_transcription?: SortOrder
    created_at?: SortOrder
    is_edited?: SortOrder
    reply_to_id?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type RoomInviteCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    room_id?: SortOrder
    created_by?: SortOrder
    role?: SortOrder
    expires_at?: SortOrder
    max_uses?: SortOrder
    uses?: SortOrder
    created_at?: SortOrder
  }

  export type RoomInviteAvgOrderByAggregateInput = {
    max_uses?: SortOrder
    uses?: SortOrder
  }

  export type RoomInviteMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    room_id?: SortOrder
    created_by?: SortOrder
    role?: SortOrder
    expires_at?: SortOrder
    max_uses?: SortOrder
    uses?: SortOrder
    created_at?: SortOrder
  }

  export type RoomInviteMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    room_id?: SortOrder
    created_by?: SortOrder
    role?: SortOrder
    expires_at?: SortOrder
    max_uses?: SortOrder
    uses?: SortOrder
    created_at?: SortOrder
  }

  export type RoomInviteSumOrderByAggregateInput = {
    max_uses?: SortOrder
    uses?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NotificationLogCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    email?: SortOrder
    type?: SortOrder
    status?: SortOrder
    error?: SortOrder
    sent_at?: SortOrder
    metadata?: SortOrder
  }

  export type NotificationLogMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    email?: SortOrder
    type?: SortOrder
    status?: SortOrder
    error?: SortOrder
    sent_at?: SortOrder
    metadata?: SortOrder
  }

  export type NotificationLogMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    email?: SortOrder
    type?: SortOrder
    status?: SortOrder
    error?: SortOrder
    sent_at?: SortOrder
    metadata?: SortOrder
  }

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type RoomParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<RoomParticipantCreateWithoutUserInput, RoomParticipantUncheckedCreateWithoutUserInput> | RoomParticipantCreateWithoutUserInput[] | RoomParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutUserInput | RoomParticipantCreateOrConnectWithoutUserInput[]
    createMany?: RoomParticipantCreateManyUserInputEnvelope
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
  }

  export type RoomCreateNestedManyWithoutOwnerInput = {
    create?: XOR<RoomCreateWithoutOwnerInput, RoomUncheckedCreateWithoutOwnerInput> | RoomCreateWithoutOwnerInput[] | RoomUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutOwnerInput | RoomCreateOrConnectWithoutOwnerInput[]
    createMany?: RoomCreateManyOwnerInputEnvelope
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
  }

  export type RoomInviteCreateNestedManyWithoutCreatorInput = {
    create?: XOR<RoomInviteCreateWithoutCreatorInput, RoomInviteUncheckedCreateWithoutCreatorInput> | RoomInviteCreateWithoutCreatorInput[] | RoomInviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutCreatorInput | RoomInviteCreateOrConnectWithoutCreatorInput[]
    createMany?: RoomInviteCreateManyCreatorInputEnvelope
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
  }

  export type NotificationLogCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationLogCreateWithoutUserInput, NotificationLogUncheckedCreateWithoutUserInput> | NotificationLogCreateWithoutUserInput[] | NotificationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutUserInput | NotificationLogCreateOrConnectWithoutUserInput[]
    createMany?: NotificationLogCreateManyUserInputEnvelope
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
  }

  export type PasswordResetTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type PushSubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<PushSubscriptionCreateWithoutUserInput, PushSubscriptionUncheckedCreateWithoutUserInput> | PushSubscriptionCreateWithoutUserInput[] | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushSubscriptionCreateOrConnectWithoutUserInput | PushSubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type RoomParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RoomParticipantCreateWithoutUserInput, RoomParticipantUncheckedCreateWithoutUserInput> | RoomParticipantCreateWithoutUserInput[] | RoomParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutUserInput | RoomParticipantCreateOrConnectWithoutUserInput[]
    createMany?: RoomParticipantCreateManyUserInputEnvelope
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
  }

  export type RoomUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<RoomCreateWithoutOwnerInput, RoomUncheckedCreateWithoutOwnerInput> | RoomCreateWithoutOwnerInput[] | RoomUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutOwnerInput | RoomCreateOrConnectWithoutOwnerInput[]
    createMany?: RoomCreateManyOwnerInputEnvelope
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
  }

  export type RoomInviteUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<RoomInviteCreateWithoutCreatorInput, RoomInviteUncheckedCreateWithoutCreatorInput> | RoomInviteCreateWithoutCreatorInput[] | RoomInviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutCreatorInput | RoomInviteCreateOrConnectWithoutCreatorInput[]
    createMany?: RoomInviteCreateManyCreatorInputEnvelope
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
  }

  export type NotificationLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationLogCreateWithoutUserInput, NotificationLogUncheckedCreateWithoutUserInput> | NotificationLogCreateWithoutUserInput[] | NotificationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutUserInput | NotificationLogCreateOrConnectWithoutUserInput[]
    createMany?: NotificationLogCreateManyUserInputEnvelope
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
  }

  export type PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type PushSubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PushSubscriptionCreateWithoutUserInput, PushSubscriptionUncheckedCreateWithoutUserInput> | PushSubscriptionCreateWithoutUserInput[] | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushSubscriptionCreateOrConnectWithoutUserInput | PushSubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type RoomParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<RoomParticipantCreateWithoutUserInput, RoomParticipantUncheckedCreateWithoutUserInput> | RoomParticipantCreateWithoutUserInput[] | RoomParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutUserInput | RoomParticipantCreateOrConnectWithoutUserInput[]
    upsert?: RoomParticipantUpsertWithWhereUniqueWithoutUserInput | RoomParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RoomParticipantCreateManyUserInputEnvelope
    set?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    disconnect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    delete?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    update?: RoomParticipantUpdateWithWhereUniqueWithoutUserInput | RoomParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RoomParticipantUpdateManyWithWhereWithoutUserInput | RoomParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RoomParticipantScalarWhereInput | RoomParticipantScalarWhereInput[]
  }

  export type RoomUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<RoomCreateWithoutOwnerInput, RoomUncheckedCreateWithoutOwnerInput> | RoomCreateWithoutOwnerInput[] | RoomUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutOwnerInput | RoomCreateOrConnectWithoutOwnerInput[]
    upsert?: RoomUpsertWithWhereUniqueWithoutOwnerInput | RoomUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: RoomCreateManyOwnerInputEnvelope
    set?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    disconnect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    delete?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    update?: RoomUpdateWithWhereUniqueWithoutOwnerInput | RoomUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: RoomUpdateManyWithWhereWithoutOwnerInput | RoomUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: RoomScalarWhereInput | RoomScalarWhereInput[]
  }

  export type RoomInviteUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<RoomInviteCreateWithoutCreatorInput, RoomInviteUncheckedCreateWithoutCreatorInput> | RoomInviteCreateWithoutCreatorInput[] | RoomInviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutCreatorInput | RoomInviteCreateOrConnectWithoutCreatorInput[]
    upsert?: RoomInviteUpsertWithWhereUniqueWithoutCreatorInput | RoomInviteUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: RoomInviteCreateManyCreatorInputEnvelope
    set?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    disconnect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    delete?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    update?: RoomInviteUpdateWithWhereUniqueWithoutCreatorInput | RoomInviteUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: RoomInviteUpdateManyWithWhereWithoutCreatorInput | RoomInviteUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: RoomInviteScalarWhereInput | RoomInviteScalarWhereInput[]
  }

  export type NotificationLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationLogCreateWithoutUserInput, NotificationLogUncheckedCreateWithoutUserInput> | NotificationLogCreateWithoutUserInput[] | NotificationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutUserInput | NotificationLogCreateOrConnectWithoutUserInput[]
    upsert?: NotificationLogUpsertWithWhereUniqueWithoutUserInput | NotificationLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationLogCreateManyUserInputEnvelope
    set?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    disconnect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    delete?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    update?: NotificationLogUpdateWithWhereUniqueWithoutUserInput | NotificationLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationLogUpdateManyWithWhereWithoutUserInput | NotificationLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
  }

  export type PasswordResetTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type PushSubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<PushSubscriptionCreateWithoutUserInput, PushSubscriptionUncheckedCreateWithoutUserInput> | PushSubscriptionCreateWithoutUserInput[] | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushSubscriptionCreateOrConnectWithoutUserInput | PushSubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: PushSubscriptionUpsertWithWhereUniqueWithoutUserInput | PushSubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    set?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    disconnect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    delete?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    update?: PushSubscriptionUpdateWithWhereUniqueWithoutUserInput | PushSubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PushSubscriptionUpdateManyWithWhereWithoutUserInput | PushSubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput> | MessageCreateWithoutSenderInput[] | MessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutSenderInput | MessageCreateOrConnectWithoutSenderInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutSenderInput | MessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: MessageCreateManySenderInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutSenderInput | MessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutSenderInput | MessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type RoomParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RoomParticipantCreateWithoutUserInput, RoomParticipantUncheckedCreateWithoutUserInput> | RoomParticipantCreateWithoutUserInput[] | RoomParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutUserInput | RoomParticipantCreateOrConnectWithoutUserInput[]
    upsert?: RoomParticipantUpsertWithWhereUniqueWithoutUserInput | RoomParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RoomParticipantCreateManyUserInputEnvelope
    set?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    disconnect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    delete?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    update?: RoomParticipantUpdateWithWhereUniqueWithoutUserInput | RoomParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RoomParticipantUpdateManyWithWhereWithoutUserInput | RoomParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RoomParticipantScalarWhereInput | RoomParticipantScalarWhereInput[]
  }

  export type RoomUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<RoomCreateWithoutOwnerInput, RoomUncheckedCreateWithoutOwnerInput> | RoomCreateWithoutOwnerInput[] | RoomUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutOwnerInput | RoomCreateOrConnectWithoutOwnerInput[]
    upsert?: RoomUpsertWithWhereUniqueWithoutOwnerInput | RoomUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: RoomCreateManyOwnerInputEnvelope
    set?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    disconnect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    delete?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    update?: RoomUpdateWithWhereUniqueWithoutOwnerInput | RoomUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: RoomUpdateManyWithWhereWithoutOwnerInput | RoomUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: RoomScalarWhereInput | RoomScalarWhereInput[]
  }

  export type RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<RoomInviteCreateWithoutCreatorInput, RoomInviteUncheckedCreateWithoutCreatorInput> | RoomInviteCreateWithoutCreatorInput[] | RoomInviteUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutCreatorInput | RoomInviteCreateOrConnectWithoutCreatorInput[]
    upsert?: RoomInviteUpsertWithWhereUniqueWithoutCreatorInput | RoomInviteUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: RoomInviteCreateManyCreatorInputEnvelope
    set?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    disconnect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    delete?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    update?: RoomInviteUpdateWithWhereUniqueWithoutCreatorInput | RoomInviteUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: RoomInviteUpdateManyWithWhereWithoutCreatorInput | RoomInviteUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: RoomInviteScalarWhereInput | RoomInviteScalarWhereInput[]
  }

  export type NotificationLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationLogCreateWithoutUserInput, NotificationLogUncheckedCreateWithoutUserInput> | NotificationLogCreateWithoutUserInput[] | NotificationLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationLogCreateOrConnectWithoutUserInput | NotificationLogCreateOrConnectWithoutUserInput[]
    upsert?: NotificationLogUpsertWithWhereUniqueWithoutUserInput | NotificationLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationLogCreateManyUserInputEnvelope
    set?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    disconnect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    delete?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    connect?: NotificationLogWhereUniqueInput | NotificationLogWhereUniqueInput[]
    update?: NotificationLogUpdateWithWhereUniqueWithoutUserInput | NotificationLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationLogUpdateManyWithWhereWithoutUserInput | NotificationLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PushSubscriptionCreateWithoutUserInput, PushSubscriptionUncheckedCreateWithoutUserInput> | PushSubscriptionCreateWithoutUserInput[] | PushSubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PushSubscriptionCreateOrConnectWithoutUserInput | PushSubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: PushSubscriptionUpsertWithWhereUniqueWithoutUserInput | PushSubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PushSubscriptionCreateManyUserInputEnvelope
    set?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    disconnect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    delete?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    connect?: PushSubscriptionWhereUniqueInput | PushSubscriptionWhereUniqueInput[]
    update?: PushSubscriptionUpdateWithWhereUniqueWithoutUserInput | PushSubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PushSubscriptionUpdateManyWithWhereWithoutUserInput | PushSubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPush_subscriptionsInput = {
    create?: XOR<UserCreateWithoutPush_subscriptionsInput, UserUncheckedCreateWithoutPush_subscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPush_subscriptionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPush_subscriptionsNestedInput = {
    create?: XOR<UserCreateWithoutPush_subscriptionsInput, UserUncheckedCreateWithoutPush_subscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPush_subscriptionsInput
    upsert?: UserUpsertWithoutPush_subscriptionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPush_subscriptionsInput, UserUpdateWithoutPush_subscriptionsInput>, UserUncheckedUpdateWithoutPush_subscriptionsInput>
  }

  export type UserCreateNestedOneWithoutReset_tokensInput = {
    create?: XOR<UserCreateWithoutReset_tokensInput, UserUncheckedCreateWithoutReset_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutReset_tokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutReset_tokensNestedInput = {
    create?: XOR<UserCreateWithoutReset_tokensInput, UserUncheckedCreateWithoutReset_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutReset_tokensInput
    upsert?: UserUpsertWithoutReset_tokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReset_tokensInput, UserUpdateWithoutReset_tokensInput>, UserUncheckedUpdateWithoutReset_tokensInput>
  }

  export type UserCreateNestedOneWithoutAudit_logsInput = {
    create?: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAudit_logsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutAudit_logsNestedInput = {
    create?: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAudit_logsInput
    upsert?: UserUpsertWithoutAudit_logsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAudit_logsInput, UserUpdateWithoutAudit_logsInput>, UserUncheckedUpdateWithoutAudit_logsInput>
  }

  export type UserCreateNestedOneWithoutOwned_roomsInput = {
    create?: XOR<UserCreateWithoutOwned_roomsInput, UserUncheckedCreateWithoutOwned_roomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwned_roomsInput
    connect?: UserWhereUniqueInput
  }

  export type RoomParticipantCreateNestedManyWithoutRoomInput = {
    create?: XOR<RoomParticipantCreateWithoutRoomInput, RoomParticipantUncheckedCreateWithoutRoomInput> | RoomParticipantCreateWithoutRoomInput[] | RoomParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutRoomInput | RoomParticipantCreateOrConnectWithoutRoomInput[]
    createMany?: RoomParticipantCreateManyRoomInputEnvelope
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutRoomInput = {
    create?: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput> | MessageCreateWithoutRoomInput[] | MessageUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutRoomInput | MessageCreateOrConnectWithoutRoomInput[]
    createMany?: MessageCreateManyRoomInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type RoomInviteCreateNestedManyWithoutRoomInput = {
    create?: XOR<RoomInviteCreateWithoutRoomInput, RoomInviteUncheckedCreateWithoutRoomInput> | RoomInviteCreateWithoutRoomInput[] | RoomInviteUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutRoomInput | RoomInviteCreateOrConnectWithoutRoomInput[]
    createMany?: RoomInviteCreateManyRoomInputEnvelope
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
  }

  export type RoomParticipantUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<RoomParticipantCreateWithoutRoomInput, RoomParticipantUncheckedCreateWithoutRoomInput> | RoomParticipantCreateWithoutRoomInput[] | RoomParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutRoomInput | RoomParticipantCreateOrConnectWithoutRoomInput[]
    createMany?: RoomParticipantCreateManyRoomInputEnvelope
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput> | MessageCreateWithoutRoomInput[] | MessageUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutRoomInput | MessageCreateOrConnectWithoutRoomInput[]
    createMany?: MessageCreateManyRoomInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type RoomInviteUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<RoomInviteCreateWithoutRoomInput, RoomInviteUncheckedCreateWithoutRoomInput> | RoomInviteCreateWithoutRoomInput[] | RoomInviteUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutRoomInput | RoomInviteCreateOrConnectWithoutRoomInput[]
    createMany?: RoomInviteCreateManyRoomInputEnvelope
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutOwned_roomsNestedInput = {
    create?: XOR<UserCreateWithoutOwned_roomsInput, UserUncheckedCreateWithoutOwned_roomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwned_roomsInput
    upsert?: UserUpsertWithoutOwned_roomsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwned_roomsInput, UserUpdateWithoutOwned_roomsInput>, UserUncheckedUpdateWithoutOwned_roomsInput>
  }

  export type RoomParticipantUpdateManyWithoutRoomNestedInput = {
    create?: XOR<RoomParticipantCreateWithoutRoomInput, RoomParticipantUncheckedCreateWithoutRoomInput> | RoomParticipantCreateWithoutRoomInput[] | RoomParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutRoomInput | RoomParticipantCreateOrConnectWithoutRoomInput[]
    upsert?: RoomParticipantUpsertWithWhereUniqueWithoutRoomInput | RoomParticipantUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: RoomParticipantCreateManyRoomInputEnvelope
    set?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    disconnect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    delete?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    update?: RoomParticipantUpdateWithWhereUniqueWithoutRoomInput | RoomParticipantUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: RoomParticipantUpdateManyWithWhereWithoutRoomInput | RoomParticipantUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: RoomParticipantScalarWhereInput | RoomParticipantScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutRoomNestedInput = {
    create?: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput> | MessageCreateWithoutRoomInput[] | MessageUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutRoomInput | MessageCreateOrConnectWithoutRoomInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutRoomInput | MessageUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: MessageCreateManyRoomInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutRoomInput | MessageUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutRoomInput | MessageUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type RoomInviteUpdateManyWithoutRoomNestedInput = {
    create?: XOR<RoomInviteCreateWithoutRoomInput, RoomInviteUncheckedCreateWithoutRoomInput> | RoomInviteCreateWithoutRoomInput[] | RoomInviteUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutRoomInput | RoomInviteCreateOrConnectWithoutRoomInput[]
    upsert?: RoomInviteUpsertWithWhereUniqueWithoutRoomInput | RoomInviteUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: RoomInviteCreateManyRoomInputEnvelope
    set?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    disconnect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    delete?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    update?: RoomInviteUpdateWithWhereUniqueWithoutRoomInput | RoomInviteUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: RoomInviteUpdateManyWithWhereWithoutRoomInput | RoomInviteUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: RoomInviteScalarWhereInput | RoomInviteScalarWhereInput[]
  }

  export type RoomParticipantUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<RoomParticipantCreateWithoutRoomInput, RoomParticipantUncheckedCreateWithoutRoomInput> | RoomParticipantCreateWithoutRoomInput[] | RoomParticipantUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomParticipantCreateOrConnectWithoutRoomInput | RoomParticipantCreateOrConnectWithoutRoomInput[]
    upsert?: RoomParticipantUpsertWithWhereUniqueWithoutRoomInput | RoomParticipantUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: RoomParticipantCreateManyRoomInputEnvelope
    set?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    disconnect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    delete?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    connect?: RoomParticipantWhereUniqueInput | RoomParticipantWhereUniqueInput[]
    update?: RoomParticipantUpdateWithWhereUniqueWithoutRoomInput | RoomParticipantUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: RoomParticipantUpdateManyWithWhereWithoutRoomInput | RoomParticipantUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: RoomParticipantScalarWhereInput | RoomParticipantScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput> | MessageCreateWithoutRoomInput[] | MessageUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutRoomInput | MessageCreateOrConnectWithoutRoomInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutRoomInput | MessageUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: MessageCreateManyRoomInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutRoomInput | MessageUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutRoomInput | MessageUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type RoomInviteUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<RoomInviteCreateWithoutRoomInput, RoomInviteUncheckedCreateWithoutRoomInput> | RoomInviteCreateWithoutRoomInput[] | RoomInviteUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: RoomInviteCreateOrConnectWithoutRoomInput | RoomInviteCreateOrConnectWithoutRoomInput[]
    upsert?: RoomInviteUpsertWithWhereUniqueWithoutRoomInput | RoomInviteUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: RoomInviteCreateManyRoomInputEnvelope
    set?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    disconnect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    delete?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    connect?: RoomInviteWhereUniqueInput | RoomInviteWhereUniqueInput[]
    update?: RoomInviteUpdateWithWhereUniqueWithoutRoomInput | RoomInviteUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: RoomInviteUpdateManyWithWhereWithoutRoomInput | RoomInviteUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: RoomInviteScalarWhereInput | RoomInviteScalarWhereInput[]
  }

  export type RoomCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<RoomCreateWithoutParticipantsInput, RoomUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutParticipantsInput
    connect?: RoomWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutRoom_participationsInput = {
    create?: XOR<UserCreateWithoutRoom_participationsInput, UserUncheckedCreateWithoutRoom_participationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRoom_participationsInput
    connect?: UserWhereUniqueInput
  }

  export type RoomUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<RoomCreateWithoutParticipantsInput, RoomUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutParticipantsInput
    upsert?: RoomUpsertWithoutParticipantsInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutParticipantsInput, RoomUpdateWithoutParticipantsInput>, RoomUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneRequiredWithoutRoom_participationsNestedInput = {
    create?: XOR<UserCreateWithoutRoom_participationsInput, UserUncheckedCreateWithoutRoom_participationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutRoom_participationsInput
    upsert?: UserUpsertWithoutRoom_participationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRoom_participationsInput, UserUpdateWithoutRoom_participationsInput>, UserUncheckedUpdateWithoutRoom_participationsInput>
  }

  export type RoomCreateNestedOneWithoutMessagesInput = {
    create?: XOR<RoomCreateWithoutMessagesInput, RoomUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: RoomCreateOrConnectWithoutMessagesInput
    connect?: RoomWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMessages_sentInput = {
    create?: XOR<UserCreateWithoutMessages_sentInput, UserUncheckedCreateWithoutMessages_sentInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessages_sentInput
    connect?: UserWhereUniqueInput
  }

  export type MessageCreateNestedOneWithoutRepliesInput = {
    create?: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: MessageCreateOrConnectWithoutRepliesInput
    connect?: MessageWhereUniqueInput
  }

  export type MessageCreateNestedManyWithoutReply_toInput = {
    create?: XOR<MessageCreateWithoutReply_toInput, MessageUncheckedCreateWithoutReply_toInput> | MessageCreateWithoutReply_toInput[] | MessageUncheckedCreateWithoutReply_toInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReply_toInput | MessageCreateOrConnectWithoutReply_toInput[]
    createMany?: MessageCreateManyReply_toInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutReply_toInput = {
    create?: XOR<MessageCreateWithoutReply_toInput, MessageUncheckedCreateWithoutReply_toInput> | MessageCreateWithoutReply_toInput[] | MessageUncheckedCreateWithoutReply_toInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReply_toInput | MessageCreateOrConnectWithoutReply_toInput[]
    createMany?: MessageCreateManyReply_toInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type RoomUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<RoomCreateWithoutMessagesInput, RoomUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: RoomCreateOrConnectWithoutMessagesInput
    upsert?: RoomUpsertWithoutMessagesInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutMessagesInput, RoomUpdateWithoutMessagesInput>, RoomUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateOneRequiredWithoutMessages_sentNestedInput = {
    create?: XOR<UserCreateWithoutMessages_sentInput, UserUncheckedCreateWithoutMessages_sentInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessages_sentInput
    upsert?: UserUpsertWithoutMessages_sentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessages_sentInput, UserUpdateWithoutMessages_sentInput>, UserUncheckedUpdateWithoutMessages_sentInput>
  }

  export type MessageUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: MessageCreateOrConnectWithoutRepliesInput
    upsert?: MessageUpsertWithoutRepliesInput
    disconnect?: MessageWhereInput | boolean
    delete?: MessageWhereInput | boolean
    connect?: MessageWhereUniqueInput
    update?: XOR<XOR<MessageUpdateToOneWithWhereWithoutRepliesInput, MessageUpdateWithoutRepliesInput>, MessageUncheckedUpdateWithoutRepliesInput>
  }

  export type MessageUpdateManyWithoutReply_toNestedInput = {
    create?: XOR<MessageCreateWithoutReply_toInput, MessageUncheckedCreateWithoutReply_toInput> | MessageCreateWithoutReply_toInput[] | MessageUncheckedCreateWithoutReply_toInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReply_toInput | MessageCreateOrConnectWithoutReply_toInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReply_toInput | MessageUpsertWithWhereUniqueWithoutReply_toInput[]
    createMany?: MessageCreateManyReply_toInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReply_toInput | MessageUpdateWithWhereUniqueWithoutReply_toInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReply_toInput | MessageUpdateManyWithWhereWithoutReply_toInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutReply_toNestedInput = {
    create?: XOR<MessageCreateWithoutReply_toInput, MessageUncheckedCreateWithoutReply_toInput> | MessageCreateWithoutReply_toInput[] | MessageUncheckedCreateWithoutReply_toInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutReply_toInput | MessageCreateOrConnectWithoutReply_toInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutReply_toInput | MessageUpsertWithWhereUniqueWithoutReply_toInput[]
    createMany?: MessageCreateManyReply_toInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutReply_toInput | MessageUpdateWithWhereUniqueWithoutReply_toInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutReply_toInput | MessageUpdateManyWithWhereWithoutReply_toInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type RoomCreateNestedOneWithoutInvitesInput = {
    create?: XOR<RoomCreateWithoutInvitesInput, RoomUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: RoomCreateOrConnectWithoutInvitesInput
    connect?: RoomWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCreated_invitesInput = {
    create?: XOR<UserCreateWithoutCreated_invitesInput, UserUncheckedCreateWithoutCreated_invitesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreated_invitesInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RoomUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: XOR<RoomCreateWithoutInvitesInput, RoomUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: RoomCreateOrConnectWithoutInvitesInput
    upsert?: RoomUpsertWithoutInvitesInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutInvitesInput, RoomUpdateWithoutInvitesInput>, RoomUncheckedUpdateWithoutInvitesInput>
  }

  export type UserUpdateOneRequiredWithoutCreated_invitesNestedInput = {
    create?: XOR<UserCreateWithoutCreated_invitesInput, UserUncheckedCreateWithoutCreated_invitesInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreated_invitesInput
    upsert?: UserUpsertWithoutCreated_invitesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreated_invitesInput, UserUpdateWithoutCreated_invitesInput>, UserUncheckedUpdateWithoutCreated_invitesInput>
  }

  export type UserCreateNestedOneWithoutSent_notificationsInput = {
    create?: XOR<UserCreateWithoutSent_notificationsInput, UserUncheckedCreateWithoutSent_notificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSent_notificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSent_notificationsNestedInput = {
    create?: XOR<UserCreateWithoutSent_notificationsInput, UserUncheckedCreateWithoutSent_notificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSent_notificationsInput
    upsert?: UserUpsertWithoutSent_notificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSent_notificationsInput, UserUpdateWithoutSent_notificationsInput>, UserUncheckedUpdateWithoutSent_notificationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type MessageCreateWithoutSenderInput = {
    id?: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    room: RoomCreateNestedOneWithoutMessagesInput
    reply_to?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReply_toInput
  }

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string
    room_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutReply_toInput
  }

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[]
  }

  export type RoomParticipantCreateWithoutUserInput = {
    id?: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
    room: RoomCreateNestedOneWithoutParticipantsInput
  }

  export type RoomParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    room_id: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
  }

  export type RoomParticipantCreateOrConnectWithoutUserInput = {
    where: RoomParticipantWhereUniqueInput
    create: XOR<RoomParticipantCreateWithoutUserInput, RoomParticipantUncheckedCreateWithoutUserInput>
  }

  export type RoomParticipantCreateManyUserInputEnvelope = {
    data: RoomParticipantCreateManyUserInput | RoomParticipantCreateManyUserInput[]
  }

  export type RoomCreateWithoutOwnerInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
    participants?: RoomParticipantCreateNestedManyWithoutRoomInput
    messages?: MessageCreateNestedManyWithoutRoomInput
    invites?: RoomInviteCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutOwnerInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
    participants?: RoomParticipantUncheckedCreateNestedManyWithoutRoomInput
    messages?: MessageUncheckedCreateNestedManyWithoutRoomInput
    invites?: RoomInviteUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutOwnerInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutOwnerInput, RoomUncheckedCreateWithoutOwnerInput>
  }

  export type RoomCreateManyOwnerInputEnvelope = {
    data: RoomCreateManyOwnerInput | RoomCreateManyOwnerInput[]
  }

  export type RoomInviteCreateWithoutCreatorInput = {
    id?: string
    token: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
    room: RoomCreateNestedOneWithoutInvitesInput
  }

  export type RoomInviteUncheckedCreateWithoutCreatorInput = {
    id?: string
    token: string
    room_id: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
  }

  export type RoomInviteCreateOrConnectWithoutCreatorInput = {
    where: RoomInviteWhereUniqueInput
    create: XOR<RoomInviteCreateWithoutCreatorInput, RoomInviteUncheckedCreateWithoutCreatorInput>
  }

  export type RoomInviteCreateManyCreatorInputEnvelope = {
    data: RoomInviteCreateManyCreatorInput | RoomInviteCreateManyCreatorInput[]
  }

  export type NotificationLogCreateWithoutUserInput = {
    id?: string
    email: string
    type?: string
    status: string
    error?: string | null
    sent_at?: Date | string
    metadata?: string | null
  }

  export type NotificationLogUncheckedCreateWithoutUserInput = {
    id?: string
    email: string
    type?: string
    status: string
    error?: string | null
    sent_at?: Date | string
    metadata?: string | null
  }

  export type NotificationLogCreateOrConnectWithoutUserInput = {
    where: NotificationLogWhereUniqueInput
    create: XOR<NotificationLogCreateWithoutUserInput, NotificationLogUncheckedCreateWithoutUserInput>
  }

  export type NotificationLogCreateManyUserInputEnvelope = {
    data: NotificationLogCreateManyUserInput | NotificationLogCreateManyUserInput[]
  }

  export type PasswordResetTokenCreateWithoutUserInput = {
    id?: string
    token: string
    expires_at: Date | string
    created_at?: Date | string
  }

  export type PasswordResetTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expires_at: Date | string
    created_at?: Date | string
  }

  export type PasswordResetTokenCreateOrConnectWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenCreateManyUserInputEnvelope = {
    data: PasswordResetTokenCreateManyUserInput | PasswordResetTokenCreateManyUserInput[]
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    ip_address?: string | null
    action: string
    details?: string | null
    created_at?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    ip_address?: string | null
    action: string
    details?: string | null
    created_at?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
  }

  export type PushSubscriptionCreateWithoutUserInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    created_at?: Date | string
  }

  export type PushSubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    created_at?: Date | string
  }

  export type PushSubscriptionCreateOrConnectWithoutUserInput = {
    where: PushSubscriptionWhereUniqueInput
    create: XOR<PushSubscriptionCreateWithoutUserInput, PushSubscriptionUncheckedCreateWithoutUserInput>
  }

  export type PushSubscriptionCreateManyUserInputEnvelope = {
    data: PushSubscriptionCreateManyUserInput | PushSubscriptionCreateManyUserInput[]
  }

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
    create: XOR<MessageCreateWithoutSenderInput, MessageUncheckedCreateWithoutSenderInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutSenderInput, MessageUncheckedUpdateWithoutSenderInput>
  }

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    room_id?: StringFilter<"Message"> | string
    sender_id?: StringFilter<"Message"> | string
    content?: StringNullableFilter<"Message"> | string | null
    content_translated?: StringNullableFilter<"Message"> | string | null
    message_type?: StringFilter<"Message"> | string
    file_url?: StringNullableFilter<"Message"> | string | null
    voice_transcription?: StringNullableFilter<"Message"> | string | null
    created_at?: DateTimeFilter<"Message"> | Date | string
    is_edited?: BoolFilter<"Message"> | boolean
    reply_to_id?: StringNullableFilter<"Message"> | string | null
  }

  export type RoomParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: RoomParticipantWhereUniqueInput
    update: XOR<RoomParticipantUpdateWithoutUserInput, RoomParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<RoomParticipantCreateWithoutUserInput, RoomParticipantUncheckedCreateWithoutUserInput>
  }

  export type RoomParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: RoomParticipantWhereUniqueInput
    data: XOR<RoomParticipantUpdateWithoutUserInput, RoomParticipantUncheckedUpdateWithoutUserInput>
  }

  export type RoomParticipantUpdateManyWithWhereWithoutUserInput = {
    where: RoomParticipantScalarWhereInput
    data: XOR<RoomParticipantUpdateManyMutationInput, RoomParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type RoomParticipantScalarWhereInput = {
    AND?: RoomParticipantScalarWhereInput | RoomParticipantScalarWhereInput[]
    OR?: RoomParticipantScalarWhereInput[]
    NOT?: RoomParticipantScalarWhereInput | RoomParticipantScalarWhereInput[]
    id?: StringFilter<"RoomParticipant"> | string
    room_id?: StringFilter<"RoomParticipant"> | string
    user_id?: StringFilter<"RoomParticipant"> | string
    role?: StringFilter<"RoomParticipant"> | string
    joined_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    last_read_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    last_active_at?: DateTimeFilter<"RoomParticipant"> | Date | string
    typing_at?: DateTimeNullableFilter<"RoomParticipant"> | Date | string | null
  }

  export type RoomUpsertWithWhereUniqueWithoutOwnerInput = {
    where: RoomWhereUniqueInput
    update: XOR<RoomUpdateWithoutOwnerInput, RoomUncheckedUpdateWithoutOwnerInput>
    create: XOR<RoomCreateWithoutOwnerInput, RoomUncheckedCreateWithoutOwnerInput>
  }

  export type RoomUpdateWithWhereUniqueWithoutOwnerInput = {
    where: RoomWhereUniqueInput
    data: XOR<RoomUpdateWithoutOwnerInput, RoomUncheckedUpdateWithoutOwnerInput>
  }

  export type RoomUpdateManyWithWhereWithoutOwnerInput = {
    where: RoomScalarWhereInput
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyWithoutOwnerInput>
  }

  export type RoomScalarWhereInput = {
    AND?: RoomScalarWhereInput | RoomScalarWhereInput[]
    OR?: RoomScalarWhereInput[]
    NOT?: RoomScalarWhereInput | RoomScalarWhereInput[]
    id?: StringFilter<"Room"> | string
    name?: StringNullableFilter<"Room"> | string | null
    description?: StringNullableFilter<"Room"> | string | null
    capacity?: IntNullableFilter<"Room"> | number | null
    equipment?: StringNullableFilter<"Room"> | string | null
    type?: StringFilter<"Room"> | string
    created_by?: StringNullableFilter<"Room"> | string | null
    created_at?: DateTimeFilter<"Room"> | Date | string
    updated_at?: DateTimeFilter<"Room"> | Date | string
  }

  export type RoomInviteUpsertWithWhereUniqueWithoutCreatorInput = {
    where: RoomInviteWhereUniqueInput
    update: XOR<RoomInviteUpdateWithoutCreatorInput, RoomInviteUncheckedUpdateWithoutCreatorInput>
    create: XOR<RoomInviteCreateWithoutCreatorInput, RoomInviteUncheckedCreateWithoutCreatorInput>
  }

  export type RoomInviteUpdateWithWhereUniqueWithoutCreatorInput = {
    where: RoomInviteWhereUniqueInput
    data: XOR<RoomInviteUpdateWithoutCreatorInput, RoomInviteUncheckedUpdateWithoutCreatorInput>
  }

  export type RoomInviteUpdateManyWithWhereWithoutCreatorInput = {
    where: RoomInviteScalarWhereInput
    data: XOR<RoomInviteUpdateManyMutationInput, RoomInviteUncheckedUpdateManyWithoutCreatorInput>
  }

  export type RoomInviteScalarWhereInput = {
    AND?: RoomInviteScalarWhereInput | RoomInviteScalarWhereInput[]
    OR?: RoomInviteScalarWhereInput[]
    NOT?: RoomInviteScalarWhereInput | RoomInviteScalarWhereInput[]
    id?: StringFilter<"RoomInvite"> | string
    token?: StringFilter<"RoomInvite"> | string
    room_id?: StringFilter<"RoomInvite"> | string
    created_by?: StringFilter<"RoomInvite"> | string
    role?: StringFilter<"RoomInvite"> | string
    expires_at?: DateTimeFilter<"RoomInvite"> | Date | string
    max_uses?: IntFilter<"RoomInvite"> | number
    uses?: IntFilter<"RoomInvite"> | number
    created_at?: DateTimeFilter<"RoomInvite"> | Date | string
  }

  export type NotificationLogUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationLogWhereUniqueInput
    update: XOR<NotificationLogUpdateWithoutUserInput, NotificationLogUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationLogCreateWithoutUserInput, NotificationLogUncheckedCreateWithoutUserInput>
  }

  export type NotificationLogUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationLogWhereUniqueInput
    data: XOR<NotificationLogUpdateWithoutUserInput, NotificationLogUncheckedUpdateWithoutUserInput>
  }

  export type NotificationLogUpdateManyWithWhereWithoutUserInput = {
    where: NotificationLogScalarWhereInput
    data: XOR<NotificationLogUpdateManyMutationInput, NotificationLogUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationLogScalarWhereInput = {
    AND?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
    OR?: NotificationLogScalarWhereInput[]
    NOT?: NotificationLogScalarWhereInput | NotificationLogScalarWhereInput[]
    id?: StringFilter<"NotificationLog"> | string
    user_id?: StringFilter<"NotificationLog"> | string
    email?: StringFilter<"NotificationLog"> | string
    type?: StringFilter<"NotificationLog"> | string
    status?: StringFilter<"NotificationLog"> | string
    error?: StringNullableFilter<"NotificationLog"> | string | null
    sent_at?: DateTimeFilter<"NotificationLog"> | Date | string
    metadata?: StringNullableFilter<"NotificationLog"> | string | null
  }

  export type PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    update: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    data: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetTokenScalarWhereInput
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetTokenScalarWhereInput = {
    AND?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    OR?: PasswordResetTokenScalarWhereInput[]
    NOT?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    id?: StringFilter<"PasswordResetToken"> | string
    token?: StringFilter<"PasswordResetToken"> | string
    user_id?: StringFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    created_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    user_id?: StringNullableFilter<"AuditLog"> | string | null
    ip_address?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    details?: StringNullableFilter<"AuditLog"> | string | null
    created_at?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type PushSubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: PushSubscriptionWhereUniqueInput
    update: XOR<PushSubscriptionUpdateWithoutUserInput, PushSubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<PushSubscriptionCreateWithoutUserInput, PushSubscriptionUncheckedCreateWithoutUserInput>
  }

  export type PushSubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: PushSubscriptionWhereUniqueInput
    data: XOR<PushSubscriptionUpdateWithoutUserInput, PushSubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type PushSubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: PushSubscriptionScalarWhereInput
    data: XOR<PushSubscriptionUpdateManyMutationInput, PushSubscriptionUncheckedUpdateManyWithoutUserInput>
  }

  export type PushSubscriptionScalarWhereInput = {
    AND?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
    OR?: PushSubscriptionScalarWhereInput[]
    NOT?: PushSubscriptionScalarWhereInput | PushSubscriptionScalarWhereInput[]
    id?: StringFilter<"PushSubscription"> | string
    user_id?: StringFilter<"PushSubscription"> | string
    endpoint?: StringFilter<"PushSubscription"> | string
    p256dh?: StringFilter<"PushSubscription"> | string
    auth?: StringFilter<"PushSubscription"> | string
    created_at?: DateTimeFilter<"PushSubscription"> | Date | string
  }

  export type UserCreateWithoutPush_subscriptionsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPush_subscriptionsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPush_subscriptionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPush_subscriptionsInput, UserUncheckedCreateWithoutPush_subscriptionsInput>
  }

  export type UserUpsertWithoutPush_subscriptionsInput = {
    update: XOR<UserUpdateWithoutPush_subscriptionsInput, UserUncheckedUpdateWithoutPush_subscriptionsInput>
    create: XOR<UserCreateWithoutPush_subscriptionsInput, UserUncheckedCreateWithoutPush_subscriptionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPush_subscriptionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPush_subscriptionsInput, UserUncheckedUpdateWithoutPush_subscriptionsInput>
  }

  export type UserUpdateWithoutPush_subscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPush_subscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutReset_tokensInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReset_tokensInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReset_tokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReset_tokensInput, UserUncheckedCreateWithoutReset_tokensInput>
  }

  export type UserUpsertWithoutReset_tokensInput = {
    update: XOR<UserUpdateWithoutReset_tokensInput, UserUncheckedUpdateWithoutReset_tokensInput>
    create: XOR<UserCreateWithoutReset_tokensInput, UserUncheckedCreateWithoutReset_tokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReset_tokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReset_tokensInput, UserUncheckedUpdateWithoutReset_tokensInput>
  }

  export type UserUpdateWithoutReset_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReset_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAudit_logsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAudit_logsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAudit_logsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
  }

  export type UserUpsertWithoutAudit_logsInput = {
    update: XOR<UserUpdateWithoutAudit_logsInput, UserUncheckedUpdateWithoutAudit_logsInput>
    create: XOR<UserCreateWithoutAudit_logsInput, UserUncheckedCreateWithoutAudit_logsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAudit_logsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAudit_logsInput, UserUncheckedUpdateWithoutAudit_logsInput>
  }

  export type UserUpdateWithoutAudit_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAudit_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOwned_roomsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwned_roomsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwned_roomsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwned_roomsInput, UserUncheckedCreateWithoutOwned_roomsInput>
  }

  export type RoomParticipantCreateWithoutRoomInput = {
    id?: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
    user: UserCreateNestedOneWithoutRoom_participationsInput
  }

  export type RoomParticipantUncheckedCreateWithoutRoomInput = {
    id?: string
    user_id: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
  }

  export type RoomParticipantCreateOrConnectWithoutRoomInput = {
    where: RoomParticipantWhereUniqueInput
    create: XOR<RoomParticipantCreateWithoutRoomInput, RoomParticipantUncheckedCreateWithoutRoomInput>
  }

  export type RoomParticipantCreateManyRoomInputEnvelope = {
    data: RoomParticipantCreateManyRoomInput | RoomParticipantCreateManyRoomInput[]
  }

  export type MessageCreateWithoutRoomInput = {
    id?: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    sender: UserCreateNestedOneWithoutMessages_sentInput
    reply_to?: MessageCreateNestedOneWithoutRepliesInput
    replies?: MessageCreateNestedManyWithoutReply_toInput
  }

  export type MessageUncheckedCreateWithoutRoomInput = {
    id?: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
    replies?: MessageUncheckedCreateNestedManyWithoutReply_toInput
  }

  export type MessageCreateOrConnectWithoutRoomInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput>
  }

  export type MessageCreateManyRoomInputEnvelope = {
    data: MessageCreateManyRoomInput | MessageCreateManyRoomInput[]
  }

  export type RoomInviteCreateWithoutRoomInput = {
    id?: string
    token: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
    creator: UserCreateNestedOneWithoutCreated_invitesInput
  }

  export type RoomInviteUncheckedCreateWithoutRoomInput = {
    id?: string
    token: string
    created_by: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
  }

  export type RoomInviteCreateOrConnectWithoutRoomInput = {
    where: RoomInviteWhereUniqueInput
    create: XOR<RoomInviteCreateWithoutRoomInput, RoomInviteUncheckedCreateWithoutRoomInput>
  }

  export type RoomInviteCreateManyRoomInputEnvelope = {
    data: RoomInviteCreateManyRoomInput | RoomInviteCreateManyRoomInput[]
  }

  export type UserUpsertWithoutOwned_roomsInput = {
    update: XOR<UserUpdateWithoutOwned_roomsInput, UserUncheckedUpdateWithoutOwned_roomsInput>
    create: XOR<UserCreateWithoutOwned_roomsInput, UserUncheckedCreateWithoutOwned_roomsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwned_roomsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwned_roomsInput, UserUncheckedUpdateWithoutOwned_roomsInput>
  }

  export type UserUpdateWithoutOwned_roomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwned_roomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoomParticipantUpsertWithWhereUniqueWithoutRoomInput = {
    where: RoomParticipantWhereUniqueInput
    update: XOR<RoomParticipantUpdateWithoutRoomInput, RoomParticipantUncheckedUpdateWithoutRoomInput>
    create: XOR<RoomParticipantCreateWithoutRoomInput, RoomParticipantUncheckedCreateWithoutRoomInput>
  }

  export type RoomParticipantUpdateWithWhereUniqueWithoutRoomInput = {
    where: RoomParticipantWhereUniqueInput
    data: XOR<RoomParticipantUpdateWithoutRoomInput, RoomParticipantUncheckedUpdateWithoutRoomInput>
  }

  export type RoomParticipantUpdateManyWithWhereWithoutRoomInput = {
    where: RoomParticipantScalarWhereInput
    data: XOR<RoomParticipantUpdateManyMutationInput, RoomParticipantUncheckedUpdateManyWithoutRoomInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutRoomInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutRoomInput, MessageUncheckedUpdateWithoutRoomInput>
    create: XOR<MessageCreateWithoutRoomInput, MessageUncheckedCreateWithoutRoomInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutRoomInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutRoomInput, MessageUncheckedUpdateWithoutRoomInput>
  }

  export type MessageUpdateManyWithWhereWithoutRoomInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutRoomInput>
  }

  export type RoomInviteUpsertWithWhereUniqueWithoutRoomInput = {
    where: RoomInviteWhereUniqueInput
    update: XOR<RoomInviteUpdateWithoutRoomInput, RoomInviteUncheckedUpdateWithoutRoomInput>
    create: XOR<RoomInviteCreateWithoutRoomInput, RoomInviteUncheckedCreateWithoutRoomInput>
  }

  export type RoomInviteUpdateWithWhereUniqueWithoutRoomInput = {
    where: RoomInviteWhereUniqueInput
    data: XOR<RoomInviteUpdateWithoutRoomInput, RoomInviteUncheckedUpdateWithoutRoomInput>
  }

  export type RoomInviteUpdateManyWithWhereWithoutRoomInput = {
    where: RoomInviteScalarWhereInput
    data: XOR<RoomInviteUpdateManyMutationInput, RoomInviteUncheckedUpdateManyWithoutRoomInput>
  }

  export type RoomCreateWithoutParticipantsInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
    owner?: UserCreateNestedOneWithoutOwned_roomsInput
    messages?: MessageCreateNestedManyWithoutRoomInput
    invites?: RoomInviteCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutParticipantsInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutRoomInput
    invites?: RoomInviteUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutParticipantsInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutParticipantsInput, RoomUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutRoom_participationsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoom_participationsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoom_participationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoom_participationsInput, UserUncheckedCreateWithoutRoom_participationsInput>
  }

  export type RoomUpsertWithoutParticipantsInput = {
    update: XOR<RoomUpdateWithoutParticipantsInput, RoomUncheckedUpdateWithoutParticipantsInput>
    create: XOR<RoomCreateWithoutParticipantsInput, RoomUncheckedCreateWithoutParticipantsInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutParticipantsInput, RoomUncheckedUpdateWithoutParticipantsInput>
  }

  export type RoomUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwned_roomsNestedInput
    messages?: MessageUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type UserUpsertWithoutRoom_participationsInput = {
    update: XOR<UserUpdateWithoutRoom_participationsInput, UserUncheckedUpdateWithoutRoom_participationsInput>
    create: XOR<UserCreateWithoutRoom_participationsInput, UserUncheckedCreateWithoutRoom_participationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRoom_participationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRoom_participationsInput, UserUncheckedUpdateWithoutRoom_participationsInput>
  }

  export type UserUpdateWithoutRoom_participationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoom_participationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoomCreateWithoutMessagesInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
    owner?: UserCreateNestedOneWithoutOwned_roomsInput
    participants?: RoomParticipantCreateNestedManyWithoutRoomInput
    invites?: RoomInviteCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutMessagesInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    participants?: RoomParticipantUncheckedCreateNestedManyWithoutRoomInput
    invites?: RoomInviteUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutMessagesInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutMessagesInput, RoomUncheckedCreateWithoutMessagesInput>
  }

  export type UserCreateWithoutMessages_sentInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessages_sentInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessages_sentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessages_sentInput, UserUncheckedCreateWithoutMessages_sentInput>
  }

  export type MessageCreateWithoutRepliesInput = {
    id?: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    room: RoomCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessages_sentInput
    reply_to?: MessageCreateNestedOneWithoutRepliesInput
  }

  export type MessageUncheckedCreateWithoutRepliesInput = {
    id?: string
    room_id: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
  }

  export type MessageCreateOrConnectWithoutRepliesInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
  }

  export type MessageCreateWithoutReply_toInput = {
    id?: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    room: RoomCreateNestedOneWithoutMessagesInput
    sender: UserCreateNestedOneWithoutMessages_sentInput
    replies?: MessageCreateNestedManyWithoutReply_toInput
  }

  export type MessageUncheckedCreateWithoutReply_toInput = {
    id?: string
    room_id: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    replies?: MessageUncheckedCreateNestedManyWithoutReply_toInput
  }

  export type MessageCreateOrConnectWithoutReply_toInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutReply_toInput, MessageUncheckedCreateWithoutReply_toInput>
  }

  export type MessageCreateManyReply_toInputEnvelope = {
    data: MessageCreateManyReply_toInput | MessageCreateManyReply_toInput[]
  }

  export type RoomUpsertWithoutMessagesInput = {
    update: XOR<RoomUpdateWithoutMessagesInput, RoomUncheckedUpdateWithoutMessagesInput>
    create: XOR<RoomCreateWithoutMessagesInput, RoomUncheckedCreateWithoutMessagesInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutMessagesInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutMessagesInput, RoomUncheckedUpdateWithoutMessagesInput>
  }

  export type RoomUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwned_roomsNestedInput
    participants?: RoomParticipantUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: RoomParticipantUncheckedUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type UserUpsertWithoutMessages_sentInput = {
    update: XOR<UserUpdateWithoutMessages_sentInput, UserUncheckedUpdateWithoutMessages_sentInput>
    create: XOR<UserCreateWithoutMessages_sentInput, UserUncheckedCreateWithoutMessages_sentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessages_sentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessages_sentInput, UserUncheckedUpdateWithoutMessages_sentInput>
  }

  export type UserUpdateWithoutMessages_sentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessages_sentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MessageUpsertWithoutRepliesInput = {
    update: XOR<MessageUpdateWithoutRepliesInput, MessageUncheckedUpdateWithoutRepliesInput>
    create: XOR<MessageCreateWithoutRepliesInput, MessageUncheckedCreateWithoutRepliesInput>
    where?: MessageWhereInput
  }

  export type MessageUpdateToOneWithWhereWithoutRepliesInput = {
    where?: MessageWhereInput
    data: XOR<MessageUpdateWithoutRepliesInput, MessageUncheckedUpdateWithoutRepliesInput>
  }

  export type MessageUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    room?: RoomUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessages_sentNestedInput
    reply_to?: MessageUpdateOneWithoutRepliesNestedInput
  }

  export type MessageUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MessageUpsertWithWhereUniqueWithoutReply_toInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutReply_toInput, MessageUncheckedUpdateWithoutReply_toInput>
    create: XOR<MessageCreateWithoutReply_toInput, MessageUncheckedCreateWithoutReply_toInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutReply_toInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutReply_toInput, MessageUncheckedUpdateWithoutReply_toInput>
  }

  export type MessageUpdateManyWithWhereWithoutReply_toInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutReply_toInput>
  }

  export type RoomCreateWithoutInvitesInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
    owner?: UserCreateNestedOneWithoutOwned_roomsInput
    participants?: RoomParticipantCreateNestedManyWithoutRoomInput
    messages?: MessageCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutInvitesInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_by?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    participants?: RoomParticipantUncheckedCreateNestedManyWithoutRoomInput
    messages?: MessageUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutInvitesInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutInvitesInput, RoomUncheckedCreateWithoutInvitesInput>
  }

  export type UserCreateWithoutCreated_invitesInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    sent_notifications?: NotificationLogCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreated_invitesInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    sent_notifications?: NotificationLogUncheckedCreateNestedManyWithoutUserInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreated_invitesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreated_invitesInput, UserUncheckedCreateWithoutCreated_invitesInput>
  }

  export type RoomUpsertWithoutInvitesInput = {
    update: XOR<RoomUpdateWithoutInvitesInput, RoomUncheckedUpdateWithoutInvitesInput>
    create: XOR<RoomCreateWithoutInvitesInput, RoomUncheckedCreateWithoutInvitesInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutInvitesInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutInvitesInput, RoomUncheckedUpdateWithoutInvitesInput>
  }

  export type RoomUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwned_roomsNestedInput
    participants?: RoomParticipantUpdateManyWithoutRoomNestedInput
    messages?: MessageUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: RoomParticipantUncheckedUpdateManyWithoutRoomNestedInput
    messages?: MessageUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type UserUpsertWithoutCreated_invitesInput = {
    update: XOR<UserUpdateWithoutCreated_invitesInput, UserUncheckedUpdateWithoutCreated_invitesInput>
    create: XOR<UserCreateWithoutCreated_invitesInput, UserUncheckedCreateWithoutCreated_invitesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreated_invitesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreated_invitesInput, UserUncheckedUpdateWithoutCreated_invitesInput>
  }

  export type UserUpdateWithoutCreated_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    sent_notifications?: NotificationLogUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreated_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    sent_notifications?: NotificationLogUncheckedUpdateManyWithoutUserNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSent_notificationsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantCreateNestedManyWithoutUserInput
    owned_rooms?: RoomCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteCreateNestedManyWithoutCreatorInput
    reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSent_notificationsInput = {
    id?: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    role?: string
    preferred_language?: string
    password_hash?: string
    created_at?: Date | string
    email_notifications_enabled?: boolean
    push_notifications_enabled?: boolean
    last_email_notification_at?: Date | string | null
    last_push_notification_at?: Date | string | null
    last_password_reset_at?: Date | string | null
    messages_sent?: MessageUncheckedCreateNestedManyWithoutSenderInput
    room_participations?: RoomParticipantUncheckedCreateNestedManyWithoutUserInput
    owned_rooms?: RoomUncheckedCreateNestedManyWithoutOwnerInput
    created_invites?: RoomInviteUncheckedCreateNestedManyWithoutCreatorInput
    reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    audit_logs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    push_subscriptions?: PushSubscriptionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSent_notificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSent_notificationsInput, UserUncheckedCreateWithoutSent_notificationsInput>
  }

  export type UserUpsertWithoutSent_notificationsInput = {
    update: XOR<UserUpdateWithoutSent_notificationsInput, UserUncheckedUpdateWithoutSent_notificationsInput>
    create: XOR<UserCreateWithoutSent_notificationsInput, UserUncheckedCreateWithoutSent_notificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSent_notificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSent_notificationsInput, UserUncheckedUpdateWithoutSent_notificationsInput>
  }

  export type UserUpdateWithoutSent_notificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUpdateManyWithoutCreatorNestedInput
    reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSent_notificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferred_language?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    email_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    push_notifications_enabled?: BoolFieldUpdateOperationsInput | boolean
    last_email_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_push_notification_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_password_reset_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    messages_sent?: MessageUncheckedUpdateManyWithoutSenderNestedInput
    room_participations?: RoomParticipantUncheckedUpdateManyWithoutUserNestedInput
    owned_rooms?: RoomUncheckedUpdateManyWithoutOwnerNestedInput
    created_invites?: RoomInviteUncheckedUpdateManyWithoutCreatorNestedInput
    reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    audit_logs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    push_subscriptions?: PushSubscriptionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MessageCreateManySenderInput = {
    id?: string
    room_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
  }

  export type RoomParticipantCreateManyUserInput = {
    id?: string
    room_id: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
  }

  export type RoomCreateManyOwnerInput = {
    id?: string
    name?: string | null
    description?: string | null
    capacity?: number | null
    equipment?: string | null
    type?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type RoomInviteCreateManyCreatorInput = {
    id?: string
    token: string
    room_id: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
  }

  export type NotificationLogCreateManyUserInput = {
    id?: string
    email: string
    type?: string
    status: string
    error?: string | null
    sent_at?: Date | string
    metadata?: string | null
  }

  export type PasswordResetTokenCreateManyUserInput = {
    id?: string
    token: string
    expires_at: Date | string
    created_at?: Date | string
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    ip_address?: string | null
    action: string
    details?: string | null
    created_at?: Date | string
  }

  export type PushSubscriptionCreateManyUserInput = {
    id?: string
    endpoint: string
    p256dh: string
    auth: string
    created_at?: Date | string
  }

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    room?: RoomUpdateOneRequiredWithoutMessagesNestedInput
    reply_to?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoomParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: RoomUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type RoomParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoomParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoomUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: RoomParticipantUpdateManyWithoutRoomNestedInput
    messages?: MessageUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: RoomParticipantUncheckedUpdateManyWithoutRoomNestedInput
    messages?: MessageUncheckedUpdateManyWithoutRoomNestedInput
    invites?: RoomInviteUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    equipment?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomInviteUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: RoomUpdateOneRequiredWithoutInvitesNestedInput
  }

  export type RoomInviteUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomInviteUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PasswordResetTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PushSubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    p256dh?: StringFieldUpdateOperationsInput | string
    auth?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomParticipantCreateManyRoomInput = {
    id?: string
    user_id: string
    role?: string
    joined_at?: Date | string
    last_read_at?: Date | string
    last_active_at?: Date | string
    typing_at?: Date | string | null
  }

  export type MessageCreateManyRoomInput = {
    id?: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
    reply_to_id?: string | null
  }

  export type RoomInviteCreateManyRoomInput = {
    id?: string
    token: string
    created_by: string
    role?: string
    expires_at: Date | string
    max_uses?: number
    uses?: number
    created_at?: Date | string
  }

  export type RoomParticipantUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutRoom_participationsNestedInput
  }

  export type RoomParticipantUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RoomParticipantUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_read_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_active_at?: DateTimeFieldUpdateOperationsInput | Date | string
    typing_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MessageUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    sender?: UserUpdateOneRequiredWithoutMessages_sentNestedInput
    reply_to?: MessageUpdateOneWithoutRepliesNestedInput
    replies?: MessageUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
    replies?: MessageUncheckedUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    reply_to_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoomInviteUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneRequiredWithoutCreated_invitesNestedInput
  }

  export type RoomInviteUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomInviteUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_by?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    max_uses?: IntFieldUpdateOperationsInput | number
    uses?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyReply_toInput = {
    id?: string
    room_id: string
    sender_id: string
    content?: string | null
    content_translated?: string | null
    message_type?: string
    file_url?: string | null
    voice_transcription?: string | null
    created_at?: Date | string
    is_edited?: boolean
  }

  export type MessageUpdateWithoutReply_toInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    room?: RoomUpdateOneRequiredWithoutMessagesNestedInput
    sender?: UserUpdateOneRequiredWithoutMessages_sentNestedInput
    replies?: MessageUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateWithoutReply_toInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
    replies?: MessageUncheckedUpdateManyWithoutReply_toNestedInput
  }

  export type MessageUncheckedUpdateManyWithoutReply_toInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    sender_id?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content_translated?: NullableStringFieldUpdateOperationsInput | string | null
    message_type?: StringFieldUpdateOperationsInput | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    voice_transcription?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_edited?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoomCountOutputTypeDefaultArgs instead
     */
    export type RoomCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoomCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MessageCountOutputTypeDefaultArgs instead
     */
    export type MessageCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MessageCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PushSubscriptionDefaultArgs instead
     */
    export type PushSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PushSubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PasswordResetTokenDefaultArgs instead
     */
    export type PasswordResetTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PasswordResetTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditLogDefaultArgs instead
     */
    export type AuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoomDefaultArgs instead
     */
    export type RoomArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoomDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoomParticipantDefaultArgs instead
     */
    export type RoomParticipantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoomParticipantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MessageDefaultArgs instead
     */
    export type MessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoomInviteDefaultArgs instead
     */
    export type RoomInviteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoomInviteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationLogDefaultArgs instead
     */
    export type NotificationLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
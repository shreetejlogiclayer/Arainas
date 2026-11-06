import session from "express-session";

const DEFAULT_SESSION_TTL = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL = 15 * 60 * 1000;

const getExpiration = (sessionData) => {
  if (sessionData.cookie?.expires) {
    return new Date(sessionData.cookie.expires);
  }
  return new Date(Date.now() + (sessionData.cookie?.maxAge ?? DEFAULT_SESSION_TTL));
};

export class PrismaSessionStore extends session.Store {
  constructor(prisma) {
    super();
    this.prisma = prisma;
    this.cleanupInterval = setInterval(() => {
      this.prisma.session
        .deleteMany({ where: { expiresAt: { lte: new Date() } } })
        .catch((error) => console.error("Failed to remove expired sessions:", error));
    }, CLEANUP_INTERVAL);
    this.cleanupInterval.unref();
  }

  get(sid, callback) {
    this.prisma.session
      .findUnique({ where: { sid } })
      .then(async (record) => {
        if (!record) return callback(null, null);
        if (record.expiresAt <= new Date()) {
          await this.prisma.session.deleteMany({ where: { sid } });
          return callback(null, null);
        }
        callback(null, JSON.parse(record.data));
      })
      .catch(callback);
  }

  set(sid, sessionData, callback) {
    const data = JSON.stringify(sessionData);
    const expiresAt = getExpiration(sessionData);
    this.prisma.session
      .upsert({
        where: { sid },
        create: { sid, data, expiresAt },
        update: { data, expiresAt },
      })
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  touch(sid, sessionData, callback) {
    this.prisma.session
      .updateMany({
        where: { sid },
        data: { expiresAt: getExpiration(sessionData) },
      })
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  destroy(sid, callback) {
    this.prisma.session
      .deleteMany({ where: { sid } })
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  clear(callback) {
    this.prisma.session
      .deleteMany()
      .then(() => callback?.(null))
      .catch((error) => callback?.(error));
  }

  length(callback) {
    this.prisma.session
      .count({ where: { expiresAt: { gt: new Date() } } })
      .then((count) => callback(null, count))
      .catch(callback);
  }

  all(callback) {
    this.prisma.session
      .findMany({ where: { expiresAt: { gt: new Date() } } })
      .then((records) =>
        callback(
          null,
          records.map((record) => JSON.parse(record.data)),
        ),
      )
      .catch(callback);
  }
}

const platformPort = process.env.PORT;
process.env.NODE_ENV ||= "production";
const { startServer } = await import("./server/src/index.js");

startServer(platformPort);

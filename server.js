const platformPort = process.env.PORT;
const { startServer } = await import("./server/src/index.js");

startServer(platformPort);

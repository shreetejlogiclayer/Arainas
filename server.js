process.env.NODE_ENV = "production";
const platformPort = process.env.PORT;

async function start() {
  const { app, initializeDatabase, registerHttpServer } = await import(
    "./server/src/index.js"
  );
  const PORT = Number(platformPort || 3000);

  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT must be a valid TCP port");
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
    void initializeDatabase();
  });

  registerHttpServer(server);
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

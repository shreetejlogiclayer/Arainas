const platformPort = process.env.PORT;
process.env.NODE_ENV ||= "production";
const { app, initializeDatabase, registerHttpServer } = await import(
  "./server/src/index.js"
);
const PORT = Number(platformPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("Hostinger PORT variable is missing or invalid");
}

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
  void initializeDatabase();
});

registerHttpServer(server);

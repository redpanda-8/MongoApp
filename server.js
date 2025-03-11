const app = require("./src/app");

const PORT = process.env.PORT || 999;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

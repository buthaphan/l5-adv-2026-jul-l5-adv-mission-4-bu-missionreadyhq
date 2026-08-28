import app from "./server.js";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error("An unexpected server error occurred:", error);
  }
  process.exit(1);
});

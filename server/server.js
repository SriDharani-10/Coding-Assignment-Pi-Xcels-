const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const moviesPath = path.join(__dirname, "movies_metadata.json");
const movies = JSON.parse(fs.readFileSync(moviesPath, "utf8"));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// A test route to make sure the server is up.
app.get("/api/ping", (request, response) => {
  console.log("❇️ Received GET request to /api/ping");
  response.send("pong!");
});

// A mock route to return some data.
// app.get("/api/movies", (request, response) => {
//   console.log("❇️ Received GET request to /api/movies");
//   response.json({ data: [{ id: 1, name: '1' }, { id: 2, name: '2' }] });
// });


app.get("/api/movies", (req, res) => {
  res.json({
    data: movies.map((m) => ({
      id: m.id,
      title: m.title,
      tagline: m.tagline,
      vote_average: m.vote_average,
    })),
  });
});

app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) return res.status(404).json({ error: "Movie not found" });
  res.json({ data: movie });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});

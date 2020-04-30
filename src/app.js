const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

const validateRepositoryId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  return next();
};

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0)
    return response.status(400).json({ error: "Repository ID not found." });

  const repository = repositories[index];
  repository.title = title;
  repository.url = url;
  repository.techs = techs;
  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0)
    return response.status(400).json({ error: "Repository ID not found." });

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0)
    return response.status(400).json({ error: "Repository ID not found." });

  const repository = repositories[index];
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;

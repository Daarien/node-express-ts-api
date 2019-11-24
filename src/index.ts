import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import {
  getUsersFromJsonHandler,
  getUserFromJsonHandler,
  setUserToJsonHandler,
  changeUserInJsonHandler
} from "./requestHandlers/jsonDataHandlers";
import {
  getUserFromDbHandler,
  getUsersFromDbHandler,
  setUserToDbHandler,
  changeUserInDbHandler
} from "./requestHandlers/mongoDbHandlers";
import { signUpHandler, authHandler } from "./requestHandlers/authHandlers";

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "auth-jwt";

const app = express();
app.use(bodyParser.json());

const mongoClient = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoClient.connect((error, client) => {
  if (error) return console.error(error);
  app.locals.collections = {
    users: client.db(dbName).collection("users"),
    signed: client.db(dbName).collection("signed")
  };
  app.listen(3000, () => {
    console.log("Server listening on port 3000!");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/db/users", getUsersFromDbHandler);

app.get("/db/users/:id", getUserFromDbHandler);

app.post("/db/users", setUserToDbHandler);

app.put("/db/users", changeUserInDbHandler);

app.get("/users", getUsersFromJsonHandler);

app.get("/users/:id", getUserFromJsonHandler);

app.post("/users", setUserToJsonHandler);

app.put("/users", changeUserInJsonHandler);

app.post("/signup", signUpHandler);

app.post("/auth", authHandler);

app.all("/error", (req, res) => {
  res.status(500).end();
});

// прослушиваем прерывание работы программы (ctrl-c)
// process.on("SIGINT", () => {
//   dbClient.close();
//   process.exit();
// });

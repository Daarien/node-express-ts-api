import express from "express";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import { MongoClient } from "mongodb";
import authRouter from "./routers/auth";
import jsonRouter from "./routers/json";
import mongoDbRouter from "./routers/mongodb";
import { secretKey } from "./jwt";

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "auth-jwt";

const app = express();
app.use(bodyParser.json());
app.use(jwt({ secret: secretKey }).unless({ path: RegExp(/^\/auth/) }));

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/db", mongoDbRouter);
app.use("/json", jsonRouter);

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

// прослушиваем прерывание работы программы (ctrl-c)
// process.on("SIGINT", () => {
//   dbClient.close();
//   process.exit();
// });

import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { Request, ParamsDictionary } from "express-serve-static-core";

const app = express();
// const jsonParser = bodyParser.json();
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: "application/json" }));

app.get("/", function(req, res) {
  res.send("Hello World!");
});

interface RequestParams extends ParamsDictionary {
  id: string;
}
interface ResponseBody {}
interface RequestBody extends User {}

type Req = Request<RequestParams, ResponseBody, RequestBody>;

type User = {
  id: number;
  name: string;
  age: number;
};

type Users = User[];

function getUsersData(): Users {
  const data = readFileSync(path.resolve(__dirname, "users.json"), "utf8");
  return JSON.parse(data);
}

function setUsersData(users: Users) {
  writeFileSync(path.resolve(__dirname, "users.json"), JSON.stringify(users));
}

app.get("/users", (req, res) => {
  const users = getUsersData();
  res.send(users);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const users = getUsersData();
  const user = users.find(u => u.id === Number(id));
  if (user) {
    res.send(user);
  } else {
    res.status(404).send();
  }
});

app.post("/users", (req: Req, res) => {
  try {
    const { name, age } = req.body;
    const user = { name, age } as User;
    const users = getUsersData();
    const id = Math.max.apply(
      Math,
      users.map(u => u.id)
    );
    user.id = id + 1;
    users.push(user);
    setUsersData(users);
    res.status(201).send(user);
  } catch (e) {
    res.status(500).end();
  }
});

app.put("/users", (req: Req, res) => {
  const { id, name, age } = req.body;
  if (!id) {
    res.status(400).send("User ID undefined");
    return;
  }
  const users = getUsersData();
  const wantedUser = users.find(u => u.id === id);
  if (wantedUser) {
    const user = { id } as User;
    if (name) {
      user.name = name;
    }
    if (age) {
      user.age = age;
    }
    const modifedUser = { ...wantedUser, ...user };
    const modifiedUsers = users.map(u => (u.id === id ? modifedUser : u));
    setUsersData(modifiedUsers);
    res.send(modifedUser);
  } else {
    res.status(404).send("User ID not found");
  }
});

app.post("/auth", (req, res) => {
  res.send("Auth");
});

app.all("/error", (req, res) => {
  res.status(500).end();
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});

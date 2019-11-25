import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { RequestHandler } from "express-serve-static-core";
import { UserRequestParams } from "../../types";

type User = {
  id: number;
  name: string;
  age: number;
};

type Users = User[];

function getUsersData(): Users {
  const data = readFileSync(path.resolve(__dirname, "../users.json"), "utf8");
  return JSON.parse(data);
}

function setUsersData(users: Users) {
  writeFileSync(
    path.resolve(__dirname, "../users.json"),
    JSON.stringify(users)
  );
}

export const getUsersFromJsonHandler: RequestHandler = (req, res) => {
  const users = getUsersData();
  res.send(users);
};
export const getUserFromJsonHandler: RequestHandler<UserRequestParams> = (
  req,
  res
) => {
  const { id } = req.params;
  const users = getUsersData();
  const user = users.find(u => u.id === Number(id));
  if (user) {
    res.send(user);
  } else {
    res.status(404).send();
  }
};

export const setUserToJsonHandler: RequestHandler = (req, res) => {
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
};

export const changeUserInJsonHandler: RequestHandler = (req, res) => {
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
    const modifedUser: User = { ...wantedUser, ...user };
    const modifiedUsers = users.map(u => (u.id === id ? modifedUser : u));
    setUsersData(modifiedUsers);
    res.send(modifedUser);
  } else {
    res.status(404).send("User ID not found");
  }
};

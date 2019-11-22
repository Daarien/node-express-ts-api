import { ObjectID } from "mongodb";
import { ParamsDictionary, RequestHandler } from "express-serve-static-core";
import {
  User,
  UsersCollection,
  UserSchema,
  UserRequestParams,
  ErrorResponse
} from "../types";

const INVALID_ID_MESSAGE =
  "Argument passed as ID must be a single String of 12 bytes or a string of 24 hex characters";

export const getUserFromDbHandler: RequestHandler<
  UserRequestParams,
  UserSchema | ErrorResponse
> = (req, res) => {
  const collection: UsersCollection = req.app.locals.collection;
  const userID = req.params.id;
  try {
    if (ObjectID.isValid(userID)) {
      const _id = new ObjectID(userID);
      collection.findOne({ _id }, (error, user) => {
        if (error) {
          console.error(error);
          res.status(500).send({ message: error.message });
        }
        if (user) {
          res.send(user);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      });
    } else {
      res.status(400).send({ message: INVALID_ID_MESSAGE });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getUsersFromDbHandler: RequestHandler<
  ParamsDictionary,
  UserSchema[]
> = (req, res) => {
  const collection: UsersCollection = req.app.locals.collection;
  collection.find().toArray((error, users) => {
    if (error) return console.error(error);
    res.send(users);
  });
};

export const setUserToDbHandler: RequestHandler<
  ParamsDictionary,
  UserSchema[] | ErrorResponse,
  User
> = (req, res) => {
  if (!req.body) return res.sendStatus(404);

  const { name, age } = req.body;
  const user = { name, age };
  const collection: UsersCollection = req.app.locals.collection;

  collection.insertOne(user, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    }
    res.send(result.ops);
  });
};

type UserRequestBody = { id: number } & User;

export const changeUserInDbHandler: RequestHandler<
  ParamsDictionary,
  UserSchema | ErrorResponse,
  UserRequestBody
> = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Invalid request data" });
  }

  const collection: UsersCollection = req.app.locals.collection;

  const { id, name, age } = req.body;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({ message: INVALID_ID_MESSAGE });
  }
  const _id = new ObjectID(id);
  if (!name && !age) {
    return res.status(400).send({ message: "Invalid user data" });
  }
  const user = {} as User;
  if (name) {
    user.name = name;
  }
  if (age) {
    user.age = age;
  }

  collection.findOneAndUpdate(
    { _id },
    { $set: user },
    { returnOriginal: false },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
      }

      res.send(result.value);
    }
  );
};

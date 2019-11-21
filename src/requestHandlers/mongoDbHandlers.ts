import { ObjectID, Collection } from "mongodb";
import {
  ParamsDictionary,
  Request,
  RequestHandler
} from "express-serve-static-core";

type User = {
  id: string;
  name: string;
  age: number;
};

type UserSchema = { _id: ObjectID; name: string; age: number };

type Users = User[];

export const getUserFromDbHandler: RequestHandler = (req, res) => {
  const collection: Collection<User> = req.app.locals.collection;
  const _id = new ObjectID(req.params.id);

  collection.findOne({ _id }, (error, user) => {
    if (error) return console.error(error);
    res.send(user);
  });
};

export const getUsersFromDbHandler: RequestHandler = (req, res) => {
  const collection: Collection<UserSchema> = req.app.locals.collection;
  collection.find().toArray((error, users) => {
    if (error) return console.error(error);
    res.send(users);
  });
};

type AddUserReqBody = { name: string; age: number };

export const setUserToDbHandler: RequestHandler<any, any, AddUserReqBody> = (
  req,
  res
) => {
  if (!req.body) return res.sendStatus(404);

  const { name, age } = req.body;
  const user = { name, age };
  const collection: Collection<UserSchema> = req.app.locals.collection;

  collection.insertOne(user, (error, result) => {
    if (error) return console.error(error);
    res.send(result);
  });
};

import { RequestHandler, ParamsDictionary } from "express-serve-static-core";
import { checkUserCredentials } from "../helpers";
import { UsersCredentialsCollection } from "../types";

interface SignUpReqBody {
  login: string;
  password: string;
}

export const signUpHandler: RequestHandler<
  ParamsDictionary,
  any,
  SignUpReqBody
> = async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const { login, password } = req.body;
  const errorMessage = checkUserCredentials(login, password);
  if (errorMessage) {
    return res.status(400).send({ message: errorMessage });
  }

  const collection: UsersCredentialsCollection =
    req.app.locals.collections.signed;

  const user = await collection.findOne({ login });
  if (user) {
    return res.status(409).send({ message: "Login already exists" });
  }

  collection.insertOne({ login, password }, (error, result) => {
    if (error) {
      return res.sendStatus(500);
    }
    res.status(201).send({ messsage: "You have signed up successfully" });
  });
};

export const authHandler: RequestHandler<ParamsDictionary> = (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
};

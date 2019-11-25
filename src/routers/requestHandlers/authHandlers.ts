import jwt from "jsonwebtoken";
import { RequestHandler, ParamsDictionary } from "express-serve-static-core";
import { hashSync, compareSync } from "bcryptjs";
import { checkUserCredentials } from "../../helpers";
import { secretKey, signOptions } from "../../jwt";
import { UsersCredentialsCollection } from "../../types";

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

  collection.insertOne(
    { login, password: hashSync(password) },
    (error, result) => {
      if (error) {
        return res.sendStatus(500);
      }
      res.status(201).send({ messsage: "You have signed up successfully" });
    }
  );
};

export const loginHandler: RequestHandler<ParamsDictionary> = async (
  req,
  res
) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const { login, password } = req.body;

  const collection: UsersCredentialsCollection =
    req.app.locals.collections.signed;

  if (login && password) {
    const user = await collection.findOne({ login });
    if (user) {
      if (!compareSync(password, user.password)) {
        return res.status(403).send({ message: "Wrong password" });
      }
      signOptions.issuer = user.login;
      const token = jwt.sign({ id: user._id }, secretKey, signOptions);
      res.send({ token });
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  } else {
    return res.sendStatus(400);
  }
};

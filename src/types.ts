import { ObjectID, Collection } from "mongodb";
import { ParamsDictionary } from "express-serve-static-core";

export type User = {
  name: string;
  age: number;
};

export type UserSchema = { _id: ObjectID } & User;

export type UsersCollection = Collection<UserSchema>;

export interface UserRequestParams extends ParamsDictionary {
  id: string;
}

export type ErrorResponse = { message: string };

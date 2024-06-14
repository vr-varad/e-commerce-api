import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../expections/bad_request";
import { ErrorCode } from "../expections/root";
import { SignUpSchema } from "../schemas/user";
import { NotFoundError } from "../expections/notFound";

export const signUp = async (
  req: Request,
  res: Response
) => {
  SignUpSchema.parse(req.body);
  const { name, email, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    throw new BadRequestException(
      "User Already Exist",
      ErrorCode.USER_ALREADY_EXIXT
    );
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });
  res.json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError("User Not Found", ErrorCode.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    console.log(password);
    throw new BadRequestException(
      "Incorrect Password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  return res.json({ user, token });
};

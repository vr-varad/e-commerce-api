import { Request, Response } from "express";
import { prismaClient } from "..";
import {hashSync} from 'bcrypt'

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  let user = await prismaClient.user.findFirst({
    where: {
      email
    },
  });

  if(user){
    throw Error("User Already Exists!")
  }

  user = await  prismaClient.user.create({
    data: {
      name,
      email,
      password : hashSync(password,10)
    }
  })
  res.json({user})
};

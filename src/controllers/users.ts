import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schemas/user";
import { NotFoundError } from "../expections/notFound";
import { ErrorCode } from "../expections/root";
import { Address, User } from "@prisma/client";
import { prismaClient } from "..";
import { BadRequestException } from "../expections/bad_request";

export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body);
  const user: User | any = req.user;

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: user.id,
    },
  });

  return res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    return res.json({
      message: "Address Deleted Successfully!!",
    });
  } catch (error) {
    throw new NotFoundError("Address Not Found", ErrorCode.ADDRESS_NOT_FOUND);
  }
};

export const listAddress = async (req: Request, res: Response) => {
  const addresses = await prismaClient.address.findMany();
  return res.json(addresses);
};

export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  const user : User | any = req.user
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: req.body.defaultShippingAddress,
        },
      });
      if(shippingAddress.userId != user.id){
        throw new BadRequestException("Shipping Address Does not Belong to the use", ErrorCode.ADDRESS_NOT_BELONG_TO_USER)
      }
    } catch (error) {
      throw new NotFoundError("Address Not Found", ErrorCode.ADDRESS_NOT_FOUND);
    }
  }
  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: req.body.defaultBillingAddress,
        },
      });
      if(billingAddress.userId != user.id){
        throw new BadRequestException("Billing Address Does not Belong to the use", ErrorCode.ADDRESS_NOT_BELONG_TO_USER)
      }
    } catch (error) {
      throw new NotFoundError("Address Not Found", ErrorCode.ADDRESS_NOT_FOUND);
    }
  }

  const updateUser = await prismaClient.user.update({
    where: {
        id: user.id
    },
    data : req.body
  })
  return res.json(updateUser)
};

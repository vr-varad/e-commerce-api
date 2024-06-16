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
  const user: User | any = req.user;
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: req.body.defaultShippingAddress,
        },
      });
      if (shippingAddress.userId != user.id) {
        throw new BadRequestException(
          "Shipping Address Does not Belong to the use",
          ErrorCode.ADDRESS_NOT_BELONG_TO_USER
        );
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
      if (billingAddress.userId != user.id) {
        throw new BadRequestException(
          "Billing Address Does not Belong to the use",
          ErrorCode.ADDRESS_NOT_BELONG_TO_USER
        );
      }
    } catch (error) {
      throw new NotFoundError("Address Not Found", ErrorCode.ADDRESS_NOT_FOUND);
    }
  }

  const updateUser = await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: req.body,
  });
  return res.json(updateUser);
};

export const listUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip! || 0,
    take: 5,
  });

  return res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        addresses: true,
      },
    });
    return res.json(user);
  } catch (error) {
    throw new NotFoundError("User Not Found", ErrorCode.USER_NOT_FOUND);
  }
};

export const changeRole = async (req: Request, res: Response) => {
  try {
    const user = await prismaClient.user.update({
      where: {
        id: +req.params.id,
      },
      data : {
        role : req.body.role
      }
    });
    return res.json(user);
  } catch (error) {
    throw new NotFoundError("User Not Found", ErrorCode.USER_NOT_FOUND);
  }
};

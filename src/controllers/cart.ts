import { Request, Response } from "express";
import { CartSchema, ChangeItemQuantitySchema } from "../schemas/cart";
import { prismaClient } from "..";
import { Cart, Product, User } from "@prisma/client";
import { NotFoundError } from "../expections/notFound";
import { ErrorCode } from "../expections/root";
import { BadRequestException } from "../expections/bad_request";

export const addItemtoCart = async (req: Request, res: Response) => {
  const validatedData = CartSchema.parse(req.body);
  let product: Product;
  let cart: Cart;
  const user: User | any = req.user;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFoundError("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }

  let cartWithItem = await prismaClient.cart.findFirst({
    where: {
      productId: product.id,
      userId: user.id,
    },
  });

  if (!cartWithItem) {
    cart = await prismaClient.cart.create({
      data: {
        userId: user.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
  } else {
    cart = await prismaClient.cart.update({
      where: {
        id: cartWithItem.id,
      },
      data: {
        quantity: cartWithItem.quantity + validatedData.quantity,
      },
    });
  }
  return res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  let user: User | any = req.user;
  try {
    const cartItem = await prismaClient.cart.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    if (cartItem.userId != user.id) {
      throw new BadRequestException(
        "Cart Doesn't belong to User",
        ErrorCode.CART_NOT_BELONG_TO_USER
      );
    }
  } catch (error) {
    throw new NotFoundError("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
  await prismaClient.cart.delete({
    where: {
      id: +req.params.id,
    },
  });
  return res.json({
    message: "Product Removed From Cart",
  });
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeItemQuantitySchema.parse(req.body);
  const user: User = req.user as User;
  let cartItem: Cart;
  try {
    cartItem = await prismaClient.cart.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    if (cartItem.userId != user.id) {
      throw new BadRequestException(
        "Cart Doesn't belong to User",
        ErrorCode.CART_NOT_BELONG_TO_USER
      );
    }
  } catch (error) {
    throw new NotFoundError("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
  const updatedIteam = await prismaClient.cart.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });

  return res.json(updatedIteam);
};

export const getCart = async (req: Request, res: Response) => {
  const user: User = req.user as User;
  const cart = await prismaClient.cart.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: true,
    },
  });
  return res.json(cart);
};

import { Request, Response } from "express";
import { prismaClient } from "..";
import { Orders, User } from "@prisma/client";
import { NotFoundError } from "../expections/notFound";
import { ErrorCode } from "../expections/root";
import { error } from "console";
import { InternalError } from "../expections/internal_error";
import { BadRequestException } from "../expections/bad_request";

export const createOrder = (req: Request, res: Response) => {
  return prismaClient.$transaction(async (tran) => {
    const user: User | any = req.user as User;
    const cartItems = await tran.cart.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: true,
      },
    });
    console.log(1);
    if (cartItems.length == 0) {
      return res.json({
        message: "Cart is Empty",
      });
    }
    console.log(2);
    const price = cartItems.reduce((prev, curr) => {
      return prev + curr.quantity * +curr.product.price;
    }, 0);
    const address = await tran.address.findFirst({
      where: {
        id: user.defaultShippingAddress,
      },
    });
    console.log(3);
    if (!address) {
      throw new NotFoundError("Address Not Found", ErrorCode.ADDRESS_NOT_FOUND);
    }
    console.log(4);
    let order: Orders;
    try {
      order = await tran.orders.create({
        data: {
          userId: user.id,
          netAmount: price,
          address: address.formatedAddress,
          products: {
            create: cartItems.map((cart) => {
              return {
                productId: cart.productId,
                quantity: cart.quantity,
              };
            }),
          },
        },
      });
    } catch (error) {
      throw new InternalError(
        "Internal Server Error",
        error,
        ErrorCode.INTERAL_SERVER_ERROR
      );
    }
    console.log(5);
    const orderEvent = await tran.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    console.log(6);
    await tran.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });
    console.log(7);
    return res.json({
      order,
    });
  });
};

export const listOrder = async (req: Request, res: Response) => {
  const user: User | any = req.user;
  const orders = await prismaClient.orders.findMany({
    where: {
      userId: user.id,
    },
  });
  return res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  return prismaClient.$transaction(async (tx) => {
    let order: Orders;
    const user: User | any = req.user;
    try {
      order = await tx.orders.findFirstOrThrow({
        where: {
          id: +req.params.id,
        },
      });
      if (order.userId != user.id) {
        throw new BadRequestException(
          "Order Does Not belong to User",
          ErrorCode.ORDER_NOT_BELONG_TO_USER
        );
      }
      order = await tx.orders.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: "CANCELLED",
        },
      });
      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
        },
      });
      return res.json(order);
    } catch (error) {
      throw new NotFoundError("Order Not Found", ErrorCode.ORDER_NOT_FOUND);
    }
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.orders.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });

    return res.json(order);
  } catch (error) {
    throw new NotFoundError("Order Not Found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereText = {};
  const status = req.params.status;
  if (status) {
    whereText = {
      status,
    };
  }
  const orders = await prismaClient.orders.findMany({
    where: whereText,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  return res.json(orders);
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereText: any = {
    userId : +req.params.id
  }
  const status = req.query.status
  if(status){
    whereText  = {
      ...whereText,
      status
    }
  }
  const orders = await prismaClient.orders.findMany({
    where: whereText,
    skip: +req.query.skip! || 0,
    take: 5,
  });
  return res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  return prismaClient.$transaction(async (tx) => {
    try {
      const order = await tx.orders.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: req.body.status,
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status,
        },
      });

      return res.json(order);
    } catch (error) {
      throw new NotFoundError("Order Not Found", ErrorCode.ORDER_NOT_FOUND);
    }
  });
};

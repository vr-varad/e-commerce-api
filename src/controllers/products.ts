import { prismaClient } from "..";
import { Request, Response } from "express";
import { ProductSchema } from "../schemas/product";
import { NotFoundError } from "../expections/notFound";
import { ErrorCode } from "../expections/root";

export const createProduct = async (req: Request, res: Response) => {
  ProductSchema.parse({ ...req.body, tags: req.body.tags.join(",") });
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  return res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = req.body.tags.join(",");
    }
    const pro = await prismaClient.product.findFirst({
      where: {
        id: +req.params.id,
      },
    });
    const updateProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    return res.json(updateProduct);
  } catch (error) {
    throw new NotFoundError("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prismaClient.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    return res.json({
      message: "Product Deleted",
    });
  } catch (error) {
    throw new NotFoundError("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

export const listProduct = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: +req.params.skip || 0,
    take: 5,
  });
  return res.json({
    count,
    data: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    return res.json({
      product,
    });
  } catch (error) {
    throw new NotFoundError("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND);
  }
};

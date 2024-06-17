import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProduct,
  updateProduct,
  searchProducts
} from "../controllers/products";
import { errorHandler } from "../errorHandler";
import authMiddleware from "../middlewares/auth";
import adminMiddlware from "../middlewares/admin";

const productRouter = Router();

productRouter.post(
  "/",
  [authMiddleware, adminMiddlware],
  errorHandler(createProduct)
);
productRouter.put(
  "/:id",
  [authMiddleware, adminMiddlware],
  errorHandler(updateProduct)
);
productRouter.delete(
  "/:id",
  [authMiddleware, adminMiddlware],
  errorHandler(deleteProduct)
);
productRouter.get(
  "/",
  [authMiddleware, adminMiddlware],
  errorHandler(listProduct)
);
productRouter.get(
  "/:id",
  [authMiddleware, adminMiddlware],
  errorHandler(getProductById)
);

export default productRouter;

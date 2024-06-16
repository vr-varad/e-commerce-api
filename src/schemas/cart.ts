import {z} from 'zod';

export const CartSchema = z.object({
    productId : z.number(),
    quantity : z.number(),
})

export const ChangeItemQuantitySchema = z.object({
    quantity : z.number()
})
import { Request, Response } from "express";
import { fetchAllProducts } from "../services/product.service";

export const getAllProducts = async (req: Request, res: Response) => {
try {
const products = await fetchAllProducts();


res.status(200).json({
  products,
});


} catch (error: any) {
res.status(500).json({
error: error.message,
});
}
};

import { getOrCreateCart, getCartItems } from "../repositories/cart.repository";
import {
createOrder,
getOrdersByUser,
clearCart,
} from "../repositories/order.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkout = async (
userId: string,
addressId: string
) => {
const cart = await getOrCreateCart(userId);

const cartItems = await getCartItems(cart.id);

if (cartItems.length === 0) {
throw new Error("Cart is empty");
}


const address = await prisma.address.findFirst({
where: {
id: addressId,
userId: userId,
},
});

if (!address) {
throw new Error("Invalid address");
}

// Create order with validated address
const order = await createOrder(userId, cartItems, addressId);

// Clear cart
await clearCart(cart.id);

return order;
};

export const getUserOrders = async (userId: string) => {
return getOrdersByUser(userId);
};

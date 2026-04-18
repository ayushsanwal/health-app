import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrCreateCart = async (userId: string) => {
let cart = await prisma.cart.findUnique({
where: { userId },
include: { items: true },
});

if (!cart) {
cart = await prisma.cart.create({
data: { userId },
include: { items: true },
});
}

return cart;
};

export const addItemToCart = async (
cartId: string,
productId: string,
quantity: number
) => {
return prisma.cartItem.upsert({
where: {
cartId_productId: {
cartId,
productId,
},
},
update: {
quantity: { increment: quantity },
},
create: {
cartId,
productId,
quantity,
},
});
};

export const getCartItems = async (cartId: string) => {
return prisma.cartItem.findMany({
where: { cartId },
include: { product: true },
});
};

export const removeCartItem = async (
cartId: string,
productId: string,
quantity: number = 1
) => {
// 🔍 Find existing item
const existingItem = await prisma.cartItem.findUnique({
where: {
cartId_productId: {
cartId,
productId,
},
},
});

if (!existingItem) {
throw new Error("Item not found in cart");
}

if (existingItem.quantity > quantity) {
return prisma.cartItem.update({
where: {
cartId_productId: {
cartId,
productId,
},
},
data: {
quantity: { decrement: quantity },
},
});
}

return prisma.cartItem.delete({
where: {
cartId_productId: {
cartId,
productId,
},
},
});
};



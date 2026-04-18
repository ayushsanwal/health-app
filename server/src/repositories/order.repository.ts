import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (
userId: string,
cartItems: any[],
addressId: string
) => {
// Calculate total
const total = cartItems.reduce(
(sum, item) => sum + item.product.price * item.quantity,
0
);

// Create order + items + address
const order = await prisma.order.create({
data: {
userId,
total,
addressId, 


  items: {
    create: cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    })),
  },
},
include: {
  items: true,
  address: true, 
},


});

return order;
};

export const getOrdersByUser = async (userId: string) => {
return prisma.order.findMany({
where: { userId },
include: {
items: {
include: { product: true },
},
address: true, // 🔥 include address
},
orderBy: { createdAt: "desc" },
});
};

export const clearCart = async (cartId: string) => {
return prisma.cartItem.deleteMany({
where: { cartId },
});
};

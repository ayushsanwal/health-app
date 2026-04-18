import {
getOrCreateCart,
addItemToCart,
getCartItems,
removeCartItem,
} from "../repositories/cart.repository";

export const addToCart = async (
userId: string,
productId: string,
quantity: number
) => {
const cart = await getOrCreateCart(userId);

await addItemToCart(cart.id, productId, quantity);

return getCartItems(cart.id);
};

export const viewCart = async (userId: string) => {
const cart = await getOrCreateCart(userId);
return getCartItems(cart.id);
};

export const removeFromCart = async (
userId: string,
productId: string,
quantity: number = 1
) => {
const cart = await getOrCreateCart(userId);

await removeCartItem(cart.id, productId, quantity);

return getCartItems(cart.id);
};

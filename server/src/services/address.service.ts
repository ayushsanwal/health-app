import {
createAddress,
getAddresses,
deleteAddress,
} from "../repositories/address.repository";

export const addAddress = async (userId: string, data: any) => {
return createAddress(userId, data);
};

export const viewAddresses = async (userId: string) => {
return getAddresses(userId);
};

export const removeAddress = async (
userId: string,
addressId: string
) => {
return deleteAddress(userId, addressId);
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAddress = async (userId: string, data: any) => {
return prisma.address.create({
data: {
userId,
...data,
},
});
};

export const getAddresses = async (userId: string) => {
return prisma.address.findMany({
where: { userId },
orderBy: { createdAt: "desc" },
});
};

export const deleteAddress = async (userId: string, addressId: string) => {
return prisma.address.delete({
where: {
id: addressId,
userId: userId,
},
});
};

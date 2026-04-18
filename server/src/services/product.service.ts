import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchAllProducts = async () => {
return prisma.product.findMany({
include: {
tags: {
include: {
tag: true,
},
},
},
});
};

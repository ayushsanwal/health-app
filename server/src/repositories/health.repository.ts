import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertHealthProfile = async (
userId: string,
data: any
) => {
return prisma.userHealthProfile.upsert({
where: { userId },
update: data,
create: {
userId,
...data,
},
});
};

export const getHealthProfile = async (userId: string) => {
return prisma.userHealthProfile.findUnique({
where: { userId },
});
};

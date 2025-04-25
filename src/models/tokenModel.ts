import prisma from '../config/prisma';

export const getTokens = async () => {
    return prisma.token.findMany();
};

export default prisma;

import Prisma from "@prisma/client";

// PrismaClient is not available when testing
const { PrismaClient } = Prisma || {};
const prisma = PrismaClient ? new PrismaClient() : {};

export const User = prisma.user;
export const Category = prisma.category;
export const Product = prisma.product;
export const Order = prisma.order;
export const OrderItem = prisma.orderItem;
export const Role = prisma.role;

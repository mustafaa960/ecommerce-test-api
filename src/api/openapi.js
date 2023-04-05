import swaggerJsDoc from "swagger-jsdoc";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  userSchema,
} from "./schemas/auth.js";
import categorySchema from "./schemas/category.js";
import productSchema from "./schemas/product.js";
import orderSchema from "./schemas/order.js";
import orderItemSchema from "./schemas/orderitem.js";
import roleSchema from "./schemas/role.js";

export const definition = {
  openapi: "3.0.0",
  info: {
    title: "AI-generated project",
    version: "0.0.1",
    description: "e commerce online in node;",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
    {
      url: "/api/v2",
      description: "API v2",
    },
  ],
  components: {
    schemas: {
      Category: categorySchema,
      Product: productSchema,
      Order: orderSchema,
      OrderItem: orderItemSchema,
      Role: roleSchema,
      loginSchema,
      registerSchema,
      changePasswordSchema,
      User: userSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        description: "Simple bearer token",
        scheme: "bearer",
        bearerFormat: "simple",
      },
    },
  },
};

const options = {
  definition,
  apis: ["./src/api/routes/*.js"],
};

const spec = swaggerJsDoc(options);

export default spec;

export default {
  apiPrefix: "/api/v1",
  swagger: {
    path: "/api/docs",
    spec: "openapi.json",
  },
  auth: {
    path: "/auth",
    login: "/login",
    logout: "/logout",
    changePassword: "/password",
    register: "/register",
  },
  category: {
    path: "/category",
  },
  product: {
    path: "/product",
  },
  order: {
    path: "/order",
  },
  orderItem: {
    path: "/order-item",
  },
  role: {
    path: "/role",
  },
};

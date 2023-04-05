import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Role,
} from "../src/models/init.js";
import UserService from "../src/services/user.js";
import CategoryService from "../src/services/category.js";
import ProductService from "../src/services/product.js";
import OrderService from "../src/services/order.js";
import OrderItemService from "../src/services/orderitem.js";
import RoleService from "../src/services/role.js";

const main = async () => {
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    Category,
    Product,
    Order,
    OrderItem,
    Role,
  };
  r.context.services = {
    UserService,
    CategoryService,
    ProductService,
    OrderService,
    OrderItemService,
    RoleService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();

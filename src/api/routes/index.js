import { Router } from "express";
import swaggerUI from "swagger-ui-express";

import { authenticateWithToken } from "../middlewares/auth.js";
import { handle404, handleError } from "../middlewares/errors.js";
import authRouter from "./auth.js";
import categoryRouter from "./category.js";
import productRouter from "./product.js";
import orderRouter from "./order.js";
import orderItemRouter from "./orderitem.js";
import roleRouter from "./role.js";
import urls from "../urls.js";
import spec from "../openapi.js";

const router = Router();

// Swagger API docs
const swaggerSpecPath = `${urls.swagger.path}/${urls.swagger.spec}`;
const swaggerUIOptions = {
  swaggerOptions: {
    url: swaggerSpecPath,
  },
};
router.get(swaggerSpecPath, (req, res) => res.json(spec));
router.use(
  urls.swagger.path,
  swaggerUI.serve,
  swaggerUI.setup(null, swaggerUIOptions)
);

// Authentication
router.use(authenticateWithToken);
router.use(urls.apiPrefix + urls.auth.path, authRouter);

// CRUD API
router.use(urls.apiPrefix + urls.category.path, categoryRouter);
router.use(urls.apiPrefix + urls.product.path, productRouter);
router.use(urls.apiPrefix + urls.order.path, orderRouter);
router.use(urls.apiPrefix + urls.orderItem.path, orderItemRouter);
router.use(urls.apiPrefix + urls.role.path, roleRouter);

// Redirect browsers from index to API docs
router.get("/", (req, res, next) => {
  if (req.accepts("text/html")) {
    res.redirect(urls.swagger.path);
  } else {
    next();
  }
});

// Error handlers
router.use(handle404);
router.use(handleError);

export default router;

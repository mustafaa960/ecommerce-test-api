import { Router } from "express";

import OrderItemService from "../../services/orderitem.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/orderitem.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: OrderItem
 *   description: API for managing OrderItem objects
 *
 * /order-item:
 *   get:
 *     tags: [OrderItem]
 *     summary: Get all the OrderItem objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of OrderItem objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await OrderItemService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /order-item:
 *   post:
 *     tags: [OrderItem]
 *     summary: Create a new OrderItem
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: The created OrderItem object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await OrderItemService.create(req.validatedBody);
    res.status(201).json(obj);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /order-item/{id}:
 *   get:
 *     tags: [OrderItem]
 *     summary: Get a OrderItem by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OrderItem object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await OrderItemService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /order-item/{id}:
 *   put:
 *     tags: [OrderItem]
 *     summary: Update OrderItem with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: The updated OrderItem object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await OrderItemService.update(
        req.params.id,
        req.validatedBody
      );
      if (obj) {
        res.status(200).json(obj);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      if (error.isClientError()) {
        res.status(400).json({ error });
      } else {
        next(error);
      }
    }
  }
);

/** @swagger
 *
 * /order-item/{id}:
 *   delete:
 *     tags: [OrderItem]
 *     summary: Delete OrderItem with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: OK, object deleted
 */
router.delete("/:id", requireValidId, async (req, res, next) => {
  try {
    const success = await OrderItemService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Not found, nothing deleted" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

export default router;

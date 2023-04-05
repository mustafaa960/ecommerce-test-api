import { Router } from "express";

import OrderService from "../../services/order.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/order.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Order
 *   description: API for managing Order objects
 *
 * /order:
 *   get:
 *     tags: [Order]
 *     summary: Get all the Order objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Order objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await OrderService.list();
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
 * /order:
 *   post:
 *     tags: [Order]
 *     summary: Create a new Order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: The created Order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await OrderService.create(req.validatedBody);
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
 * /order/{id}:
 *   get:
 *     tags: [Order]
 *     summary: Get a Order by id
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
 *         description: Order object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await OrderService.get(req.params.id);
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
 * /order/{id}:
 *   put:
 *     tags: [Order]
 *     summary: Update Order with the specified id
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
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The updated Order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await OrderService.update(req.params.id, req.validatedBody);
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
 * /order/{id}:
 *   delete:
 *     tags: [Order]
 *     summary: Delete Order with the specified id
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
    const success = await OrderService.delete(req.params.id);
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

import { Router } from "express";

import CategoryService from "../../services/category.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/category.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Category
 *   description: API for managing Category objects
 *
 * /category:
 *   get:
 *     tags: [Category]
 *     summary: Get all the Category objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Category objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await CategoryService.list();
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
 * /category:
 *   post:
 *     tags: [Category]
 *     summary: Create a new Category
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: The created Category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await CategoryService.create(req.validatedBody);
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
 * /category/{id}:
 *   get:
 *     tags: [Category]
 *     summary: Get a Category by id
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
 *         description: Category object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await CategoryService.get(req.params.id);
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
 * /category/{id}:
 *   put:
 *     tags: [Category]
 *     summary: Update Category with the specified id
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: The updated Category object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await CategoryService.update(
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
 * /category/{id}:
 *   delete:
 *     tags: [Category]
 *     summary: Delete Category with the specified id
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
    const success = await CategoryService.delete(req.params.id);
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

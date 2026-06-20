import type { Model } from "mongoose";
import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface CrudOptions {
  idField?: string;
  publicRead?: boolean;
}

export function createCrudRouter<T extends object>(
  Model: Model<T>,
  options: CrudOptions = {}
) {
  const router = Router();
  const idField = options.idField ?? "id";

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const items = await Model.find().sort({ createdAt: -1 }).lean();
      res.json(items);
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const item = await Model.findOne({ [idField]: req.params.id }).lean();
      if (!item) throw new AppError("Not found", 404);
      res.json(item);
    })
  );

  const writeMiddleware = options.publicRead ? authRequired : authRequired;

  router.post(
    "/",
    writeMiddleware,
    asyncHandler(async (req, res) => {
      const existing = await Model.findOne({ [idField]: req.body[idField] });
      if (existing) throw new AppError(`${idField} already exists`, 409);
      const item = await Model.create(req.body);
      res.status(201).json(item);
    })
  );

  router.put(
    "/:id",
    writeMiddleware,
    asyncHandler(async (req, res) => {
      const item = await Model.findOneAndUpdate(
        { [idField]: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!item) throw new AppError("Not found", 404);
      res.json(item);
    })
  );

  router.delete(
    "/:id",
    writeMiddleware,
    asyncHandler(async (req, res) => {
      const item = await Model.findOneAndDelete({ [idField]: req.params.id });
      if (!item) throw new AppError("Not found", 404);
      res.json({ success: true });
    })
  );

  return router;
}

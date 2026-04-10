import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = 'review';
const ModuleName = 'Review';

const dir = path.join(__dirname, 'src/app/module', moduleName);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, `${moduleName}.controller.ts`), `import { Request, Response } from "express";
import { StatusCodes } from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { ${ModuleName}Service } from "./${moduleName}.service.js";

export const ${ModuleName}Controller = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await ${ModuleName}Service.create({ ...req.body, userId: req.user.userId });
    sendResponse(res, { httpStatusCode: StatusCodes.CREATED, success: true, message: "${ModuleName} created successfully", data: result });
  }),
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await ${ModuleName}Service.getAll(req.query);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "${ModuleName} list fetched successfully", data: result.data, meta: result.meta });
  }),
};
`);

fs.writeFileSync(path.join(dir, `${moduleName}.service.ts`), `import prisma from "../../lib/prisma.js";
import QueryBuilder from "../../utils/QueryBuilder.js";

export const ${ModuleName}Service = {
  create: async (payload: any) => {
    return prisma.${moduleName.toLowerCase()}.create({ data: payload });
  },
  getAll: async (query: any) => {
    const qb = new QueryBuilder(prisma.${moduleName.toLowerCase()}, query, {
      searchableFields: [],
      filterableFields: ["ideaId", "userId"],
    });
    const { data, meta } = await qb.search().filter().paginate().sort().include().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },
};
`);

fs.writeFileSync(path.join(dir, `${moduleName}.validation.ts`), `import { z } from "zod";

export const create${ModuleName}ZodSchema = z.object({
  ideaId: z.string({ required_error: "Idea ID is required" }),
  rating: z.number().min(1).max(10),
  effectiveness: z.number().min(1).max(10),
  experience: z.string(),
});
`);

fs.writeFileSync(path.join(dir, `${moduleName}.route.ts`), `import { Router } from "express";
import checkAuth from "../../middleware/checkAuth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ${ModuleName}Controller } from "./${moduleName}.controller.js";
import { create${ModuleName}ZodSchema } from "./${moduleName}.validation.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();
router.get("/", ${ModuleName}Controller.getAll); // Public can see reviews
router.post("/", checkAuth(Role.MEMBER), validateRequest(create${ModuleName}ZodSchema), ${ModuleName}Controller.create);

export const ${ModuleName}Routes = router;
`);

import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import { StatusCodes } from "http-status-codes";

import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { ROLE_CODES } from "../shared/constants/roles";
import { AppError } from "../shared/errors/app-error";
import { ok } from "../shared/http/api-response";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "") || ".bin";
    const baseName = path
      .basename(file.originalname || "upload", extension)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .slice(0, 40);
    cb(null, `${Date.now()}-${baseName}${extension}`);
  }
});

const upload = multer({ storage });
const uploadsRouter = Router();

uploadsRouter.post(
  "/single",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      throw new AppError("No file uploaded", StatusCodes.BAD_REQUEST);
    }

    const host = req.get("host");
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(StatusCodes.CREATED).json(ok("File uploaded", { url: fileUrl, fileName: req.file.originalname }));
  }
);

export { uploadsRouter };

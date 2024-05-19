import path from "node:path";
import multer from "multer";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename(req, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const syffix = crypto.randomUUID();
    cb(null, `${basename}-${syffix}${extname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;

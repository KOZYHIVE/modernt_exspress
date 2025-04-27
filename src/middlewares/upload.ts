import multer from "multer";

const storage = multer.memoryStorage(); // simpan file di memory (buffer)
export const upload = multer({ storage });
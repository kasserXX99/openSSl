import express from "express";
import { validate, create } from "./utils/certificate.js";
import multer from "multer";
import fs from "fs";
// const __filename = path.dirname(fileURLToPath(import.meta.url));
// const location = path.join(__filename, "./longLoop.js");

const app = express();
app.use(express.json());
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `./apple_certificate`);
	},
	filename: function (req, file, cb) {
		console.log(req.files);
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });
app.get("/certificate", async (req, res, next) => {
	const { merchant_name } = req.body;
	try {
		let value = await create(merchant_name);
		console.log("from the value", value);
		res.json({
			CSR: value,
		});
	} catch (err) {
		console.log("catch", err);
		next(err);
	}
});

app.post("/validate_certificate", upload.single("cer"), async (req, res) => {
	const { merchant_name } = req.body;
	try {
		const result = await validate(merchant_name);
		if (result == "valid") {
			res
				.status(201)
				.json({ result: "certificate was validated successfully" });
		}
	} catch (e) {
		throw e;
	}
});

app.post("/testing", upload.single("cer"), async (req, res) => {
	// console.log(req.body);
	console.log(req.file);
	fs.readFile(req.file.path, (err, data) => {
		if (err) throw err;
		const buff = Buffer.from(data, "base64");
		res.json(buff.toString("utf-8"));
	});
});

app.use((err, req, res, next) => {
	console.log("from the error handler", err.message);
	res.status(500).json({
		error: err.message,
		path: req.path,
		time: new Date().toISOString(),
	});
});

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
	console.log("app is running on " + PORT);
});

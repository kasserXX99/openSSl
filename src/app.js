import express from "express";
import { validate, create } from "./utils/certificate.js";

// const __filename = path.dirname(fileURLToPath(import.meta.url));
// const location = path.join(__filename, "./longLoop.js");

const app = express();
app.use(express.json());

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
app.get("/testing", async (req, res) => {
	res.json("hi there");
});

app.post("/add_certificate", (req, res) => {
	res.send(req.body.certificate);
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

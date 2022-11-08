import fsPromises from "fs/promises";
import util from "node:util";
import { exec } from "child_process";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { resolve } from "path";

const __filename = path.dirname(fileURLToPath(import.meta.url));

const execute = async (format, merchantName, res, rej, command) => {
	try {
		const ex = util.promisify(exec);
		if (format === "csr") {
			const { stdout, stderr } = await ex(command);
			fs.readFile(
				path.resolve(
					__filename,
					"../../apple_certificate",
					`${merchantName}.csr`
				),
				(err, data) => {
					if (err) {
						console.log("error occured while reading the file");
						rej(err);
					}
					res(data.toString());
				}
			);
		}
		const { stdout, stderr } = await ex(command);
	} catch (err) {
		console.log("error while excuting the command");
		rej(err);
	}
};

const validate = (cer) => {};
const create = (name = "name") => {
	if (
		fs.existsSync(path.join(__filename, `../../apple_certificate/${name}.csr`))
	) {
		return "exist";
	}
	const key = path.join(__filename, `../../apple_certificate/${name}.key`);
	const csr = path.join(__filename, `../../apple_certificate/${name}.csr`);
	return new Promise(async (res, rej) => {
		await execute(
			"key",
			name,
			res,
			rej,
			`openssl ecparam -out ${key} -name prime256v1 -genkey`
		);
		await execute(
			"csr",
			name,
			res,
			rej,
			`openssl req -new -sha256 -key ${key} -nodes -out ${csr} -subj "/C=US/ST=Utah/L=Lehi/O=Your Company, Inc./OU=IT/CN=yourdomain.com"`
		);
	});
};
export { validate, create };

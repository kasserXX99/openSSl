import fsPromises from "fs/promises";
import util from "node:util";
import { exec } from "child_process";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = path.dirname(fileURLToPath(import.meta.url));

const validate = async (merchant_name) => {
	return new Promise(async (res, rej) => {
		const key = path.join(
			__filename,
			`../../apple_certificate/${merchant_name}.key`
		);
		const cer = path.join(
			__filename,
			`../../apple_certificate/${merchant_name}.cer`
		);

		const res1 = await execute(
			"cer",
			merchant_name,
			res,
			rej,
			`openssl pkey -pubout -in ${key} | openssl md5`
		);
		const res2 = await execute(
			"cer",
			merchant_name,
			res,
			rej,
			`openssl x509 -pubkey -inform der -in ${cer} -noout | openssl md5`
		);
		if (res1 === res2) {
			console.log("res1", res1, "res2", res2);
			console.log(res1 === res2);
			res("valid");
		}
	});
};
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
			`openssl req -new -sha256 -key ${key} -nodes -out ${csr} -subj "/C=SA/ST=Central/L=Ghernatah/O=Dinero, Inc./OU=IT/CN=Diner.com"`
		);
	});
};
const execute = async (format, merchantName = null, res, rej, command) => {
	try {
		const ex = util.promisify(exec);
		if (format === "cer") {
			const { stdout, stderr } = await ex(command);
			res(stdout);
		}
		{
		}
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
export { validate, create };

import { parentPort } from "worker_threads";

parentPort.once("message", (num) => {
	const result = longLoop(num);
	console.log("form the worker, result, num");
	parentPort.postMessage(result);
});

const longLoop = (iteration) => {
	let number = 0;
	for (let i = 0; i < iteration; i++) {
		number++;
	}
	return number;
};

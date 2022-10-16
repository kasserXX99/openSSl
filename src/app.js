import express from 'express';

const app = express();

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
	console.log('app is running on ' + PORT);
});
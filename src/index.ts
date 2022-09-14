import { runDb } from './db';
import { app } from './app';

const port = process.env.PORT || 3000;

const startApp = async () => {
	await runDb();
	app.listen(port, () => {
		console.log(` IT-Incubator homework monday-2 has been started at port: ${port} `);
	});
};

startApp().catch((error) => {
	console.log('Application unexpectedly shutdown!', error.message);
});

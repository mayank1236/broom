import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';

// guaranteed to get dependencies
export default () => {
	const app = Router();

	app.get('/status', (req, res) => { res.status(200).end(); });
  	app.head('/status', (req, res) => { res.status(200).end(); });

	auth(app);
	user(app);

	return app;
}
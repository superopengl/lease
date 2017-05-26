import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import LeaseRouter from './routes/LeaseRouter';
import UserRouter from "./routes/UserRouter";
import LoginRouter from "./routes/LoginRouter";
import MediOrderRouter from "./routes/MediOrderRouter";
import ApiRouter from "./routes/ApiRouter";
// Creates and configures an ExpressJS web server.
class App {

	// ref to Express instance
	public express: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.express.use(logger('dev'));
		this.express.use(cors());
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({
			extended: false
		}));
	}

	// Configure API endpoints.
	private routes(): void {
		/* This is just to get up and running, and to make sure what we've got is
		 * working so far. This function will change when we start to add more
		 * API endpoints */
		let router = express.Router();
		// placeholder route handler
		router.get('/', (req, res, next) => {
			res.json({
				message: 'Hello World!'
			});
		});
		this.express.use('/', router);
		this.express.use('/api/v1', ApiRouter);
		this.express.use('/api/v1/user', UserRouter);
		this.express.use('/api/v1/login', LoginRouter);
		this.express.use('/api/v1/lease', LeaseRouter);
		this.express.use('/api/v1/order', MediOrderRouter);
	}

}

export default new App().express;

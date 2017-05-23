import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import * as api from "../../data/apis";
import { Lease, LeaseState } from "../../data/dtos";

export class LeaseRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public list(req: Request, res: Response, next: NextFunction) {
		api.lease.gegAll()
		.then(list => {
			res.status(200).send(list);
		})
		.catch(err => {
			res.status(404)
				.send({
					message: JSON.stringify(err),
					status: res.status
				});
		});
	}

	public getOne(req: Request, res: Response, next: NextFunction) {
		let query = parseInt(req.params.id);
		let hero = {
			ok: query
		};
		if (hero) {
			res.status(200)
				.send({
					message: 'Success',
					status: res.status,
					hero
				});
		} else {
			res.status(404)
				.send({
					message: 'No hero found with the given id.',
					status: res.status
				});
		}
	}

	public createOne(req: Request, res: Response, next: NextFunction) {
		const body = req.body;
		const userId = body.userId;
		api.lease.createBy(userId).then(lease => {
			res.send(lease);
		});
	}

	/**
	 * Take each handler, and attach to one of the Express.Router's
	 * endpoints.
	 */
	init() {
		this.router.get('/', this.list);
		this.router.get('/:id', this.getOne);
		this.router.put('/', this.createOne);
	}
}

export default new LeaseRouter().router;

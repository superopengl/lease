import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';

export class HeroRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public getAll(req: Request, res: Response, next: NextFunction) {
		res.send([{
			ok: 1
		}, {
			ok: 2
		}]);
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

	init() {
		this.router.get('/', this.getAll);
		this.router.get('/:id', this.getOne);
	}
}

export default new HeroRouter().router;

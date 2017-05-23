import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import * as api from "../../data/apis";
import { User } from "../../data/dtos";

export class LoginRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public getOne(req: Request, res: Response, next: NextFunction) {
		let id = req.params.id;
		api.user.get(id)
		.then(user => {
			res.status(200).send(user);
		})
		.catch(err => {
			res.status(404)
				.send({
					message: JSON.stringify(err),
					status: res.status
				});
		});
	}

	public login(req: Request, res: Response, next: NextFunction) {
		let user: User = req.body;
		api.user.find(user.name, user.password)
		.then(id => {
			res.status(200).send(id);
		})
		.catch(err => {
			res.status(404)
				.send(err);
		});
	}

	public updateOne(req: Request, res: Response, next: NextFunction) {
		let user: User = req.body;
		const id = req.params.id;
		api.user.update(id, user)
		.then(user => {
			res.status(200).cookie("userId", user.id);
		})
		.catch(err => {
			res.status(404)
				.send({
					message: 'No hero found with the given id.',
					status: res.status
				});
		});
	}

	init() {
		this.router.post('/', this.login);
		//this.router.post('/:id', this.updateOne);
	}
}

export default new LoginRouter().router;

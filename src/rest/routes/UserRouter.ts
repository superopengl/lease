import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import * as api from "../../data/apis";
import { User, Patient } from "../../data/dtos";

export class UserRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public list(req: Request, res: Response, next: NextFunction) {
		api.user.gegAll()
		.then(users => {
			res.status(200).send(users);
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
		let id = req.params.id;
		api.user.get(id)
		.then(user => {
			if(user){
				res.status(200).send(user);
			}else{
				res.status(404);
			}
		})
		.catch(err => {
			res.status(404)
				.send({
					message: JSON.stringify(err),
					status: res.status
				});
		});
	}

	public createOne(req: Request, res: Response, next: NextFunction) {
		let user: User = req.body;
		api.user.create(user)
		.then(id => {
			res.status(200).send(id);
		})
		.catch(err => {
			res.status(404)
				.send({
					message: 'No hero found with the given id.',
					status: res.status
				});
		});
	}

	public createPatient(req: Request, res: Response, next: NextFunction) {
		let patient: Patient = req.body;
		api.patient.create(patient)
		.then(id => {
			res.status(200).send(id);
		})
		.catch(err => {
			res.status(404)
				.send({
					message: 'No hero found with the given id.',
					status: res.status
				});
		});
	}

	public updateOne(req: Request, res: Response, next: NextFunction) {
		let user: User = req.body;
		const id = req.params.id;
		api.user.update(id, user)
		.then(user => {
			res.status(200).send(user);
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
		this.router.get('/', this.list);
		this.router.get('/:id', this.getOne);
		this.router.put('/', this.createOne);
		this.router.post('/:id', this.updateOne);
		// this.router.put('/patient', this.createPatient);
		// this.router.put('/doctor', this.createDoctor);
		
	}
}

export default new UserRouter().router;

import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import * as api from "../../data/apis";
import { User, Patient, MediOrder } from "../../data/dtos";

export class MediOrderRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public createOne(req: Request, res: Response, next: NextFunction) {
		let order: MediOrder = req.body;
		order.timestamp = new Date();
		api.order.create(order)
		.then(id => {
			res.status(200);
		})
		.catch(err => {
			res.status(404).send(err);
		});
	}

	public getForPatient(req: Request, res: Response, next: NextFunction) {
		const patientUserId: string = req.params.id;
		api.order.query({patientUserId}, 1000)
		.then(orders => {
			res.status(200).send(orders);
		})
		.catch(err => {
			res.status(404).send(err);
		});
	}

	public getForDoctor(req: Request, res: Response, next: NextFunction) {
		const doctorUserId: string = req.params.id;
		api.order.query({doctorUserId}, 1000)
		.then(orders => {
			res.status(200).send(orders);
		})
		.catch(err => {
			res.status(404).send(err);
		});
	}

	init() {
		this.router.get('/patient/:id', this.getForPatient);
		this.router.get('/doctor/:id', this.getForDoctor);
		this.router.put('/', this.createOne);
		// this.router.put('/patient', this.createPatient);
		// this.router.put('/doctor', this.createDoctor);
		
	}
}

export default new MediOrderRouter().router;

import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import { apiFactory } from "../../data/apis";
import { Lease, LeaseState, User } from "../../data/dtos";
import { IGenericRepo } from "../../data/genericRepo";

export class LeaseRouter {
	router: Router;
	api: IGenericRepo;

	constructor() {
		this.api = apiFactory.produce('lease');
		this.router = Router();
		this.init();
	}

	public async require(req: Request, res: Response, next: NextFunction) {
		const leaseId = req.params.id;
		try{
			const user = <User>req.body;
			let lease = <Lease> (await this.api.get(leaseId));
			if(lease.cancelledBy){
				res.send(404, 'The lease has been cancelled');
			}
			lease.requiredBy = user.id;
			lease = await this.api.update(lease);
			res.send(200, lease);
		}catch(err){
			res.send(500, err);
		}
	}

	public async acknowledge(req: Request, res: Response, next: NextFunction) {
		const leaseId = req.params.id;
		try{
			const user = <User>req.body;
			let lease = <Lease> (await this.api.get(leaseId));
			if(lease.cancelledBy){
				res.send(404, 'The lease has been cancelled');
			}
			lease.acknowledgedBy = user.id;
			lease = await this.api.update(lease);
			res.send(200, lease);
		}catch(err){
			res.send(500, err);
		}
	}

	public async cancel(req: Request, res: Response, next: NextFunction) {
		const leaseId = req.params.id;
		try{
			const user = <User>req.body;
			let lease = <Lease> (await this.api.get(leaseId));
			lease.cancelledBy = user.id;
			lease = await this.api.update(lease);
			res.send(200, lease);
		}catch(err){
			res.send(500, err);
		}
	}
	/**
	 * Take each handler, and attach to one of the Express.Router's
	 * endpoints.
	 */
	init() {
		this.router.post('/:id/require', this.require);
		this.router.post('/:id/acknowledge', this.acknowledge);
		this.router.post('/:id/cancel', this.cancel);
	}
}

export default new LeaseRouter().router;

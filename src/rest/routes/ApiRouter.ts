import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import {apiFactory} from "../../data/apis";
import { IGenericRepo } from "../../data/genericRepo";

export class ApiRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	static getApi(req: Request): IGenericRepo {
		const type = req.params.type;
		const api = apiFactory.produce(type);
		if(!api) {
			throw new Error(`Cannot resolve api for type '${type}'`);
		}
		return api;
	}

	static server500(res: Response): (err: Error) => void {
		return err => {
			res.status(500).send(err);
		};
	}

	public query(req: Request, res: Response, next: NextFunction) {
		const query = req.query;
		ApiRouter.getApi(req).query(query)
			.then(items => {
				res.status(200).send(items);
			})
			.catch(ApiRouter.server500(res));
	}

	public getOne(req: Request, res: Response, next: NextFunction) {
		let id = req.params.id;
		ApiRouter.getApi(req).get(id)
			.then(item => {
				if(item){
					res.status(200).send(item);
				}else{
					res.status(404).send(`Cannot find user with id '${id}'`);
				}
			})
			.catch(ApiRouter.server500(res));
	}

	public createOne(req: Request, res: Response, next: NextFunction) {
		let item = req.body;
		ApiRouter.getApi(req).create(item)
			.then(newId => {
				res.status(201).send(newId);
			})
			.catch(ApiRouter.server500(res));
	}

	public updateOne(req: Request, res: Response, next: NextFunction) {
		let item = req.body;
		ApiRouter.getApi(req).update(item)
			.then(x => {
				res.status(200);
			})
			.catch(ApiRouter.server500(res));
	}

	public deleteOne(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		ApiRouter.getApi(req).delete(id)
			.then(x => {
				res.status(200);
			})
			.catch(ApiRouter.server500(res));
	}

	init() {
		this.router.get('/:type', this.query);
		this.router.get('/:type/:id', this.getOne);
		this.router.put('/:type', this.createOne);
		this.router.post('/:type', this.updateOne);
		this.router.delete('/:type', this.deleteOne);
		
	}
}

export default new ApiRouter().router;

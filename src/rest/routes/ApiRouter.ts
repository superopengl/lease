import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import {
	apiFactory
} from "../../data/apis";
import {
	IGenericRepo
} from "../../data/genericRepo";

export class ApiRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	static getApi(req: Request): IGenericRepo {
		const type = req.params.type;
		const api = apiFactory.produce(type);
		if (!api) {
			throw new Error(`Cannot resolve api for type '${type}'`);
		}
		return api;
	}

	static server500(error: Error, res: Response): void {
		res.status(500).end(error.toString());
	}

	public async query(req: Request, res: Response, next: NextFunction) {
		try {
			const queryString = req.query;
			const query = JSON.parse(queryString.query);
			const limit = parseInt(queryString.limit);
			const sort = queryString.sort;
			const items = await ApiRouter.getApi(req).query(query, limit, sort);
			res.status(200).send(items);
		} catch (error) {
			ApiRouter.server500(error, res);
		}
	}

	public async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			let id = req.params.id;
			const item = await ApiRouter.getApi(req).get(id);
			if (item) {
				res.status(200).send(item);
			} else {
				res.status(404).send(`Cannot find user with id '${id}'`);
			}
		} catch (error) {
			ApiRouter.server500(error, res);
		}
	}

	public async createOne(req: Request, res: Response, next: NextFunction) {
		try {
			let item = req.body;
			const newId = await ApiRouter.getApi(req).create(item);
			res.status(201).send(newId);
		} catch (error) {
			ApiRouter.server500(error, res);
		}
	}

	public async updateOne(req: Request, res: Response, next: NextFunction) {
		let item = req.body;
		try {
			await ApiRouter.getApi(req).update(item);

			res.status(200).end('Updated');
		} catch (error) {
			ApiRouter.server500(error, res);
		}
	}

	public async deleteOne(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			await ApiRouter.getApi(req).delete(id);
			res.status(200).end('Deleted');
		} catch (error) {
			ApiRouter.server500(error, res);
		}
	}

	init() {
		this.router.get('/:type', this.query);
		this.router.get('/:type/:id', this.getOne);
		this.router.put('/:type', this.createOne);
		this.router.post('/:type', this.updateOne);
		this.router.delete('/:type/:id', this.deleteOne);

	}
}

export default new ApiRouter().router;

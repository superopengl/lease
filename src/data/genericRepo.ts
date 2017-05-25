import * as mongo from "mongodb";
import * as uuid from "uuid";
import * as dto from "./dtos";

export interface IGenericRepo {
	list(limit ? : number, sort ? : any): Promise < any[] > ;
	get(id: string): Promise < any > ;
	query(query: any, limit ? : number, sort ? : any): Promise < any[] > ;
	create(item: any): Promise < string > ;
	update(item: any): Promise < any > ;
	delete(id: string): Promise < void > ;
}

export class GenericRepoFactory {
	constructor(private dbPromise: Promise < mongo.Db >) {}
	
	produce(typeName: string): IGenericRepo{
		return new GenericRepo(this.dbPromise, typeName);
	}
}

class GenericRepo implements IGenericRepo {
	constructor(private dbPromise: Promise < mongo.Db > , private collectionName: string) {}

	private async getCollection(): Promise < mongo.Collection > {
		const db = await this.dbPromise;
		return db.collection(this.collectionName);
	}

	async get(id: string): Promise < any > {
		const array = await this.query({
			id: id
		}, 1);
		if (array && array.length === 1) {
			return <any > array[0];
		}
		throw new Error(`Cannot find object with id '${id}'`);
	}

	async list(limit ? : number, sort ? : any): Promise < any[] > {
		return await this.query({}, limit, sort);
	}

	async create(item: any): Promise < string > {
		if (item.id) {
			throw new Error(`To create an object, id must not be specified.`);
		}
		item.id = uuid.v4();
		await this.upsert(item, false);
		return item.id;
	}

	async update(item: any): Promise < any > {
		if (!item.id) {
			throw new Error(`To update an object, id must be specified.`);
		}
		await this.upsert(item, true);
		return item;
	}

	private async upsert(item: any, upsert: boolean): Promise < string > {
		const collection = await this.getCollection();
		const option: mongo.ReplaceOneOptions = {
			upsert
		};
		await collection.updateOne({
			id: item.id
		}, item, option);
		return item.id;
	}

	async query(query: any, limit: number = 1000, sort: any = {}): Promise < any[] > {
		const collection = await this.getCollection();
		const result = await collection.find(query)
			.sort(sort)
			.limit(limit)
			.toArray();
		return <any[] > result;
	}

	async delete(id: string): Promise < void > {
		const collection = await this.getCollection();
		await collection.deleteOne({
			id
		});
	}
}

import * as mongo from "mongodb";
import * as uuid from "uuid";
import * as dto from "./dtos";

const connectionString = process.env.MECO_MONGODB_CONNECTION_STRING;
const dbPromise = mongo.MongoClient.connect(connectionString);

export interface IMlogRepo <T> {
	getLatest(id: string): Promise < T > ;
	getAll(id: string): Promise < T[] > ;
	getAllDuring(id: string, start: Date, end?: Date): Promise<T[]>;
	add(item: T): Promise<string>;
	query(query: any): Promise < T[] > ;
}

export class MlogRepo<T extends {id?: string}> implements IMlogRepo<T> {
	constructor(private collectionName: string) { }

	private async getCollection(): Promise < mongo.Collection > {
		const db = await dbPromise;
		return db.collection(this.collectionName);
	}

	private async getMlogCollection(): Promise < mongo.Collection > {
		const db = await dbPromise;
		return db.collection("mlogs");
	}

	async getLatest(id: string): Promise < T > {
		const array = await this.query({id: id}, 1);
		const result = array.length === 1 ? array[0] : null;
		return <T > result;
	}

	async getAll(id: string, limit: number = 1000): Promise < T[] > {
		return await this.query({id: id});
	}

	async getAllDuring(id: string, start: Date, end?: Date): Promise<T[]> {
		let query = {
			id,
			mlog_timestamp: {
				$gte: start.valueOf()
			}
		};

		if(end){
			query = Object.assign(query, {mlog_timestamp: {$lte: end.valueOf}});
		}

		return await this.query(query);
	}

	async add(item: T): Promise<string> {
		const isNew = !item.id;
		Object.assign(item, {
			id: item.id || uuid.v4(),
		});

		const task = this.addObject(item);
		const mlogTask = this.addMlog(item, isNew);
		await Promise.all([task, mlogTask]);
		return item.id;
	}

	private async addObject(item: T): Promise<string> {
		const collection = await this.getCollection();
		const option: mongo.ReplaceOneOptions = {
			upsert: true
		};
		await collection.updateOne({id: item.id}, item, option);
		return item.id;
	}

	private async addMlog(item: T, isNew: boolean): Promise<void> {
		const mlog: dto.Mlog = {
			action: `${isNew ? "create" : "update"} in ${this.collectionName}`,
			mlog_id: uuid.v4(),
			id: item.id,
			at: new Date().valueOf(),
			by: "system",
			extend: JSON.stringify(item)
		};
		const mlogCollection = await this.getMlogCollection();
		await mlogCollection.insertOne(mlog);
	}

	async query(query: any, limit: number = 1000): Promise < T[] > {
		const collection = await this.getCollection();
		const result = await collection.find(query)
			.sort({
				mlog_timestamp: -1
			})
			.limit(limit)
			.toArray();
		return <T[]> result;
	}
}

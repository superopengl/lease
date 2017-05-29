import {
	Injectable
} from '@angular/core';
import {
	Http,
	Response,
	URLSearchParams
} from '@angular/http';
import {MediOrder, Lease,  Patient,   User,    Doctor} from '../../data/dtos';

@Injectable()
export class ApiService {
	constructor(private http: Http) {}

	forType<T>(type: string): IRestApi<T> {
		return new RestApi<T>(type, this.http);
	}

	get user(): IRestApi<User> {
		return this.forType('user');
	}

	get doctor(): IRestApi<Doctor> {
		return this.forType('doctor');
	}

	get patient(): IRestApi<Patient> {
		return this.forType('patient');
	}

	get mediOrder(): IRestApi<MediOrder> {
		return this.forType('mediOrder');
	}

	get lease(): IRestApi<Lease> {
		return this.forType('lease');
	}
}

export interface IRestApi < T > {
	list(limit ? : number, sort ? : any): Promise < T[] > ;
	get(id: string): Promise < T > ;
	findOne(query: any, sort?: any): Promise<T>;
	query(query: any, limit ? : number, sort ? : any): Promise < T[] > ;
	create(item: T): Promise < string > ;
	update(item: T): Promise < T > ;
	delete(id: string): Promise < void > ;
}

class RestApi < T > implements IRestApi < T > {

	private userApiUrl: string = "http://localhost:8141/api/v1/";

	constructor(private typeName: string, private http: Http) {}

	private objectToQueryString(query: any): string {
		const builder = new URLSearchParams();
		for (let key in query) {
			const value = JSON.stringify(query[key]);
			builder.set(key, value);
		}
		return builder.toString();
	}

	private AssertResponse(response: Response, status: number = 200, msg: string = ""): void {
		if (response.status !== status) {
			throw new Error(msg || 'Error happened');
		}
	}

	get baseUrl(): string {
		return this.userApiUrl + this.typeName;
	}

	async list(limit ? : number, sort ? : any): Promise < T[] > {
		return await this.query({}, limit, sort);
	}

	async get(id: string): Promise < T > {
		const url = this.baseUrl + '/' + id;
		const response = await this.http.get(url).toPromise();
		this.AssertResponse(response);
		const item = response.json();
		return <T > item;
	}

	async findOne(query: any, sort?: any): Promise<T> {
		const result = await this.query(query, 1, sort);
		if(result && result.length === 1){
			return result[0];
		}
		throw new Error('Cannot find object');
	}

	async query(query: any, limit ? : number, sort ? : any): Promise < T[] > {
		const queryObject = {
			query,
			limit,
			sort
		};
		const queryString = this.objectToQueryString(queryObject);
		const url = this.baseUrl + "?" + queryString; 
		const response = await this.http.get(url).toPromise();
		this.AssertResponse(response);
		const list = response.json();
		return <T[] > list;
	}

	async create(item: T): Promise < string > {
		const response = await this.http.put(this.baseUrl, item).toPromise();
		this.AssertResponse(response, 201);
		return response.text(); // id
	}

	async update(item: T): Promise < T > {
		const response = await this.http.post(this.baseUrl, item).toPromise();
		this.AssertResponse(response);
		return item;
	}

	async delete(id: string): Promise < void > {
		const url = this.baseUrl + '/' + id;
		const response = await this.http.delete(url).toPromise();
		this.AssertResponse(response);
	}
}

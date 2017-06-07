import {
	Injectable
} from '@angular/core';
import {
	Http,
	Response,
	URLSearchParams
} from '@angular/http';
import {MediOrder, Lease,  Patient,   User,    Doctor} from '../../data/dtos';
import * as moment from "moment";

const REST_API_BASE_URL: string = "http://localhost:8141/api/v1/";

export interface IRestApi < T > {
	list(limit ? : number, sort ? : any): Promise < T[] > ;
	get(id: string): Promise < T > ;
	findOne(query: any, sort?: any): Promise<T>;
	query(query: any, limit ? : number, sort ? : any): Promise < T[] > ;
	create(item: T): Promise < string > ;
	update(item: T): Promise < T > ;
	delete(id: string): Promise < void > ;
}

export interface IRawRestApi {
	get(path: string): Promise<any>;
	post(path: string, body: any): Promise<any>;
	put(path: string, body: any): Promise<any>;
	delete(path: string): Promise<any>;
}

class RestApi < T > implements IRestApi < T > {
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
		return REST_API_BASE_URL + this.typeName;
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

class LeaseApi extends RestApi<Lease> {
	private async getLease(id: string): Promise<Lease> {
		const lease = await this.get(id);
		if(!lease) {
			throw new Error('Cannot find lease');
		}
		if(lease.expire_at < moment.utc().toDate()) {
			throw new Error('The lease has expired');
		}
		return lease;
	}

	async require(leaseId: string, userId: string): Promise<Lease>{
		const lease = await this.getLease(leaseId);
		if(lease.requiredBy){
			throw new Error('The lease has been required');	
		}
		lease.requiredBy = userId;
		return this.update(lease);
	}

	async approve(leaseId: string, userId: string): Promise<Lease>{
		const lease = await this.getLease(leaseId);
		if(!lease.requiredBy){
			throw new Error(`The lease hasn't been required`);	
		}
		if(lease.approvedBy){
			throw new Error('The lease has been acknowledged');	
		}
		lease.approvedBy = userId;
		return this.update(lease);
	}

	async reject(leaseId: string, userId: string): Promise<Lease>{
		const lease = await this.getLease(leaseId);
		if(lease.cancelledBy){
			throw new Error('The lease has been cancelled');	
		}
		if(lease.rejectedBy){
			throw new Error('The lease has been rejected');	
		}
		lease.rejectedBy = userId;
		return this.update(lease);
	}

	async cancel(leaseId: string, userId: string): Promise<Lease>{
		const lease = await this.getLease(leaseId);
		if(lease.cancelledBy){
			throw new Error('The lease has been cancelled');	
		}
		lease.cancelledBy = userId;
		return this.update(lease);
	}
}

class RawRestApi implements IRawRestApi {
	constructor(private http: Http) { }

	private getFullUrl(path: string){
		return /^https?:\/\//i.test(path) ?
			path :
			REST_API_BASE_URL + path.replace(/^\/*/, "");
	}

	async get(path: string): Promise<any> {
		const url = this.getFullUrl(path);
		var response = await this.http.get(url).toPromise();
		if(response.status !== 200) {
			throw new Error(response.text());
		}
		return response.json();
	}
	async post(path: string, body: any): Promise<any> {
		const url = this.getFullUrl(path);
		var response = await this.http.post(url, body).toPromise();
		if(response.status !== 200) {
			throw new Error(response.text());
		}
		return response.json();
	}
	async put(path: string, body: any): Promise<any> {
		const url = this.getFullUrl(path);
		var response = await this.http.put(url, body).toPromise();
		if(response.status !== 201) {
			throw new Error(response.text());
		}
		return response.json();
	}
	async delete(path: string): Promise<any> {
		const url = this.getFullUrl(path);
		var response = await this.http.delete(url).toPromise();
		if(response.status !== 200) {
			throw new Error(response.text());
		}
		return response.json();
	}
}

@Injectable()
export class ApiService {
	constructor(private http: Http) {}

	forType<T>(type: string): IRestApi<T> {
		return new RestApi<T>(type, this.http);
	}

	get restApiBaseUrl():string{
		return REST_API_BASE_URL;
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

	get lease(): LeaseApi {
		return new LeaseApi('lease', this.http);
	}

	get raw(): IRawRestApi {
		return new RawRestApi(this.http);
	}
}
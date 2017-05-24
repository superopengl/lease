import {
	Injectable
} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as dto from "../../../src/data/dtos";

@Injectable()
export class SignInUpService {
	private loginUrl: string = "http://localhost:8141/api/v1/login";
	private baseUrl: string = "http://localhost:8141/api/v1/user";
	constructor(private http: Http){

	}

	async login(name: string, password: string): Promise<dto.User> {
		let user: dto.User = {
			name,
			password
		};
		const response = await this.http.post(this.loginUrl, user).toPromise();
		user = response.json();
		return user;
	}

	async signUp(name: string, password: string): Promise<dto.User> {
		const user: dto.User = {
			name,
			password
		};
		const response = await this.http.put(this.baseUrl, user).toPromise();
		user.id = response.text();
		return user;
	}
}

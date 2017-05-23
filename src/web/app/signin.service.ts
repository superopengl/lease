import {
	Injectable
} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as dto from "../../../src/data/dtos";

@Injectable()
export class SignInUpService {
	private baseUrl: string = "http://localhost:8141/api/v1/user"
	constructor(private http: Http){

	}

	async signIn(name: string, password: string): Promise<dto.User> {
		// this.http.get(baseUrl)
		return null;
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

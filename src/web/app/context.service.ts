import {
	Injectable
} from '@angular/core';
import { Http, Response } from '@angular/http';
import { CookieService } from 'ng2-cookies';
import { User } from "../../data/dtos";

@Injectable()
export class ContextService {
	role: string;
	user: User;
	private userApiUrl: string = "http://localhost:8141/api/v1/user";

	constructor(private cookieService: CookieService, private http: Http){
	}

	async getUser(): Promise<User>{
		const userId = this.cookieService.get('userId');
		if(!userId) {
			this.user = null;
			return null;
		}
		if(!this.user || this.user.id !== userId) {
			const url = this.userApiUrl + '/' + userId;
			let response = await this.http.get(url).toPromise();
			if(response.status === 200) {
				this.user = response.json();
			}
		}
		return this.user;
	}

	isPatient(): boolean {
		return this.role === 'patient';
	}

	isDoctor(): boolean {
		return this.role === 'doctor';
	}
}
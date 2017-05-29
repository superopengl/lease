import {
	Injectable
} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import * as dto from "../../../src/data/dtos";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { ApiService } from "./api.service";

@Injectable()
export class SignInUpService {
	private userUrl: string = "http://localhost:8141/api/v1/user";
	private user: dto.User;
	private subject: Subject<dto.User> = new Subject<dto.User>();

	constructor(private api: ApiService){

	}
	
	private setUser(user: dto.User): void {
		this.user = user;
		this.subject.next(user);
	}

	getUser(): Observable<dto.User> {
		return this.subject.asObservable();
	}

	async login(name: string, password: string): Promise<dto.User> {
		const user = await this.api.user.findOne({name, password});
		return user;
	}

	async signUp(name: string, password: string): Promise<dto.User> {
		const user: dto.User = {
			name,
			password
		};
		const id = await this.api.user.create(user);
		user.id = id;
		return user;
	}
}

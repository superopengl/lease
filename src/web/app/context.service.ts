import {
	Injectable
} from '@angular/core';
import { Http, Response } from '@angular/http';
import { CookieService } from 'ng2-cookies';
import { User } from "../../data/dtos";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

export interface Context {
	user: User;
	role: string;
}

@Injectable()
export class ContextService {
	private _context: Context = {
		user: null,
		role: null
	}
	private subject: Subject<Context> = new Subject<Context>();

	constructor(private cookieService: CookieService, private http: Http){
	}

	getContext(): Observable<Context>{
		return this.subject.asObservable();
	}

	setContext(user: User, role: string): void {
		this._context.user = user;
		this._context.role = role;
		this.subject.next();
	}

	get context(): Context {
		return this._context;
	}
}
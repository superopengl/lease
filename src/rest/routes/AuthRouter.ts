import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express';
import { User, Patient, Doctor } from "../../data/dtos";
import {
	apiFactory
} from "../../data/apis";
import { IGenericRepo } from "../../data/genericRepo";

class LoginInfo {
	name: string;
	password: string;
	role: string;
}

export class AuthRouter {
	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	public async login(req: Request, res: Response, next: NextFunction) {
		try{
			const login: LoginInfo = req.body;
			const name = login.name;
			const password = login.password;
			const roleName = login.role;
			if(!name || !password || !roleName){
				res.send(400, "Invalid request");
				return;
			}
			
			const userApi = apiFactory.produce('user');
			const result = await userApi.query({name, password});
			if(result.length===0){
				res.send(404, "Invalid credential");
				return;
			}

			const user: User = result[0];
			let role: Patient | Doctor;
			if(roleName === 'patient') {
				const result = await apiFactory.produce('patient').query({user_id: user.id});
				if(result.length === 0) {
					res.send(404, "Invalid patient role");
					return;
				}
				role = result[0];
			}else if(roleName === 'doctor'){
				const result = await apiFactory.produce('doctor').query({user_id: user.id});
				if(result.length === 0) {
					res.send(404, "Invalid doctor role");
					return;
				}
				role = result[0];
			}else {
				res.send(400, `Invalid role name '${roleName}'`);
				return;
			}
			
			res.send(200, {user, role});
		}catch(err){
			res.send(500, err.toString() + (<Error>err).stack);
		}
	}

	init() {
		this.router.post('/', this.login);
	}
}

export default new AuthRouter().router;

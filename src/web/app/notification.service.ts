import {
	Injectable
} from '@angular/core';

export class Notification {
	message: string;
	expireAt: Date;
	level: string;
}

@Injectable()
export class NotificationService {
	notifications: Notification[] = [];

	private add(message: any, level: string, expireAt?: Date): void {
		console.log('notification service added', message);
		const notification = {
			message: message.toString(),
			level,
			expireAt: expireAt || new Date(9999, 11, 31)
		};
		this.notifications.push(notification);
	}

	info(message: any){
		this.add(message, 'info');
	}

	warn(message: any){
		this.add(message, 'warning');
	}

	error(message: any){
		this.add(message, 'danger');
	}

	delete(notification: Notification): void {
		for(let i=0; i<this.notifications.length; i++){
			let n = this.notifications[i];
			if(n.message === notification.message && n.level === notification.level){
				this.notifications.splice(i, 1);
				return;
			}
		}
	}
}

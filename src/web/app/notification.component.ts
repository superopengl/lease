import {
	Component
} from '@angular/core';
import { NotificationService, Notification } from "./notification.service";

@Component({
	selector: 'meco-notification',
	templateUrl: 'notification.html'
})
export class NotificationComponent {

	constructor(private notificationService: NotificationService){
	}

	dismiss(notification: Notification) {
		this.notificationService.delete(notification);
	}

	get notifications(): Notification[] {
		return this.notificationService.notifications;
	}
}


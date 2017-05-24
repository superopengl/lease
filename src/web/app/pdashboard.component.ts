import {
	Component,
	OnInit
} from '@angular/core';
import { ContextService } from "./context.service";

@Component({
	selector: 'meco-pdashboard',
	templateUrl: 'pdashboard.html'
})
export class PatientDashboardComponent {
	mlogs: any[];
}
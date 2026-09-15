import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-footer',
	imports: [RouterLink],
	templateUrl: './footer.component.html',
	styles: [],
})
export class FooterComponent {
	currentYear = new Date().getFullYear();
	phoneHref = environment.phoneHref;
	phoneDisplay = environment.phoneDisplay;
	facebookUrl = environment.facebookUrl;
	instagramUrl = environment.instagramUrl;
	telegramUrl = environment.telegramUrl;
	chatGptUrl = environment.chatGptUrl;
}

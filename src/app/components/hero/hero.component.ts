import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-hero',
	imports: [FormsModule],
	templateUrl: './hero.component.html',
	styles: [],
})
export class HeroComponent {
	phoneHref = environment.phoneHref;
	telegramUrl = environment.telegramUrl;
	mapUrl = environment.mapUrl;
	addressDisplay = environment.addressDisplay;
}

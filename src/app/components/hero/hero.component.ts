import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-hero',
	imports: [FormsModule, TranslateDirective],
	templateUrl: './hero.component.html',
	styles: [],
})
export class HeroComponent {
	phoneHref = environment.phoneHref;
	telegramUrl = environment.telegramUrl;
	mapUrl = environment.mapUrl;
	addressDisplay = environment.addressDisplay;
}

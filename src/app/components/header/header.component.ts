import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.component.html',
	styles: [],
})
export class HeaderComponent {
	scrolled = false;
	phoneHref = environment.phoneHref;
	facebookUrl = environment.facebookUrl;
	instagramUrl = environment.instagramUrl;
	telegramUrl = environment.telegramUrl;

	@HostListener('window:scroll')
	onScroll() {
		this.scrolled = window.scrollY > 20;
	}
}

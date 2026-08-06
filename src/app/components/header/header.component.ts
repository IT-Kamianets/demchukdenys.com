import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
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

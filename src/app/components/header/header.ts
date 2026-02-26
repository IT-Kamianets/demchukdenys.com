import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';

@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
	templateUrl: './header.html',
	styles: [],
})
export class HeaderComponent {
	mobileMenuOpen = false;
	scrolled = false;

	@HostListener('window:scroll')
	onScroll() {
		this.scrolled = window.scrollY > 20;
	}
}

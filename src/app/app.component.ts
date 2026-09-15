import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanonicalService } from '@wawjs/ngx-default';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { FloatingContactComponent } from './components/floating-contact/floating-contact.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		HeaderComponent,
		FooterComponent,
		BackToTopComponent,
		FloatingContactComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class App {
	private readonly _canonicalService = inject(CanonicalService);

	constructor() {
		this._canonicalService.initialize();
	}
}

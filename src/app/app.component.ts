import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { FloatingContactComponent } from './components/floating-contact/floating-contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

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
export class App {}

import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-contact-form',
	imports: [FormsModule, ScrollAnimateDirective],
	templateUrl: './contact-form.component.html',
	styles: [],
})
export class ContactFormComponent {
	private _httpClient = inject(HttpClient);
	contactPhoneHref = environment.phoneHref;
	contactPhoneDisplay = environment.phoneDisplay;

	name = '';
	phone = '';
	email = '';
	address = '';
	message = '';
	submitted = false;

	onSubmit(): void {
		if (!this.name.trim() || !this.phone.trim()) {
			return;
		}

		this._httpClient
			.post<boolean>('https://api.webart.work/api/telegram/contact', {
				message: `Ім'я: ${this.name}\nТелефон: ${this.phone}\nEmail: ${this.email}\nАдреса: ${this.address}\nПовідомлення: ${this.message}`,
			})
			.subscribe({
				next: () => (this.submitted = true),
				error: (error: unknown) => console.error('Telegram contact request failed', error),
			});
	}

	resetForm(): void {
		this.name = '';
		this.phone = '';
		this.email = '';
		this.message = '';
		this.address = '';
		this.submitted = false;
	}
}

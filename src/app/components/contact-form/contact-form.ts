import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollAnimateDirective } from '../../directives/scroll-animate';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-contact-form',
	imports: [FormsModule, ScrollAnimateDirective],
	templateUrl: './contact-form.html',
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

	onSubmit() {
		if (this.name.trim() && this.phone.trim()) {
			this.submitted = true;
		}

		this._httpClient
			.post('https://api.webart.work/api/bot/message', {
				chatid: '-5135274845',
				message: `Ім'я: ${this.name}\nТелефон: ${this.phone}\nEmail: ${this.email}\nАдреса: ${this.address}\nПовідомлення: ${this.message}`,
			})
			.subscribe();
	}

	resetForm() {
		this.name = '';
		this.phone = '';
		this.email = '';
		this.message = '';
		this.address = '';
		this.submitted = false;
	}
}

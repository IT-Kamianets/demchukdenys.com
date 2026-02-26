import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollAnimateDirective } from '../../directives/scroll-animate';

@Component({
	selector: 'app-contact-form',
	imports: [FormsModule, ScrollAnimateDirective],
	templateUrl: './contact-form.html',
	styles: [],
})
export class ContactFormComponent {
	name = '';
	phone = '';
	email = '';
	message = '';
	submitted = false;

	onSubmit() {
		if (this.name.trim() && this.phone.trim()) {
			this.submitted = true;
		}
	}

	resetForm() {
		this.name = '';
		this.phone = '';
		this.email = '';
		this.message = '';
		this.submitted = false;
	}
}

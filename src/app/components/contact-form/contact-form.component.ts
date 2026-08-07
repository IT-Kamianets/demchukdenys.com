import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-contact-form',
	imports: [FormsModule, ScrollAnimateDirective],
	templateUrl: './contact-form.component.html',
	styles: [],
})
export class ContactFormComponent implements AfterViewInit {
	private _httpClient = inject(HttpClient);
	contactPhoneHref = environment.phoneHref;
	contactPhoneDisplay = environment.phoneDisplay;

	@ViewChild('formEl') private _formEl?: ElementRef<HTMLElement>;
	formMinHeight: number | null = null;

	name = '';
	phone = '';
	address = '';
	message = '';
	submitted = false;

	ngAfterViewInit(): void {
		this.formMinHeight = this._formEl?.nativeElement.offsetHeight ?? null;
	}

	onSubmit(): void {
		if (!this.name.trim() || !this.phone.trim()) {
			return;
		}

		this._httpClient
			.post<boolean>('https://it.webart.work/api/telegram/contact', {
				message: `Demchuk Denys (Website)\nІм'я: ${this.name}\nТелефон: ${this.phone}\nАдреса: ${this.address}\nПовідомлення: ${this.message}`,
			})
			.subscribe({
				next: () => (this.submitted = true),
				error: (error: unknown) => console.error('Telegram contact request failed', error),
			});
	}

	resetForm(): void {
		this.name = '';
		this.phone = '';
		this.message = '';
		this.address = '';
		this.submitted = false;
	}
}

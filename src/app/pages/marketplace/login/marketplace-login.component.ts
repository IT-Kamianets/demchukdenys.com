import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../feature/firebase/auth.service';

@Component({
	selector: 'app-marketplace-login',
	imports: [FormsModule],
	templateUrl: './marketplace-login.component.html',
	styles: [],
})
export class MarketplaceLoginPage implements OnInit {
	private readonly _auth = inject(AuthService);
	private readonly _router = inject(Router);

	email = '';
	password = '';
	error = '';
	loading = false;

	async ngOnInit(): Promise<void> {
		const user = await this._auth.ready();

		if (user) {
			void this._router.navigate(['/admin']);
		}
	}

	async onSubmit(): Promise<void> {
		this.error = '';
		this.loading = true;

		try {
			await this._auth.signIn(this.email.trim(), this.password);
			void this._router.navigate(['/admin']);
		} catch {
			this.error = 'Невірний email або пароль.';
		} finally {
			this.loading = false;
		}
	}
}

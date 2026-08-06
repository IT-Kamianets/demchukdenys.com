import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-floating-contact',
	imports: [],
	template: `
		<div class="fixed bottom-6 right-6 z-40">
			<!-- Menu items -->
			@if (open) {
				<div class="flex flex-col gap-3 mb-3 animate-[fadeIn_0.2s_ease-out]">
					<a
						[href]="facebookUrl"
						target="_blank"
						rel="noopener"
						class="w-12 h-12 bg-[#1877F2] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
						aria-label="Facebook"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
							/>
						</svg>
					</a>
					<a
						[href]="instagramUrl"
						target="_blank"
						rel="noopener"
						class="w-12 h-12 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
						style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
						aria-label="Instagram"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
							/>
						</svg>
					</a>
					<a
						[href]="telegramUrl"
						target="_blank"
						rel="noopener"
						class="w-12 h-12 bg-[#2AABEE] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
						aria-label="Telegram"
					>
						<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
							/>
						</svg>
					</a>
					<a
						[href]="phoneHref"
						class="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
						aria-label="Зателефонувати"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
							/>
						</svg>
					</a>
				</div>
			}

			<!-- Main button -->
			<button
				(click)="open = !open"
				class="w-14 h-14 bg-beige text-dark rounded-full shadow-lg flex items-center justify-center hover:bg-beige-light transition-all duration-300"
				[class]="open ? 'rotate-45' : ''"
				aria-label="Зв'язатися з нами"
			>
				@if (!open) {
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
						/>
					</svg>
				} @else {
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				}
			</button>
		</div>
	`,
})
export class FloatingContactComponent {
	open = false;
	phoneHref = environment.phoneHref;
	facebookUrl = environment.facebookUrl;
	instagramUrl = environment.instagramUrl;
	telegramUrl = environment.telegramUrl;
}

import { Component } from '@angular/core';
import { ScrollAnimateDirective } from '../../directives/scroll-animate';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-cta-banner',
	imports: [ScrollAnimateDirective],
	template: `
		<section class="py-16 lg:py-20 bg-beige relative overflow-hidden" appScrollAnimate>
			<div
				class="absolute inset-0 opacity-10"
				style='background-image: url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%231a1a1a" fill-opacity="0.15"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;);'
			></div>
			<div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-4">
					Готові створити меблі вашої мрії?
				</h2>
				<p class="text-dark/70 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
					Безкоштовна консультація та замір приміщення. Зателефонуйте нам або залиште
					заявку.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
					<a
						[href]="phoneHref"
						class="inline-flex items-center px-8 py-3 bg-dark text-white font-semibold rounded-lg hover:bg-dark-light transition-colors"
					>
						<svg
							class="w-5 h-5 mr-2"
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
						Зателефонувати
					</a>
					<a
						[href]="telegramUrl"
						target="_blank"
						rel="noopener"
						class="inline-flex items-center px-8 py-3 bg-white/80 text-dark font-semibold rounded-lg hover:bg-white transition-colors"
					>
						<svg
							class="w-5 h-5 mr-2"
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
						Написати в Telegram
					</a>
					<a
						[href]="mapUrl"
						target="_blank"
						rel="noopener"
						class="inline-flex items-center px-8 py-3 bg-white/80 text-dark font-semibold rounded-lg hover:bg-white transition-colors"
					>
						<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
							/>
						</svg>
						{{ addressDisplay }}
					</a>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class CtaBannerComponent {
	phoneHref = environment.phoneHref;
	telegramUrl = environment.telegramUrl;
	mapUrl = environment.mapUrl;
	addressDisplay = environment.addressDisplay;
}

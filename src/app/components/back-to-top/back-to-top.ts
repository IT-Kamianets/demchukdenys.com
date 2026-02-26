import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-back-to-top',
	imports: [],
	template: `
		@if (visible) {
			<button
				(click)="scrollToTop()"
				class="fixed bottom-6 right-6 z-40 w-12 h-12 bg-beige text-dark rounded-full shadow-lg flex items-center justify-center hover:bg-beige-light transition-all duration-300 animate-[fadeIn_0.3s_ease-out]"
				aria-label="Прокрутити вгору"
			>
				<svg
					class="w-5 h-5"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4.5 15.75l7.5-7.5 7.5 7.5"
					/>
				</svg>
			</button>
		}
	`,
	styles: [],
})
export class BackToTopComponent {
	visible = false;

	@HostListener('window:scroll')
	onScroll() {
		this.visible = window.scrollY > 400;
	}

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}

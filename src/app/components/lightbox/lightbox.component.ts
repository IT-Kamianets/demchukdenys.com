import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
	selector: 'app-lightbox',
	imports: [],
	template: `
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-[fadeIn_0.2s_ease-out]"
			(click)="close.emit()"
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
				aria-label="Закрити"
				(click)="close.emit()"
			>
				<svg
					class="w-8 h-8"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Previous button -->
			@if (images.length > 1) {
				<button
					class="absolute left-4 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
					aria-label="Попереднє фото"
					(click)="prev($event)"
				>
					<svg
						class="w-8 h-8"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 19.5L8.25 12l7.5-7.5"
						/>
					</svg>
				</button>

				<button
					class="absolute right-4 z-10 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
					aria-label="Наступне фото"
					(click)="next($event)"
				>
					<svg
						class="w-8 h-8"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 4.5l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</button>
			}

			<!-- Image -->
			<img
				[src]="images[currentIndex]"
				alt=""
				class="max-h-[90vh] max-w-[90vw] object-contain"
				(click)="$event.stopPropagation()"
			/>
		</div>
	`,
})
export class LightboxComponent {
	@Input() images: string[] = [];
	@Input() currentIndex = 0;
	@Output() close = new EventEmitter<void>();

	@HostListener('document:keydown.escape')
	onEscape() {
		this.close.emit();
	}

	@HostListener('document:keydown.arrowleft')
	onLeft() {
		if (this.images.length > 1) {
			this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
		}
	}

	@HostListener('document:keydown.arrowright')
	onRight() {
		if (this.images.length > 1) {
			this.currentIndex = (this.currentIndex + 1) % this.images.length;
		}
	}

	prev(event: Event) {
		event.stopPropagation();
		this.onLeft();
	}

	next(event: Event) {
		event.stopPropagation();
		this.onRight();
	}
}

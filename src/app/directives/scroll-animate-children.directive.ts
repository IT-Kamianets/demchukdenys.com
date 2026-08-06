import { isPlatformBrowser } from '@angular/common';
import {
	Directive,
	ElementRef,
	inject,
	Input,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
} from '@angular/core';

@Directive({
	selector: '[appScrollAnimateChildren]',
})
export class ScrollAnimateChildrenDirective implements OnInit, OnDestroy {
	@Input() staggerDelay = 100;
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private observer?: IntersectionObserver;

	constructor(private el: ElementRef<HTMLElement>) {}

	ngOnInit(): void {
		if (!this._isBrowser) {
			return;
		}

		const container = this.el.nativeElement;

		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const children = Array.from(container.children) as HTMLElement[];
						children.forEach((child, index) => {
							child.style.opacity = '0';
							child.style.transform = 'translateY(20px)';
							child.style.transition = `opacity 0.5s ease-out ${index * this.staggerDelay}ms, transform 0.5s ease-out ${index * this.staggerDelay}ms`;

							requestAnimationFrame(() => {
								child.style.opacity = '1';
								child.style.transform = 'translateY(0)';
							});
						});
						this.observer?.unobserve(container);
					}
				});
			},
			{ threshold: 0.1 },
		);

		// Pre-hide children
		const children = Array.from(container.children) as HTMLElement[];
		children.forEach((child) => {
			child.style.opacity = '0';
			child.style.transform = 'translateY(20px)';
		});

		this.observer.observe(container);
	}

	ngOnDestroy(): void {
		this.observer?.disconnect();
	}
}

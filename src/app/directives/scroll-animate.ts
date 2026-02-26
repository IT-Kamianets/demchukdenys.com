import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
	selector: '[appScrollAnimate]',
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
	private observer!: IntersectionObserver;

	constructor(private el: ElementRef<HTMLElement>) {}

	ngOnInit() {
		const element = this.el.nativeElement;
		element.style.opacity = '0';
		element.style.transform = 'translateY(30px)';
		element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

		this.observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						element.style.opacity = '1';
						element.style.transform = 'translateY(0)';
						this.observer.unobserve(element);
					}
				});
			},
			{ threshold: 0.1 },
		);

		this.observer.observe(element);
	}

	ngOnDestroy() {
		this.observer.disconnect();
	}
}

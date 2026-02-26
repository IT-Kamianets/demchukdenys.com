import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../directives/scroll-animate';

@Component({
	selector: 'app-portfolio',
	imports: [RouterLink, ScrollAnimateDirective],
	templateUrl: './portfolio.html',
	styles: [],
})
export class PortfolioComponent implements OnInit, OnDestroy {
	currentSlide = 0;
	private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
	private touchStartX = 0;

	portfolioItems = [
		{
			id: 1,
			title: 'Кухня «Біла класика»',
			description: "П-подібна кухня з дерев'яною стільницею та темним фартухом",
			image: 'img/slider/k1.webp',
		},
		{
			id: 2,
			title: 'Кухня з барною стійкою',
			description: 'Сучасна сіра кухня з барною зоною та оксамитовими стільцями',
			image: 'img/slider/k3.webp',
		},
		{
			id: 3,
			title: 'Спальний гарнітур',
			description: "Ліжко з м'яким узголів'ям та приліжковою тумбою",
			image: 'img/slider/m1.webp',
		},
		{
			id: 4,
			title: 'Кухня «Мінімалізм»',
			description: 'Пряма кухня у бежевих тонах з вбудованою технікою',
			image: 'img/services/k4.webp',
		},
		{
			id: 5,
			title: 'Гардеробна система',
			description: 'Біла гардеробна з дзеркальною секцією та робочим столом',
			image: 'img/services/p4.webp',
		},
	];

	ngOnInit() {
		this.startAutoPlay();
	}

	ngOnDestroy() {
		this.stopAutoPlay();
	}

	nextSlide() {
		this.currentSlide = (this.currentSlide + 1) % this.portfolioItems.length;
	}

	prevSlide() {
		this.currentSlide =
			(this.currentSlide - 1 + this.portfolioItems.length) % this.portfolioItems.length;
	}

	onTouchStart(event: TouchEvent) {
		this.touchStartX = event.touches[0].clientX;
	}

	onTouchEnd(event: TouchEvent) {
		const touchEndX = event.changedTouches[0].clientX;
		const diff = this.touchStartX - touchEndX;

		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				this.nextSlide();
			} else {
				this.prevSlide();
			}
		}
	}

	startAutoPlay() {
		this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
	}

	stopAutoPlay() {
		if (this.autoPlayInterval) {
			clearInterval(this.autoPlayInterval);
			this.autoPlayInterval = null;
		}
	}
}

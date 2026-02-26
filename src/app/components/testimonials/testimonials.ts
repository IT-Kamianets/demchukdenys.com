import { Component } from '@angular/core';
import { ScrollAnimateDirective } from '../../directives/scroll-animate';
import { ScrollAnimateChildrenDirective } from '../../directives/scroll-animate-children';

@Component({
	selector: 'app-testimonials',
	imports: [ScrollAnimateDirective, ScrollAnimateChildrenDirective],
	template: `
		<section class="py-20 lg:py-28 bg-white dark:bg-dark-light" appScrollAnimate>
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center mb-16">
					<span
						class="text-xs uppercase tracking-widest text-beige-dark dark:text-beige font-semibold mb-3 block"
						>Відгуки</span
					>
					<h2
						class="text-3xl md:text-4xl lg:text-5xl font-bold text-dark dark:text-white mb-4"
					>
						Що кажуть клієнти
					</h2>
					<p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
						Нам довіряють сотні задоволених клієнтів по всій Україні
					</p>
				</div>

				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
					appScrollAnimateChildren
					[staggerDelay]="120"
				>
					@for (testimonial of testimonials; track testimonial.name) {
						<div class="bg-warm-white dark:bg-dark rounded-2xl p-5 sm:p-8 relative">
							<!-- Quote icon -->
							<svg
								class="w-10 h-10 text-beige/40 mb-4"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z"
								/>
							</svg>

							<p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
								{{ testimonial.text }}
							</p>

							<!-- Stars -->
							<div class="flex gap-1 mb-4">
								@for (star of [1, 2, 3, 4, 5]; track star) {
									<svg
										class="w-5 h-5"
										[class]="
											star <= testimonial.rating
												? 'text-yellow-400'
												: 'text-gray-300 dark:text-gray-600'
										"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
										/>
									</svg>
								}
							</div>

							<div class="flex items-center">
								<div
									class="w-10 h-10 bg-beige/30 rounded-full flex items-center justify-center text-dark dark:text-white font-bold text-sm mr-3"
								>
									{{ testimonial.initials }}
								</div>
								<div>
									<p class="font-semibold text-dark dark:text-white text-sm">
										{{ testimonial.name }}
									</p>
									<p class="text-gray-400 text-xs">{{ testimonial.project }}</p>
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		</section>
	`,
})
export class TestimonialsComponent {
	testimonials = [
		{
			name: 'Denys Honchar',
			initials: 'ДГ',
			text: 'Із задоволенням ділюся своєю вдячністю компанії за чудову роботу над дизайном та виготовленням меблів для кухні, дитячої кімнати, ванної кімнати та оселі загалом. Кожен предмет меблів, який вони створили, вражає своєю елегантністю та вишуканістю. Компанія проявила велике розуміння наших індивідуальних потреб. Рекомендую їхні послуги всім, хто шукає не тільки меблі, але й високий рівень сервісу та турботи про клієнта.',
			rating: 5,
			project: 'Меблі для квартири',
		},
		{
			name: 'Dmytro Maksiuta',
			initials: 'ДМ',
			text: 'Вдячний Денису Демчуку за високоякісний стіл, який він виготовив для мене на замовлення. Його майстерність і увага до деталей дозволили отримати не лише функціональний, а й дуже стильний стіл для роботи за комп\'ютером.',
			rating: 5,
			project: 'Стіл на замовлення',
		},
		{
			name: 'Юля Тимчук',
			initials: 'ЮТ',
			text: 'Величезне спасибі за якісно виконану роботу. Замовляла кухню, і дві шафи-купе. Якістю, термінами і роботою залишилася дуже задоволена.',
			rating: 5,
			project: 'Кухня та шафи-купе',
		},
		{
			name: 'Микола Мозолюк',
			initials: 'ММ',
			text: 'Вражений від високої якості меблів та відмінного обслуговування від цієї компанії. Виглядає надзвичайно стильно і функціонально. Дуже задоволений покупкою.',
			rating: 5,
			project: 'Меблі на замовлення',
		},
		{
			name: 'Владислава Джурик',
			initials: 'ВД',
			text: 'Дозамовляла шафу-купе, порекомендували знайомі. Якість просто ВАУ, шкодую що так пізно знайшли.',
			rating: 5,
			project: 'Шафа-купе',
		},
		{
			name: 'Роман Кваснюк',
			initials: 'РК',
			text: 'Гарно, швидко, професійно, дизайнерські меблі просто бомба!)',
			rating: 5,
			project: 'Дизайнерські меблі',
		},
		{
			name: 'Людмила Нікітіна',
			initials: 'ЛН',
			text: 'Замовляла шафу, якість чудова! Дизайнер дуже компетентна! Рекомендую!',
			rating: 5,
			project: 'Шафа на замовлення',
		},
		{
			name: 'Danzi',
			initials: 'D',
			text: 'Дуже якісно, рекомендую 😊',
			rating: 5,
			project: 'Меблі на замовлення',
		},
	];
}

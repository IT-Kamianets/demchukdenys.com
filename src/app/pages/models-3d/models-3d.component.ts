import { Component, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ModelViewerComponent } from '../../components/model-viewer/model-viewer.component';
import { SeoService } from '../../seo.service';

type Model3d = {
	title: string;
	description: string;
	src: string;
	credit?: string;
	creditUrl?: string;
};

@Component({
	selector: 'app-models-3d-page',
	imports: [RouterLink, ModelViewerComponent],
	templateUrl: './models-3d.component.html',
	styles: [],
})
export class Models3dPage implements OnInit {
	models: Model3d[] = [
		{
			title: 'Кухонна шафа',
			description: '3D-модель кухонної шафи.',
			src: 'models/kitchen-cabinet-1/scene.gltf',
			credit: 'ms_Butor · Sketchfab (CC-BY-4.0)',
			creditUrl: 'https://sketchfab.com/3d-models/kitchen-cabinet-1-6ad39b0f52ad439ea12cbfdc1a1dd37f',
		},
	];

	activeModel = signal<Model3d | null>(null);

	constructor(
		private title: Title,
		private meta: Meta,
		private seo: SeoService,
	) {}

	ngOnInit() {
		this.seo.setPage({
			title: '3D-моделі меблів | Demchuk Denys',
			description:
				'Перегляньте 3D-моделі кухонь та меблів на замовлення від Demchuk Denys. Обертайте модель, наближайте та розглядайте деталі з усіх боків.',
			path: '3d-models',
		});
		this.title.setTitle('3D-моделі - Demchuk Denys');
		this.meta.updateTag({
			name: 'description',
			content: 'Інтерактивні 3D-моделі кухонь та меблів на замовлення від Demchuk Denys.',
		});
		this.meta.updateTag({ property: 'og:title', content: '3D-моделі - Demchuk Denys' });
		this.meta.updateTag({
			property: 'og:description',
			content: 'Інтерактивні 3D-моделі кухонь та меблів на замовлення від Demchuk Denys.',
		});

		this.activeModel.set(this.models[0] ?? null);
	}

	selectModel(model: Model3d) {
		this.activeModel.set(model);
	}
}

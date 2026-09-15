import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import { ModelViewerComponent } from '../../components/model-viewer/model-viewer.component';

type Model3d = {
	title: string;
	description: string;
	src: string;
	credit?: string;
	creditUrl?: string;
};

@Component({
	selector: 'app-models-3d-page',
	imports: [RouterLink, ModelViewerComponent, TranslateDirective],
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

	ngOnInit() {
		this.activeModel.set(this.models[0] ?? null);
	}

	selectModel(model: Model3d) {
		this.activeModel.set(model);
	}
}

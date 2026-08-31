import { isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	ViewChild,
	inject,
	signal,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
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
	imports: [RouterLink],
	templateUrl: './models-3d.component.html',
	styles: [
		`
			.model-viewer-box:fullscreen {
				width: 100vw;
				height: 100vh;
				aspect-ratio: auto;
				border-radius: 0;
			}
		`,
	],
})
export class Models3dPage implements OnInit, AfterViewInit, OnDestroy {
	private readonly platformId = inject(PLATFORM_ID);

	@ViewChild('viewer', { static: false }) private viewerRef?: ElementRef<HTMLDivElement>;
	@ViewChild('viewerContainer', { static: false })
	private viewerContainerRef?: ElementRef<HTMLDivElement>;

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
	loading = signal(false);
	loadError = signal(false);
	isFullscreen = signal(false);

	@HostListener('document:fullscreenchange')
	onFullscreenChange() {
		this.isFullscreen.set(document.fullscreenElement === this.viewerContainerRef?.nativeElement);
		this.onResize();
	}

	private threeApi?: typeof import('three');
	private scene?: import('three').Scene;
	private camera?: import('three').PerspectiveCamera;
	private renderer?: import('three').WebGLRenderer;
	private controls?: import('three/examples/jsm/controls/OrbitControls.js').OrbitControls;
	private currentObject?: import('three').Object3D;
	private resizeObserver?: ResizeObserver;
	private animationFrameId?: number;

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

	async ngAfterViewInit() {
		if (!isPlatformBrowser(this.platformId) || !this.viewerRef) return;

		await this.initThree();

		const model = this.activeModel();
		if (model) {
			this.loadModel(model);
		}
	}

	ngOnDestroy() {
		if (this.animationFrameId !== undefined) {
			cancelAnimationFrame(this.animationFrameId);
		}
		this.resizeObserver?.disconnect();
		this.controls?.dispose();
		this.renderer?.dispose();
	}

	selectModel(model: Model3d) {
		if (this.activeModel() === model) return;
		this.activeModel.set(model);
		this.loadModel(model);
	}

	toggleFullscreen() {
		const container = this.viewerContainerRef?.nativeElement;
		if (!container) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
	}

	private async initThree() {
		const THREE = await import('three');
		this.threeApi = THREE;

		const container = this.viewerRef!.nativeElement;
		const width = container.clientWidth;
		const height = container.clientHeight;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
		camera.position.set(2, 1.5, 3);

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(width, height);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		container.appendChild(renderer.domElement);

		scene.add(new THREE.AmbientLight(0xffffff, 0.9));
		const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
		keyLight.position.set(3, 5, 4);
		scene.add(keyLight);
		const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
		fillLight.position.set(-4, -2, -3);
		scene.add(fillLight);

		const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;

		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		this.controls = controls;

		this.resizeObserver = new ResizeObserver(() => this.onResize());
		this.resizeObserver.observe(container);

		const animate = () => {
			this.animationFrameId = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();
	}

	private onResize() {
		if (!this.renderer || !this.camera || !this.viewerRef) return;
		const container = this.viewerRef.nativeElement;
		const width = container.clientWidth;
		const height = container.clientHeight;
		if (width === 0 || height === 0) return;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}

	private async loadModel(model: Model3d) {
		if (!this.scene || !this.threeApi) return;
		const THREE = this.threeApi;

		this.loading.set(true);
		this.loadError.set(false);

		if (this.currentObject) {
			this.scene.remove(this.currentObject);
			this.currentObject = undefined;
		}

		try {
			const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
			const loader = new GLTFLoader();
			const gltf = await loader.loadAsync(model.src);
			const object = gltf.scene;

			// Центруємо та масштабуємо модель так, щоб вона вміщалась у вʼюпорт
			const box = new THREE.Box3().setFromObject(object);
			const size = box.getSize(new THREE.Vector3());
			const center = box.getCenter(new THREE.Vector3());
			const maxDimension = Math.max(size.x, size.y, size.z) || 1;
			const scale = 2 / maxDimension;

			object.position.sub(center);
			object.scale.setScalar(scale);

			this.scene.add(object);
			this.currentObject = object;
		} catch {
			this.loadError.set(true);
		} finally {
			this.loading.set(false);
		}
	}
}

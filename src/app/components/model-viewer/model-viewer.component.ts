import { isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	PLATFORM_ID,
	SimpleChanges,
	ViewChild,
	inject,
	signal,
} from '@angular/core';

export type ModelLabel = {
	id: number;
	text: string;
	/** Локальні координати (у власних одиницях моделі, ще до центрування/масштабування) */
	x: number;
	y: number;
	z: number;
};

@Component({
	selector: 'app-model-viewer',
	imports: [],
	templateUrl: './model-viewer.component.html',
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
export class ModelViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
	private readonly platformId = inject(PLATFORM_ID);

	@Input({ required: true }) src!: string;
	@Input() labels: ModelLabel[] = [];
	@Output() labelClick = new EventEmitter<number>();

	@ViewChild('viewer', { static: false }) private viewerRef?: ElementRef<HTMLDivElement>;
	@ViewChild('viewerContainer', { static: false })
	private viewerContainerRef?: ElementRef<HTMLDivElement>;

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
	private labelRenderer?: import('three/examples/jsm/renderers/CSS2DRenderer.js').CSS2DRenderer;
	private controls?: import('three/examples/jsm/controls/OrbitControls.js').OrbitControls;
	private currentObject?: import('three').Object3D;
	private resizeObserver?: ResizeObserver;
	private animationFrameId?: number;
	private viewReady = false;

	async ngAfterViewInit() {
		this.viewReady = true;
		if (!isPlatformBrowser(this.platformId) || !this.viewerRef) return;

		await this.initThree();
		if (this.src) this.loadModel(this.src);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['src'] && !changes['src'].firstChange && this.viewReady && this.scene) {
			this.loadModel(this.src);
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

		const { CSS2DRenderer } = await import('three/examples/jsm/renderers/CSS2DRenderer.js');
		const labelRenderer = new CSS2DRenderer();
		labelRenderer.setSize(width, height);
		labelRenderer.domElement.style.position = 'absolute';
		labelRenderer.domElement.style.top = '0';
		labelRenderer.domElement.style.left = '0';
		labelRenderer.domElement.style.pointerEvents = 'none';
		container.appendChild(labelRenderer.domElement);

		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		this.labelRenderer = labelRenderer;
		this.controls = controls;

		this.resizeObserver = new ResizeObserver(() => this.onResize());
		this.resizeObserver.observe(container);

		const animate = () => {
			this.animationFrameId = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
			labelRenderer.render(scene, camera);
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
		this.labelRenderer?.setSize(width, height);
	}

	private async loadModel(src: string) {
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
			const gltf = await loader.loadAsync(src);
			const object = gltf.scene;

			// Центруємо та масштабуємо модель так, щоб вона вміщалась у вʼюпорт
			const box = new THREE.Box3().setFromObject(object);
			const size = box.getSize(new THREE.Vector3());
			const center = box.getCenter(new THREE.Vector3());
			const maxDimension = Math.max(size.x, size.y, size.z) || 1;
			const scale = 2 / maxDimension;

			object.position.sub(center);
			object.scale.setScalar(scale);

			if (this.labels.length) {
				const { CSS2DObject } = await import('three/examples/jsm/renderers/CSS2DRenderer.js');
				for (const label of this.labels) {
					const el = document.createElement('div');
					el.textContent = String(label.text);
					el.className =
						'flex items-center justify-center w-6 h-6 rounded-full bg-dark text-white text-xs font-bold cursor-pointer border-2 border-white shadow';
					el.style.pointerEvents = 'auto';
					el.addEventListener('click', (e) => {
						e.stopPropagation();
						this.labelClick.emit(label.id);
					});

					const labelObject = new CSS2DObject(el);
					// Локальні координати мітки, дочірні до object — успадковують його трансформацію
					labelObject.position.set(label.x, label.y, label.z);
					object.add(labelObject);
				}
			}

			this.scene.add(object);
			this.currentObject = object;
		} catch {
			this.loadError.set(true);
		} finally {
			this.loading.set(false);
		}
	}
}

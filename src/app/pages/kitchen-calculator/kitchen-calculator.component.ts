import { DecimalPipe } from '@angular/common';
import { Component, OnInit, WritableSignal, computed, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

type CabinetType = 'base' | 'wall' | 'tall';
type FacadeType = 'doors' | 'drawers' | 'niche' | 'open';

/** Один рівень високого пенала (напр. духовка, НВЧ, двері) — пенал складається із стосу сегментів */
type TallSegment = {
	height: number; // мм
	facadeType: FacadeType;
	facades: number;
	applianceLabel: string;
};

type Cabinet = {
	id: number;
	type: CabinetType;
	width: number; // мм
	height: number; // мм — для 'tall' обчислюється як сума segments
	depth: number; // мм
	facadeType: FacadeType;
	facades: number; // к-сть дверей / шухляд (ігнорується для niche/open/tall)
	shelves: number; // к-сть полиць
	applianceLabel: string; // назва техніки для ніші
	hasSink: boolean; // виріз під мийку та простір під сифон (без дна)
	hasCooktop: boolean; // конфорки варильної поверхні на стільниці цієї шафи
	cornerAfter: boolean; // після цієї шафи кухня повертає за кут (для схеми)
	segments: TallSegment[]; // тільки для type === 'tall'
};

type Part = {
	name: string;
	size: string;
	qty: number;
};

type CabinetBreakdown = {
	cabinet: Cabinet;
	parts: Part[];
	ldspArea: number; // м²
	facadeArea: number; // м²
	hdfArea: number; // м²
	edgeLength: number; // пог. м
};

type SchemaLine = { x1: number; y1: number; x2: number; y2: number };
type IconRect = { x: number; y: number; w: number; h: number; rx: number };
type IconCircle = { cx: number; cy: number; r: number };
type ApplianceIcon = { rects: IconRect[]; circles: IconCircle[] };

type FacadeVisual = {
	dashed: boolean;
	dividers: SchemaLine[];
	handles: SchemaLine[];
	label: string | null;
	applianceIcon: ApplianceIcon | null;
};

type SchemaSegment = FacadeVisual & { y: number; h: number };

type SchemaItem = FacadeVisual & {
	index: number;
	type: CabinetType;
	cabinet: Cabinet;
	x: number;
	y: number;
	w: number;
	h: number;
	sinkCutout: { x: number; y: number; w: number; h: number } | null;
	cooktopDots: IconCircle[];
	cornerAfter: boolean;
	cornerX: number;
	segments: SchemaSegment[];
};

const GAP = 3; // технологічний зазор між фасадами та по контуру, мм
const SHELF_SIDE_GAP = 2; // зазор полиці від боковини з кожного боку, мм
const SHELF_DEPTH_RECESS = 20; // відступ полиці по глибині, мм
const BACK_PANEL_REDUCTION = 3; // зменшення задньої стінки під паз, мм
const RAIL_WIDTH = 100; // ширина царги нижньої шафи, мм
const SCALE = 0.16; // px на мм у схемі
const ROW_GAP = 550; // умовний зазор між верхніми та нижніми шафами на схемі, мм
const CORNICE_HEIGHT = 60; // висота декоративного карниза над верхніми шафами, мм

@Component({
	selector: 'app-kitchen-calculator-page',
	imports: [RouterLink, DecimalPipe],
	templateUrl: './kitchen-calculator.component.html',
	styles: [],
})
export class KitchenCalculatorPage implements OnInit {
	// Параметри для швидкої генерації списку шаф
	lengthBase = signal(3.6); // довжина нижніх шаф, м
	lengthWall = signal(3.0); // довжина верхніх (навісних) шаф, м
	heightBase = signal(820); // висота нижніх шаф, мм
	heightWall = signal(720); // висота верхніх шаф, мм
	depthBase = signal(600); // глибина нижніх шаф, мм
	depthWall = signal(320); // глибина верхніх шаф, мм
	moduleWidth = signal(600); // ширина одного модуля (секції), мм

	// Товщина матеріалів
	thickness = signal(16); // товщина ЛДСП, мм
	backThickness = signal(3); // товщина задньої стінки (ХДФ), мм

	private nextId = 1;
	cabinets = signal<Cabinet[]>([]);

	breakdown = computed<CabinetBreakdown[]>(() =>
		this.cabinets().map((cabinet) => this.computeCabinet(cabinet)),
	);

	totalLength = computed(() => this.cabinets().reduce((sum, c) => sum + c.width, 0) / 1000);
	cabinetsCount = computed(() => this.cabinets().length);
	totalLdspArea = computed(() => this.breakdown().reduce((sum, b) => sum + b.ldspArea, 0));
	totalFacadeArea = computed(() => this.breakdown().reduce((sum, b) => sum + b.facadeArea, 0));
	totalHdfArea = computed(() => this.breakdown().reduce((sum, b) => sum + b.hdfArea, 0));
	totalEdgeLength = computed(() => this.breakdown().reduce((sum, b) => sum + b.edgeLength, 0));

	// Технічна схема (фасадна розгортка) кухні
	schema = computed(() => this.buildSchema());

	highlightedId = signal<number | null>(null);

	constructor(
		private title: Title,
		private meta: Meta,
		private seo: SeoService,
	) {}

	ngOnInit() {
		this.seo.setPage({
			title: 'Конструктив кухні - детальний розрахунок деталей | Demchuk Denys',
			description:
				'Технічна схема кухні з нумерацією шаф: розміри боковин, дна, полиць, фасадів, шухляд, ніш під техніку та задньої стінки.',
			path: 'kitchen-calculator',
		});
		this.title.setTitle('Конструктив кухні - Demchuk Denys');
		this.meta.updateTag({
			name: 'description',
			content: 'Детальна специфікація деталей кухні по кожній шафі від Demchuk Denys.',
		});
		this.meta.updateTag({ property: 'og:title', content: 'Конструктив кухні - Demchuk Denys' });
		this.meta.updateTag({
			property: 'og:description',
			content: 'Технічний розрахунок деталей кухні по кожній шафі, з нішами під техніку.',
		});

		this.loadKitchenPreset();
	}

	onNumberInput(sig: WritableSignal<number>, event: Event) {
		const value = (event.target as HTMLInputElement).valueAsNumber;
		sig.set(Number.isFinite(value) ? value : 0);
	}

	/**
	 * Набір шаф для цієї L-подібної кухні. Загальна довжина крил (3,41 м і 2,155 м) та
	 * висота (~2,1 м від підлоги до верху навісних шаф) виміряні напряму з bounding box
	 * 3D-моделі (public/models/kitchen-cabinet-1/scene.gltf). Сам файл моделі не містить
	 * розбивки на окремі шафи (геометрія злита в один об'єкт по матеріалах), тому склад і
	 * типи кожної шафи (двері/шухляди/ніші під техніку/мийка) визначені за фотографією
	 * рендеру моделі. Перше крило — до позначки "кут" на схемі, друге — після.
	 */
	loadKitchenPreset() {
		const base: Omit<Cabinet, 'id'>[] = [
			{
				// Пенал: верхня шафа-кришка + НВЧ + духовка + шафа з дверима на підлозі — одна суцільна колона
				type: 'tall',
				width: 600,
				height: 0,
				depth: 600,
				facadeType: 'doors',
				facades: 1,
				shelves: 0,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				cornerAfter: false,
				segments: [
					{ height: 400, facadeType: 'doors', facades: 1, applianceLabel: '' },
					{ height: 400, facadeType: 'niche', facades: 0, applianceLabel: 'Мікрохвильова піч' },
					{ height: 600, facadeType: 'niche', facades: 0, applianceLabel: 'Духова шафа' },
					{ height: 620, facadeType: 'doors', facades: 1, applianceLabel: '' },
				],
			},
			{
				type: 'base',
				width: 450,
				height: 820,
				depth: 600,
				facadeType: 'drawers',
				facades: 3,
				shelves: 0,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'base',
				width: 900,
				height: 820,
				depth: 600,
				facadeType: 'doors',
				facades: 2,
				shelves: 1,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: true,
			},
			{
				type: 'base',
				width: 600,
				height: 820,
				depth: 600,
				facadeType: 'doors',
				facades: 1,
				shelves: 1,
				applianceLabel: '',
				hasSink: true,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'base',
				width: 600,
				height: 820,
				depth: 600,
				facadeType: 'doors',
				facades: 1,
				shelves: 1,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: true,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'base',
				width: 450,
				height: 820,
				depth: 600,
				facadeType: 'drawers',
				facades: 3,
				shelves: 0,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'base',
				width: 600,
				height: 820,
				depth: 600,
				facadeType: 'doors',
				facades: 2,
				shelves: 1,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'base',
				width: 450,
				height: 820,
				depth: 600,
				facadeType: 'open',
				facades: 0,
				shelves: 3,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'wall',
				width: 600,
				height: 720,
				depth: 320,
				facadeType: 'doors',
				facades: 2,
				shelves: 2,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'wall',
				width: 600,
				height: 720,
				depth: 320,
				facadeType: 'doors',
				facades: 2,
				shelves: 2,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: true,
			},
			{
				type: 'wall',
				width: 600,
				height: 720,
				depth: 320,
				facadeType: 'doors',
				facades: 1,
				shelves: 2,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'wall',
				width: 600,
				height: 500,
				depth: 320,
				facadeType: 'niche',
				facades: 0,
				shelves: 0,
				applianceLabel: 'Витяжка',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'wall',
				width: 600,
				height: 720,
				depth: 320,
				facadeType: 'doors',
				facades: 1,
				shelves: 2,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
			{
				type: 'wall',
				width: 300,
				height: 720,
				depth: 320,
				facadeType: 'open',
				facades: 0,
				shelves: 3,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments: [],
				cornerAfter: false,
			},
		];

		this.cabinets.set(base.map((c) => ({ id: this.nextId++, ...c })));
	}

	generateCabinets() {
		const cabinets: Cabinet[] = [];
		cabinets.push(
			...this.splitIntoModules('base', this.lengthBase(), this.heightBase(), this.depthBase()),
		);
		cabinets.push(
			...this.splitIntoModules('wall', this.lengthWall(), this.heightWall(), this.depthWall()),
		);
		this.cabinets.set(cabinets);
	}

	private splitIntoModules(
		type: CabinetType,
		lengthMeters: number,
		height: number,
		depth: number,
	): Cabinet[] {
		const totalWidth = Math.round(lengthMeters * 1000);
		const module = Math.max(1, Math.round(this.moduleWidth()));
		if (totalWidth <= 0) return [];

		const count = Math.max(1, Math.round(totalWidth / module));
		const baseWidth = Math.floor(totalWidth / count);
		const remainder = totalWidth - baseWidth * count;

		return Array.from({ length: count }, (_, i) => ({
			id: this.nextId++,
			type,
			width: baseWidth + (i < remainder ? 1 : 0),
			height,
			depth,
			facadeType: 'doors' as FacadeType,
			facades: baseWidth >= 500 ? 2 : 1,
			shelves: type === 'wall' ? 2 : 1,
			applianceLabel: '',
			hasSink: false,
			hasCooktop: false,
			segments: [],
			cornerAfter: false,
		}));
	}

	addCabinet(type: CabinetType) {
		this.cabinets.update((list) => [
			...list,
			{
				id: this.nextId++,
				type,
				width: this.moduleWidth(),
				height: type === 'wall' ? this.heightWall() : this.heightBase(),
				depth: type === 'wall' ? this.depthWall() : this.depthBase(),
				facadeType: 'doors',
				facades: 1,
				shelves: type === 'wall' ? 2 : 1,
				applianceLabel: '',
				hasSink: false,
				hasCooktop: false,
				segments:
					type === 'tall'
						? [
								{ height: 400, facadeType: 'doors', facades: 1, applianceLabel: '' },
								{ height: 600, facadeType: 'niche', facades: 0, applianceLabel: 'Духова шафа' },
								{ height: 700, facadeType: 'doors', facades: 1, applianceLabel: '' },
							]
						: [],
				cornerAfter: false,
			},
		]);
	}

	removeCabinet(id: number) {
		this.cabinets.update((list) => list.filter((c) => c.id !== id));
	}

	addSegment(cabinetId: number) {
		this.cabinets.update((list) =>
			list.map((c) =>
				c.id === cabinetId
					? {
							...c,
							segments: [
								...c.segments,
								{ height: 400, facadeType: 'doors', facades: 1, applianceLabel: '' },
							],
						}
					: c,
			),
		);
	}

	removeSegment(cabinetId: number, segIndex: number) {
		this.cabinets.update((list) =>
			list.map((c) =>
				c.id === cabinetId
					? { ...c, segments: c.segments.filter((_, i) => i !== segIndex) }
					: c,
			),
		);
	}

	updateSegment(cabinetId: number, segIndex: number, field: keyof TallSegment, event: Event) {
		const target = event.target as HTMLInputElement | HTMLSelectElement;
		const isTextField = field === 'facadeType' || field === 'applianceLabel';
		const rawValue = isTextField ? target.value : Number(target.value);

		this.cabinets.update((list) =>
			list.map((c) =>
				c.id === cabinetId
					? {
							...c,
							segments: c.segments.map((seg, i) =>
								i === segIndex ? { ...seg, [field]: rawValue as never } : seg,
							),
						}
					: c,
			),
		);
	}

	updateCabinet(id: number, field: keyof Cabinet, event: Event) {
		const target = event.target as HTMLInputElement | HTMLSelectElement;
		const isTextField = field === 'type' || field === 'facadeType' || field === 'applianceLabel';
		const isCheckbox = field === 'hasSink' || field === 'hasCooktop' || field === 'cornerAfter';
		const rawValue = isCheckbox
			? (target as HTMLInputElement).checked
			: isTextField
				? target.value
				: Number(target.value);

		this.cabinets.update((list) =>
			list.map((c) => (c.id === id ? { ...c, [field]: rawValue as never } : c)),
		);
	}

	private computeCabinet(cabinet: Cabinet): CabinetBreakdown {
		if (cabinet.type === 'tall') return this.computeTallCabinet(cabinet);

		const {
			type,
			width,
			height,
			depth,
			facadeType,
			facades,
			shelves,
			applianceLabel,
			hasSink,
			hasCooktop,
		} = cabinet;
		const t = this.thickness();

		const innerWidth = Math.max(0, width - 2 * t);
		const parts: Part[] = [];

		// Боковини
		parts.push({ name: 'Боковина', size: `${depth} × ${height}`, qty: 2 });
		const sidesArea = (2 * depth * height) / 1e6;

		// Дно — під мийкою дно не ставлять (простір під сифон і зливний шланг)
		let bottomArea = 0;
		if (hasSink) {
			parts.push({
				name: 'Виріз під мийку (у стільниці)',
				size: `${Math.round(width * 0.7)} × 400 (орієнтовно)`,
				qty: 1,
			});
			parts.push({ name: 'Без дна — простір під сифон', size: '—', qty: 0 });
		} else {
			parts.push({ name: 'Дно', size: `${innerWidth} × ${depth}`, qty: 1 });
			bottomArea = (innerWidth * depth) / 1e6;
		}

		// Верх (царги для нижніх шаф, суцільна панель для верхніх)
		let topArea: number;
		if (type === 'base') {
			parts.push({ name: 'Царга (верх)', size: `${innerWidth} × ${RAIL_WIDTH}`, qty: 2 });
			topArea = (2 * innerWidth * RAIL_WIDTH) / 1e6;
		} else {
			parts.push({ name: 'Верх', size: `${innerWidth} × ${depth}`, qty: 1 });
			topArea = (innerWidth * depth) / 1e6;
		}

		// Полиці
		const shelfWidth = Math.max(0, innerWidth - 2 * SHELF_SIDE_GAP);
		const shelfDepth = Math.max(0, depth - SHELF_DEPTH_RECESS);
		let shelvesArea = 0;
		if (shelves > 0) {
			parts.push({ name: 'Полиця', size: `${shelfWidth} × ${shelfDepth}`, qty: shelves });
			shelvesArea = (shelfWidth * shelfDepth * shelves) / 1e6;
		}

		const ldspArea = sidesArea + bottomArea + topArea + shelvesArea;

		// Фасади / шухляди / ніші
		let facadeArea = 0;
		let facadeEdge = 0;

		if (facadeType === 'doors' && facades > 0) {
			const facadeHeight = Math.max(0, height - GAP);
			const facadeWidth = Math.max(0, (width - (facades + 1) * GAP) / facades);
			parts.push({
				name: 'Фасад (двері)',
				size: `${facadeWidth.toFixed(0)} × ${facadeHeight}`,
				qty: facades,
			});
			facadeArea = (facades * facadeWidth * facadeHeight) / 1e6;
			facadeEdge = facades * 2 * (facadeHeight + facadeWidth);
		} else if (facadeType === 'drawers' && facades > 0) {
			const frontHeight = Math.max(0, (height - (facades + 1) * GAP) / facades);
			const frontWidth = Math.max(0, width - 2 * GAP);
			parts.push({
				name: 'Фасад (шухляда)',
				size: `${frontWidth} × ${frontHeight.toFixed(0)}`,
				qty: facades,
			});
			facadeArea = (facades * frontWidth * frontHeight) / 1e6;
			facadeEdge = facades * 2 * (frontHeight + frontWidth);
		} else if (facadeType === 'niche') {
			parts.push({
				name: `Ніша під техніку${applianceLabel ? ' — ' + applianceLabel : ''}`,
				size: `${width} × ${height} (без фасаду)`,
				qty: 1,
			});
		} else if (facadeType === 'open') {
			parts.push({ name: 'Відкрита секція (без фасаду)', size: `${width} × ${height}`, qty: 1 });
		}

		// Задня стінка (ХДФ) — не для відкритих ніш під техніку
		let hdfArea = 0;
		if (facadeType !== 'niche') {
			const backWidth = Math.max(0, width - BACK_PANEL_REDUCTION);
			const backHeight = Math.max(0, height - BACK_PANEL_REDUCTION);
			parts.push({
				name: `Задня стінка (ХДФ ${this.backThickness()} мм)`,
				size: `${backWidth} × ${backHeight}`,
				qty: 1,
			});
			hdfArea = (backWidth * backHeight) / 1e6;
		}

		if (hasCooktop) {
			parts.push({
				name: 'Вирізи під конфорки (у стільниці)',
				size: `${Math.round(width * 0.85)} × 500 (орієнтовно)`,
				qty: 1,
			});
		}

		// Крайка: периметр фасадів/шухляд + передня кромка полиць
		const shelfEdge = shelves * shelfWidth;
		const edgeLength = (facadeEdge + shelfEdge) / 1000;

		return { cabinet, parts, ldspArea, facadeArea, hdfArea, edgeLength };
	}

	/** Пенал (напр. духовка+НВЧ+двері в одній вертикальній колоні): суцільний корпус з внутрішніми перегородками між сегментами */
	private computeTallCabinet(cabinet: Cabinet): CabinetBreakdown {
		const { width, depth, segments } = cabinet;
		const t = this.thickness();
		const totalHeight = segments.reduce((sum, s) => sum + s.height, 0);
		const innerWidth = Math.max(0, width - 2 * t);
		const parts: Part[] = [];

		parts.push({ name: 'Боковина (пенал, суцільна)', size: `${depth} × ${totalHeight}`, qty: 2 });
		const sidesArea = (2 * depth * totalHeight) / 1e6;

		parts.push({ name: 'Царга (низ)', size: `${innerWidth} × ${RAIL_WIDTH}`, qty: 2 });
		const bottomArea = (2 * innerWidth * RAIL_WIDTH) / 1e6;

		parts.push({ name: 'Верх', size: `${innerWidth} × ${depth}`, qty: 1 });
		const topArea = (innerWidth * depth) / 1e6;

		const dividerCount = Math.max(0, segments.length - 1);
		let dividersArea = 0;
		if (dividerCount > 0) {
			parts.push({ name: 'Перегородка між сегментами', size: `${innerWidth} × ${depth}`, qty: dividerCount });
			dividersArea = (innerWidth * depth * dividerCount) / 1e6;
		}

		let facadeArea = 0;
		let facadeEdge = 0;
		segments.forEach((seg, i) => {
			const n = i + 1;
			if (seg.facadeType === 'doors' && seg.facades > 0) {
				const fh = Math.max(0, seg.height - GAP);
				const fw = Math.max(0, (width - (seg.facades + 1) * GAP) / seg.facades);
				parts.push({
					name: `Фасад сегмент ${n} (двері)`,
					size: `${fw.toFixed(0)} × ${fh}`,
					qty: seg.facades,
				});
				facadeArea += (seg.facades * fw * fh) / 1e6;
				facadeEdge += seg.facades * 2 * (fh + fw);
			} else if (seg.facadeType === 'niche') {
				parts.push({
					name: `Сегмент ${n} — ніша${seg.applianceLabel ? ' — ' + seg.applianceLabel : ''}`,
					size: `${width} × ${seg.height} (без фасаду)`,
					qty: 1,
				});
			}
		});

		const backWidth = Math.max(0, width - BACK_PANEL_REDUCTION);
		const backHeight = Math.max(0, totalHeight - BACK_PANEL_REDUCTION);
		parts.push({
			name: `Задня стінка (ХДФ ${this.backThickness()} мм, суцільна)`,
			size: `${backWidth} × ${backHeight}`,
			qty: 1,
		});
		const hdfArea = (backWidth * backHeight) / 1e6;

		const ldspArea = sidesArea + bottomArea + topArea + dividersArea;
		const edgeLength = facadeEdge / 1000;

		return { cabinet, parts, ldspArea, facadeArea, hdfArea, edgeLength };
	}

	/** Прокрутити до картки шафи в списку деталізації та підсвітити її */
	scrollToCabinet(id: number) {
		this.highlightedId.set(id);
		const el = document.getElementById('cabinet-' + id);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		setTimeout(() => {
			if (this.highlightedId() === id) this.highlightedId.set(null);
		}, 2000);
	}

	private buildSchema() {
		const list = this.cabinets();
		const baseList = list.filter((c) => c.type === 'base');
		const wallList = list.filter((c) => c.type === 'wall');
		const tallList = list.filter((c) => c.type === 'tall');

		const wallMaxH = Math.max(1, ...wallList.map((c) => c.height));
		const baseMaxH = Math.max(1, ...baseList.map((c) => c.height));
		const tallMaxH = Math.max(
			0,
			...tallList.map((c) => c.segments.reduce((s, seg) => s + seg.height, 0)),
		);
		const floorY = Math.max(CORNICE_HEIGHT + wallMaxH + ROW_GAP + baseMaxH, tallMaxH);
		const cornerGap = 260; // розрив на схемі в місці повороту кухні за кут, мм

		let baseX = 0;
		let wallX = 0;
		const items: SchemaItem[] = [];

		list.forEach((cabinet, i) => {
			if (cabinet.type === 'tall') {
				const x = Math.max(baseX, wallX);
				const totalH = cabinet.segments.reduce((s, seg) => s + seg.height, 0);
				const y = floorY - totalH;
				items.push(this.buildTallSchemaItem(cabinet, i + 1, x, y));
				baseX = x + cabinet.width;
				wallX = x + cabinet.width;

				if (cabinet.cornerAfter) {
					baseX += cornerGap;
					wallX += cornerGap;
				}
				return;
			}

			const isWall = cabinet.type === 'wall';
			const x = isWall ? wallX : baseX;
			const y = isWall ? CORNICE_HEIGHT + (wallMaxH - cabinet.height) : floorY - cabinet.height;

			if (isWall) wallX += cabinet.width;
			else baseX += cabinet.width;

			items.push(this.buildSchemaItem(cabinet, i + 1, x, y));

			if (cabinet.cornerAfter) {
				if (isWall) wallX += cornerGap;
				else baseX += cornerGap;
			}
		});

		const totalWidthMm = Math.max(baseX, wallX, 1);
		const totalHeightMm = floorY;
		const captionSpacePx = 60; // місце під підписами внизу схеми

		return {
			items,
			width: totalWidthMm * SCALE,
			height: totalHeightMm * SCALE + captionSpacePx,
			floorY: totalHeightMm * SCALE,
			cornicesY: CORNICE_HEIGHT * SCALE,
		};
	}

	private buildSchemaItem(cabinet: Cabinet, index: number, xMm: number, yMm: number): SchemaItem {
		const x = xMm * SCALE;
		const y = yMm * SCALE;
		const w = cabinet.width * SCALE;
		const h = cabinet.height * SCALE;

		const visual = this.buildFacadeVisual(
			cabinet.facadeType,
			cabinet.facades,
			cabinet.shelves,
			cabinet.applianceLabel,
			x,
			y,
			w,
			h,
		);

		let sinkCutout: SchemaItem['sinkCutout'] = null;
		let cooktopDots: IconCircle[] = [];

		if (cabinet.hasSink) {
			const cw = w * 0.55;
			const ch = h * 0.18;
			sinkCutout = { x: x + (w - cw) / 2, y: y + h * 0.08, w: cw, h: ch };
		}

		if (cabinet.hasCooktop) {
			const r = Math.min(w, h) * 0.08;
			const positions = [0.25, 0.75];
			cooktopDots = positions.flatMap((px) =>
				positions.map(() => ({ cx: x + w * px, cy: y - r * 0.6, r })),
			);
		}

		return {
			...visual,
			index,
			type: cabinet.type,
			cabinet,
			x,
			y,
			w,
			h,
			sinkCutout,
			cooktopDots,
			cornerAfter: cabinet.cornerAfter,
			cornerX: x + w,
			segments: [],
		};
	}

	/** Пенал: одна суцільна колона з внутрішніми межами між сегментами (духовка/НВЧ/двері тощо) */
	private buildTallSchemaItem(cabinet: Cabinet, index: number, xMm: number, yMm: number): SchemaItem {
		const x = xMm * SCALE;
		const w = cabinet.width * SCALE;
		const totalHeightMm = cabinet.segments.reduce((s, seg) => s + seg.height, 0);
		const y = yMm * SCALE;
		const h = totalHeightMm * SCALE;

		const segments: SchemaSegment[] = [];
		const dividers: SchemaLine[] = [];
		let segY = y;
		for (const seg of cabinet.segments) {
			const segH = seg.height * SCALE;
			const visual = this.buildFacadeVisual(
				seg.facadeType,
				seg.facades,
				0,
				seg.applianceLabel,
				x,
				segY,
				w,
				segH,
			);
			segments.push({ ...visual, y: segY, h: segH });
			if (segY > y) {
				dividers.push({ x1: x, y1: segY, x2: x + w, y2: segY });
			}
			segY += segH;
		}

		return {
			index,
			type: cabinet.type,
			cabinet,
			x,
			y,
			w,
			h,
			dashed: false,
			dividers,
			handles: [],
			label: null,
			applianceIcon: null,
			sinkCutout: null,
			cooktopDots: [],
			cornerAfter: cabinet.cornerAfter,
			cornerX: x + w,
			segments,
		};
	}

	/** Спільна логіка малювання одного фасаду (двері/шухляди/ніша/відкрита секція) в межах прямокутника */
	private buildFacadeVisual(
		facadeType: FacadeType,
		facades: number,
		shelves: number,
		applianceLabel: string,
		x: number,
		y: number,
		w: number,
		h: number,
	): FacadeVisual {
		const dividers: SchemaLine[] = [];
		const handles: SchemaLine[] = [];
		let dashed = false;
		let label: string | null = null;
		let applianceIcon: ApplianceIcon | null = null;

		if (facadeType === 'doors' && facades > 1) {
			for (let n = 1; n < facades; n++) {
				const dx = x + (w * n) / facades;
				dividers.push({ x1: dx, y1: y, x2: dx, y2: y + h });
			}
		} else if (facadeType === 'drawers' && facades > 0) {
			for (let n = 1; n < facades; n++) {
				const dy = y + (h * n) / facades;
				dividers.push({ x1: x, y1: dy, x2: x + w, y2: dy });
			}
			for (let n = 0; n < facades; n++) {
				const midY = y + (h * (n + 0.5)) / facades;
				handles.push({ x1: x + w * 0.35, y1: midY, x2: x + w * 0.65, y2: midY });
			}
		} else if (facadeType === 'open') {
			dashed = true;
			const shelfCount = Math.min(shelves, 3) || 2;
			for (let n = 1; n <= shelfCount; n++) {
				const dy = y + (h * n) / (shelfCount + 1);
				dividers.push({ x1: x, y1: dy, x2: x + w, y2: dy });
			}
		} else if (facadeType === 'niche') {
			dashed = true;
			label = applianceLabel || 'Ніша';
			applianceIcon = this.buildApplianceIcon(applianceLabel, x, y, w, h);
		}

		return { dashed, dividers, handles, label, applianceIcon };
	}

	/** Схематична іконка вбудованої техніки (духовка/мікрохвильовка/витяжка) в межах ніші */
	private buildApplianceIcon(
		label: string,
		x: number,
		y: number,
		w: number,
		h: number,
	): ApplianceIcon | null {
		const l = label.toLowerCase();

		if (l.includes('духов')) {
			const doorX = x + w * 0.1;
			const doorY = y + h * 0.1;
			const doorW = w * 0.8;
			const doorH = h * 0.62;
			return {
				rects: [
					{ x: doorX, y: doorY, w: doorW, h: doorH, rx: 3 },
					{
						x: doorX + doorW * 0.12,
						y: doorY + doorH * 0.15,
						w: doorW * 0.76,
						h: doorH * 0.55,
						rx: 2,
					},
				],
				circles: [0.3, 0.5, 0.7].map((p) => ({
					cx: x + w * p,
					cy: y + h * 0.85,
					r: Math.min(w, h) * 0.025,
				})),
			};
		}

		if (l.includes('мікрохвильов') || l.includes('свч')) {
			const doorX = x + w * 0.08;
			const doorY = y + h * 0.18;
			const doorW = w * 0.7;
			const doorH = h * 0.55;
			return {
				rects: [
					{ x: doorX, y: doorY, w: doorW, h: doorH, rx: 3 },
					{
						x: doorX + doorW * 0.1,
						y: doorY + doorH * 0.12,
						w: doorW * 0.65,
						h: doorH * 0.76,
						rx: 2,
					},
				],
				circles: [0.4, 0.6].map((p) => ({
					cx: x + w * 0.85,
					cy: y + h * p,
					r: Math.min(w, h) * 0.02,
				})),
			};
		}

		if (l.includes('витяжк')) {
			return {
				rects: [
					{ x: x + w * 0.38, y: y, w: w * 0.24, h: h * 0.3, rx: 0 },
					{ x: x + w * 0.12, y: y + h * 0.3, w: w * 0.76, h: h * 0.28, rx: 2 },
				],
				circles: [],
			};
		}

		return null;
	}

	captionFor(cabinet: Cabinet): string {
		if (cabinet.type === 'tall') {
			const total = cabinet.segments.reduce((s, seg) => s + seg.height, 0);
			return `${cabinet.width}×${total} · пенал, ${cabinet.segments.length} сегм.`;
		}
		const dims = `${cabinet.width}×${cabinet.height}`;
		switch (cabinet.facadeType) {
			case 'doors':
				return `${dims} · ${cabinet.facades === 2 ? '2 двері' : '1 двері'}`;
			case 'drawers':
				return `${dims} · ${cabinet.facades} шухляди`;
			case 'niche':
				return `${dims} · ніша${cabinet.applianceLabel ? ' (' + cabinet.applianceLabel + ')' : ''}`;
			case 'open':
				return `${dims} · відкриті полиці`;
			default:
				return dims;
		}
	}
}

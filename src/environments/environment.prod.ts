export interface AppLanguage {
	code: string;
	name: string;
	nativeName: string;
	htmlLang: string;
}

export interface FirebaseConfig {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	messagingSenderId: string;
	appId: string;
}

export const environment = {
	production: true,
	firebase: {
		apiKey: 'AIzaSyCpwajPwyzDFJrhuwReQsKZ1hziTMnnu5A',
		authDomain: 'demchuk-denys.firebaseapp.com',
		projectId: 'demchuk-denys',
		storageBucket: 'demchuk-denys.firebasestorage.app',
		messagingSenderId: '783050969547',
		appId: '1:783050969547:web:6f375a3034e3251d85264e',
	} as FirebaseConfig,
	phoneHref: 'tel:+380680278101',
	phoneDisplay: '+38 (068) 027-81-01',
	facebookUrl: 'https://www.facebook.com/denys.demchuk.2025',
	instagramUrl: 'https://instagram.com/demchuk_denys',
	telegramUrl: 'https://t.me/Demchukdv',
	chatGptUrl:
		'https://chatgpt.com/g/g-6a756f44818081919121de5897833257-demchuk-denys-kukhni-ta-mebli',
	mapUrl: 'https://maps.app.goo.gl/d1p3ZbYg3zqaGmu18',
	addressDisplay: "вул. Івана Мазепи 51, Кам'янець-Подільський, Хмельницька область, 32306",
	defaultLanguage: 'ua',
	languages: [
		{ code: 'ua', name: 'Ukrainian', nativeName: 'Українська', htmlLang: 'uk' },
		{ code: 'en', name: 'English', nativeName: 'English', htmlLang: 'en' },
	] as AppLanguage[],
};

import { isValidPhoneNumber } from 'libphonenumber-js';

/** Validates a phone number as a real Ukrainian mobile/landline number. */
export function isValidUaPhone(value: string): boolean {
	const trimmed = value.trim();

	if (!trimmed) {
		return false;
	}

	try {
		return isValidPhoneNumber(trimmed, 'UA');
	} catch {
		return false;
	}
}

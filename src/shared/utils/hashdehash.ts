const { pbkdf2Sync, randomBytes } = require('crypto');

export const hash = (password: string): string => {
	const salt = randomBytes(128).toString('hex');
	const hash = pbkdf2Sync(password, salt, 500, 100, 'sha256').toString('hex');
	return `${hash}-${salt}`;
	};
	
	export const verify = (userpassword: string, savedPassword: string): boolean => {
		const [savedHash, salt] = savedPassword.split('-');
	const currentHash = pbkdf2Sync(userpassword, salt, 500, 100, 'sha256').toString('hex');
	return savedHash === currentHash;
};


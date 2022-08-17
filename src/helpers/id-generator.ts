export const idGenerator = (salt = 10): number => {
	return Math.floor(Math.random() * 100 * salt * Date.now());
};

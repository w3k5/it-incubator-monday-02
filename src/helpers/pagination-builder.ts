/**
 * По факту общий билдер для подготовки ответа, который даст инфу по тому на какой странице мы
 * сколько страниц в общем, и сколько мы должны пропустить
 * данный метод надо вынести в общий сервис для работы в разных доменах
 * Раз это воспомогательный сервис, то и находиться он должен в общем сервисе
 * А значит и билдить это мы должны уже не здесь, а в доменной логие
 * Так же этот сервис не должен работать ни с какими динамическими параметрами, только принимать данные
 * о страницах, и возвращать рассчитанный результат
 * @param options
 */
export const paginationBuilder = (options: { pageSize: number; pageNumber: number }) => {
	const skip = (options.pageNumber - 1) * options.pageSize;
	return {
		pageNumber: options.pageNumber,
		pageSize: options.pageSize,
		skip,
	};
};

export const countTotalPages = (totalPages: number, pageSize: number) => {
	return Math.ceil(totalPages / pageSize);
};

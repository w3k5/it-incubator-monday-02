const IOC_TYPES = {
	UserService: Symbol.for('UserService'),
	UserController: Symbol.for('UserController'),
	UserDatabaseRepository: Symbol.for('UserDatabaseRepository'),
	PasswordService: Symbol.for('PasswordService'),
	DateService: Symbol.for('DateService'),
};

export { IOC_TYPES };

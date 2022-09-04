const IOC_TYPES = {
	UserService: Symbol.for('UserService'),
	UserController: Symbol.for('UserController'),
	UserDatabaseRepository: Symbol.for('UserDatabaseRepository'),
	PasswordService: Symbol.for('PasswordService'),
	DateService: Symbol.for('DateService'),
	AuthController: Symbol.for('AuthController'),
	AuthService: Symbol.for('AuthService'),
	TokenService: Symbol.for('TokenService'),
};

export { IOC_TYPES };

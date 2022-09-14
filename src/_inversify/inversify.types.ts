const IOC_TYPES = {
	UserService: Symbol.for('UserService'),
	UserController: Symbol.for('UserController'),
	UserDatabaseRepository: Symbol.for('UserDatabaseRepository'),
	PasswordService: Symbol.for('PasswordService'),
	DateService: Symbol.for('DateService'),
	AuthController: Symbol.for('AuthController'),
	AuthService: Symbol.for('AuthService'),
	TokenService: Symbol.for('TokenService'),
	TestingService: Symbol.for('TestingService'),
	BlogDatabaseRepository: Symbol.for('BlogDatabaseRepository'),
	BlogService: Symbol.for('BlogService'),
	BlogController: Symbol.for('BlogController'),
	PostService: Symbol.for('PostService'),
	PostDatabaseRepository: Symbol.for('PostDatabaseRepository'),
	PostController: Symbol.for('PostController'),
	ErrorBoundaryService: Symbol.for('ErrorBoundaryService'),
};

export { IOC_TYPES };

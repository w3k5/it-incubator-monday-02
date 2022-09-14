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
	PostService: Symbol.for('PostService'),
	BlogService: Symbol.for('BlogService'),
	BlogController: Symbol.for('BlogController'),
	PostDatabaseRepository: Symbol.for('PostDatabaseRepository'),
	PostController: Symbol.for('PostController'),
	ErrorBoundaryService: Symbol.for('ErrorBoundaryService'),
};

export { IOC_TYPES };

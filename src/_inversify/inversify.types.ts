const IOC_TYPES = {
	UserService: Symbol.for('UserService'),
	UserController: Symbol.for('UserController'),
	UserDatabaseRepository: Symbol.for('UserDatabaseRepository'),
	PasswordService: Symbol.for('PasswordService'),
	DateService: Symbol.for('DateService'),
	AuthService: Symbol.for('AuthService'),
	TokenService: Symbol.for('TokenService'),
	TestingService: Symbol.for('TestingService'),
	BlogDatabaseRepository: Symbol.for('BlogDatabaseRepository'),
	PostService: Symbol.for('PostService'),
	BlogService: Symbol.for('BlogService'),
	BlogController: Symbol.for('BlogController'),
	PostController: Symbol.for('PostController'),
	ErrorBoundaryService: Symbol.for('ErrorBoundaryService'),
	PostDatabaseRepository: Symbol.for('PostDatabaseRepository'),
};

const GLOBAL_SERVICES_TYPES = {
	EmailService: Symbol.for('EmailService'),
};

const SERVICES_TYPES = {
	CommentsService: Symbol.for('CommentsService'),
	ActivationService: Symbol.for('ActivationService'),
};

const REPOSITORIES_TYPES = {
	PostQueryRepository: Symbol.for('PostQueryRepository'),
	CommentsQueryRepository: Symbol.for('CommentsQueryRepository'),
	CommentsCommandRepository: Symbol.for('CommentsCommandRepository'),
	ActivationQueryRepository: Symbol.for('ActivationQueryRepository'),
	ActivationCommandRepository: Symbol.for('ActivationCommandRepository'),
};

const MIDDLEWARES_TYPES = {
	AuthBearerMiddleware: Symbol.for('AuthBearerMiddleware'),
};

export { IOC_TYPES, MIDDLEWARES_TYPES, REPOSITORIES_TYPES, SERVICES_TYPES, GLOBAL_SERVICES_TYPES };

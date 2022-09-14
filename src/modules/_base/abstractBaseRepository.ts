export abstract class AbstractBaseRepository {
	abstract drop: () => Promise<void>;
}

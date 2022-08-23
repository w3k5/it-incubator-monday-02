declare global {
	namespace Express {
		export interface RequestHandler<T = { [key: string]: string | number }> {}
	}

	export interface ParamsDictionary {
		[key: string]: string | number;
	}
}

declare namespace QueryString {
	export interface ParsedQs {
		[key: string]: number;
	}
}

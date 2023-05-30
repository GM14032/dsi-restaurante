import { NextResponse } from 'next/server';
import decode from 'jwt-decode';

const routesAndPermissions = [

];
interface DecodedToken {
	lastName: string;
	name: string;
	permission: string[];
	username: string;
	exp: number;
  }
export async function middleware(request) {
	console.log('inside the middleware');
	const needAuth = routesAndPermissions.find((r) =>
		request.nextUrl.pathname.startsWith(r.route)
	);
	if (needAuth) {
		const authHeader = request.headers.get('Authorization');
		if (!authHeader) {
			console.log('no token found');
		/*	return NextResponse.redirect(
				new URL('/auth/login?no-token', request.url)
			);*/
		}
		const token = authHeader.replace('Bearer ', '');
		console.log("MIDDLEWARE")
		console.log(token)
		try {
			const decoded = decode(token) as DecodedToken;
			if (decoded.permission.includes(needAuth.permission)) {
				console.log('you have access to this url');
				return NextResponse.next();
			}
			console.log('you do not have access to this url');
			return NextResponse.redirect(
				new URL('/auth/login?access-denied', request.url)
			);
		} catch (err) {
			console.log('invalid token');
			return NextResponse.redirect(
				new URL('/auth/login?invalid-token', request.url)
			);
		}
	}
	/*if (request.nextUrl.pathname.startsWith('/test-url-not-auth')) {
		console.log('here is an example when you do not have access to this url');
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}
	return NextResponse.next();*/
}

export const config = {
	matcher: [
		'/((?!api|auth|_next/static|_next/image|favicon.ico).*)',
	],
};
import Cookies from 'js-cookie';

export const useHttp = () => {

    const tokenFromCookies = Cookies.get('auth_token');

    const requestWithToken = async (url: string, method = 'GET', body: any = null, token = tokenFromCookies) => {
        try {
            const headers: { [key: string]: string } = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { method, body, headers });

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            return data;
        } catch (e) {
            throw e;
        }
    };

    return { request: requestWithToken };
};
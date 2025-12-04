import { UserDTO } from './contracts/user';

const API_BASE_URL = window.config?.apiUrl || 'http://localhost:5261';

export const getUser = async (userId: string): Promise<UserDTO> => {
    var response: Response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
    });
    if (response.ok) {
        const data = await response.json();
        return data.user as UserDTO;
    }
    throw new Error('Failed to fetch user details');
}
import { UserDTO } from './contracts/user';
import { apiRequest, buildApiUrl } from './apiClient';

export const getUser = async (userId: string): Promise<UserDTO> => {
    const url = buildApiUrl(`/api/users/${userId}`);
    const response = await apiRequest<{ user: UserDTO }>(
        url,
        { headers: { "Content-Type": "application/json" } },
        'Failed to fetch user details'
    );
    return response.user;
}
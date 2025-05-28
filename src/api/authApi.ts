import axios from "axios";

const authApi = {
    login: (username: string, password: string) => {
        return axios.post(
            'http://localhost:8081/api/v1/auth/login',
            { username, password },
            { withCredentials: true }
        );
    }
};

export default authApi;
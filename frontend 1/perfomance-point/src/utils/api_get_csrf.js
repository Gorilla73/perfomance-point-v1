import axios from "axios";
import client from "./api_request";

function getCsrf() {
    return client.get('api/v1/get_csrf_token/', { withCredentials: true })
        .then(response => {
            const csrfToken = response.headers['x-csrftoken'];
            return csrfToken;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

export default getCsrf;
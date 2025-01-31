import { requests } from "../../config/api.config";
import { HttpStatusCode } from 'axios';
import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const saveDesignation = async (designation) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_DESIGINATION_ROLE, data: {
            designation
        }
    })
}

export const viewDesignationRole = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_DESIGNATION_ROLES,
        });
        console.log("designation", response);


        if (response?.status === 200 && !response?.isError) {
            return { isSuccess: true, result: response }; // Return success response


        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }

    } catch (error) {
        console.error("Error in Designation role:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

};

export const savecharges = async (designation) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_DESIGINATION_ROLE, data: {
            designation
        }
    })
}
import { HttpStatusCode } from 'axios';
import { requests } from "../../config/api.config";
import { API_ENDPOINT } from "../../constant/apiEndpoints";
import { getFromLS } from '../../utils/storage.utils';
import { STORAGE_KEYS } from '../../config/app.config';

export const viewDashboardDetails = async () => {
    try {
        const token = getFromLS(STORAGE_KEYS.TOKEN);
        const response = await requests.get({
            url: API_ENDPOINT.GET_DASHBOARD_DETAILS,
            headers: { "Content-Type": "application/json", "accesstoken": token }
        });

        if (response?.status === HttpStatusCode.Ok && !response?.isError) {
            return { isSuccess: true, result: response }; // Return success response
        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response?.statusText };
        }
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
};

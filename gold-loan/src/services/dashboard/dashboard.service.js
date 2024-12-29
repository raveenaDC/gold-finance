import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const viewDashboardDetails = async (Token) => {
    try {
        const endpoint = API_BASE_URL + API_ENDPOINT.GET_DASHBOARD_DETAILS;
        const response = await fetch(endpoint, {
            method: "get",
            headers: { "Content-Type": "application/json", "accesstoken": Token }, // Specify JSON payload
        });

        const responseData = await response.json();

        if (response.ok) {
            return { isSuccess: true, result: responseData }; // Return success response
        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: response.statusText };
        }
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
};

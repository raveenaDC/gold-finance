import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const getCustomerDetails = async (customerId) => {
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINT.GET_CUSTOMER_DETAILS.replace("[customerId]", customerId));
        const data = await response.json();
        if (!data?.isError && data.status === 200) {
            return { isSuccess: true, userDetails: data.data };
        }

        return { isSuccess: false, userDetails: null }
    } catch (e) {
        console.error('Error fetching customer details:', e);
        return { isSuccess: false, userDetails: null }
    }
};

export const updateCustomerRating = async (customerId, rating) => {
    try {
        const endpoint = API_BASE_URL + API_ENDPOINT.UPDATE_CUSTOMER_RATINGS.replace("[customerId]", customerId);
        const data = { rating }; // Payload containing the updated rating

        const response = await fetch(endpoint, {
            method: "PATCH", // Use PATCH to partially update the resource
            headers: { "Content-Type": "application/json" }, // Specify JSON payload
            body: JSON.stringify(data), // Send the updated rating in the request body
        });

        const responseData = await response.json();

        if (response.ok) {
            return { isSuccess: true, result: responseData }; // Return success response
        } else {
            console.error("API response error:", response.statusText);
            return { isSuccess: false, result: null };
        }
    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }
};

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
}
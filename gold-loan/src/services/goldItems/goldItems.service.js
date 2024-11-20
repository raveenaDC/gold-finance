import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const getgolditemdetails = async () => {
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINT.GET_GOLD_ITEM_DETAILS);
        const data = await response.json();
        console.log(data);
        if (!data?.isError && data.status === 200) {
            return { isSuccess: true, items: data.data.items };
        }
        return { isSuccess: false, items: null }
    }

    catch (e) {
        console.error('Error fetching customer details:', e);
        return { isSuccess: false, items: null }
    }
}
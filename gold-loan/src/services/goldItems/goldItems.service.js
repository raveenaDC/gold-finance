import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"
import { requests } from "../../config/api.config";

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

export const getcustomergoldloandetails = async (customerId) => {
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINT.GET_CUSTOMER_GOLD_LOAN_DETAILS.replace("[customerId]", customerId));
        const data = await response.json();
        console.log("get customer woe", data.data.loanDetails);
        return { items: data.data.loanDetails };
    }
    catch (e) {
        console.error('Error fetching gold loan details:', e);

    }
}

export const getgolddetailtable = async (loanId) => {
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINT.GET_GOLD_DETAIL_TABLE.replace("[loanId]", loanId));
        const data = await response.json();
        console.log("***********");
        console.log("get customer nothing", data.data);
        console.log("***********");
        return { items: data.data };
    }
    catch (e) {
        console.error('Error fetching gold table details:', e);

    }

}

export const getgoldbillhistorytable = async (goldLoanId) => {
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINT.GET_GOLD_BILL_HISTORY.replace("[goldLoanId]", goldLoanId));
        const data = await response.json();
        console.log("***********");
        console.log("history", data.data);
        console.log("***********");
        return { items: data };
    }
    catch (e) {
        console.error('Error fetching gold table details:', e);

    }

}

export const saveGoldItems = async () => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_GOLD_ITEMS, data: {

        }
    })
}


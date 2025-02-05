import { requests } from "../../config/api.config";
import { HttpStatusCode } from 'axios';
import { API_BASE_URL, API_ENDPOINT } from "../../constant/apiEndpoints"

export const savebankdetails = async (bankName,
    interestRate,
    otherCharges,
    duration,
    remark) => {
    return await requests.post({
        url: API_ENDPOINT.SAVE_BANK_DETAILS, data: {
            bankName,
            interestRate,
            otherCharges,
            duration,
            remark
        }
    })
}
export const getBankName = async () => {
    try {
        const response = await requests.get({
            url: API_ENDPOINT.GET_BANK_DETAIL,
        });
        console.log("BANKDETAILS", response);


        return { isSuccess: true, result: response }; // Return success response


        // } else {
        //     console.error("API response error:", response.statusText);
        //     return { isSuccess: false, result: response?.statusText };
        // }

    } catch (error) {
        console.error("Error in updateCustomerRating:", error);
        return { isSuccess: false, result: null }; // Ensure consistent structure for error cases
    }

};
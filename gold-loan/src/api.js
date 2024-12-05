const API_URL = 'http://localhost:4000/'; // Replace with your actual API endpoint

export const submitData = async (data) => {
    try {
        const response = await fetch(API_URL + data.path, {
            method: data.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.info),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json(); // Assuming the API returns JSON data
    } catch (error) {
        console.error('Error submitting data:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

export const submitDocument = async (data) => {
    try {
        const response = await fetch(API_URL + data.path, {
            method: data.method,
            body: data.info,
        });

        if (!response.ok) {
            // Parse error response if available
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to submit data");
        }

        return await response.json(); // Assuming the API returns JSON data
    } catch (error) {
        console.error('Error submitting data:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

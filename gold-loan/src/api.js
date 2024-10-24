// src/api.js

const API_URL = 'http://localhost:4000/'; // Replace with your actual API endpoint

export const submitData = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
            throw new Error('Network response was not ok');
        }

        return await response.json(); // Assuming the API returns JSON data
    } catch (error) {
        console.error('Error submitting data:', error);
        throw error; // Rethrow the error for handling in the component
    }
};

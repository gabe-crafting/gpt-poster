export default defineEventHandler(async (event) => {
    try {
        // Make the request to the external API from the server
        const response = await fetch('https://randomromania.com/pass.json');

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch password');
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the password field
        return {password: data.password};
    } catch (error) {
        // Handle errors and return a 500 status with an error message
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch password',
        });
    }
});
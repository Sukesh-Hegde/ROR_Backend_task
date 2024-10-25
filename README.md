## API Endpoints
Initialize Database
Endpoint: /api/products/initialize
Method: GET
Description: Fetches product transaction data from a third-party API and seeds it into the MongoDB database. 

## Testing with Postman
Initialize Database: Use GET http://localhost:3000/api/products/initialize to populate the database with sample data.
List Transactions: Use GET http://localhost:3000/api/products/transactions with optional query parameters page, perPage, search, and month.
Get Statistics: Use GET http://localhost:3000/api/products/statistics?month=<month> to get monthly statistics.
Get Pie Chart Data: Use GET http://localhost:3000/api/products/piechart?month=<month> to get category data.
To test these endpoints:

Start the server with node server.js.
Use Postman to send requests to the API endpoints.
--------SETUP--------
Make sure you have node installed then, run in cmd:
"npm install
npm start"

-------COMMANDS------
start = start project in node
lint = run eslint
dev = start project in nodemon
test = test using mocha and chai

----------API---------
User API

Register a New User
Endpoint: POST /users/register

Request Body:
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string" // Optional, defaults to 'user'
}
Response:
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "role": "string"
}


Authenticate a User and Return a Token
Endpoint: POST /users/login

Request Body:
{
  "email": "string",
  "password": "string"
}
Response:
{
  "token": "string"
}

Get the Profile of the Logged-in User
Endpoint: GET /users/profile

Headers:
{
  "Authorization": "Bearer <token>"
}
Response:
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "role": "string"
}


Item API
**************NOTE*************
'ownerId' WASN'T MENTIONED IN THE PDF BUT WAS NECCESARY AP PER THE API

Retrieve All Auction Items (with Pagination)
Endpoint: GET /items

Query Parameters:

page (optional, integer, default: 1)
limit (optional, integer, default: 10)
search (optional, string, for search functionality)
status (optional, string, e.g., "active", "ended")
Response:
{
  "items": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "currentPrice": "float",
      "status": "string",
      "imageUrl": "string"
      "ownerId": "integer"
    }
  ],
  "totalItems": "integer",
  "totalPages": "integer",
  "currentPage": "integer"
}

Retrieve a Single Auction Item by ID
Endpoint: GET /items/:id

Response:
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "currentPrice": "float",
  "status": "string",
  "imageUrl": "string"
  "ownerId": "integer"
}


Create a New Auction Item
Endpoint: POST /items

Headers:
{
  "Authorization": "Bearer <token>"
}
Request Body (Form Data):
name (string)
description (string)
startingPrice (float)
status (string, e.g., "active")
image (file, optional)
Response:
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "currentPrice": "float",
  "status": "string",
  "imageUrl": "string",
  "ownerId": "integer"
}

Update an Auction Item by ID
Endpoint: PUT /items/:id

Headers:
{
  "Authorization": "<token>"
}
Request Body:
{
  "name": "string",
  "description": "string",
  "currentPrice": "float",
  "status": "string"
}
Response:
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "currentPrice": "float",
  "status": "string",
  "imageUrl": "string"
  "ownerId": "integer"
}
Delete an Auction Item by ID
Endpoint: DELETE /items/:id

Headers:
{
  "Authorization": "<token>"
}
Response:
{
  "message": "Item deleted successfully"
}

Bid API

Retrieve All Bids for a Specific Item
Endpoint: GET /items/:itemId/bids

Response:
{
  "bids": [
    {
      "id": "integer",
      "itemId": "integer",
      "userId": "integer",
      "bidAmount": "float",
      "createdAt": "string"
    }
  ]
}

Place a New Bid on a Specific Item
Endpoint: POST /items/:itemId/bids

Headers:
{
  "Authorization": "<token>"
}
Request Body:
{
  "bidAmount": "float"
}
Response:
{
  "id": "integer",
  "itemId": "integer",
  "userId": "integer",
  "bidAmount": "float",
  "createdAt": "string"
}

Notification API

Retrieve Notifications for the Logged-in User
Endpoint: GET /notifications

Headers:
{
  "Authorization": "<token>"
}
Response:
{
  "notifications": [
    {
      "id": "integer",
      "userId": "integer",
      "message": "string",
      "read": "boolean",
      "createdAt": "string"
    }
  ]
}

Mark Notifications as Read
Endpoint: POST /notifications/mark-read

Headers:
{
  "Authorization": "<token>"
}
Response:
{
  "message": "Notifications marked as read"
}

WebSocket Events

Bidding

connection: Establish a new WebSocket connection.
bid: Place a new bid on an item.
Bid Event Data:
{
  "itemId": "integer",
  "userId": "integer",
  "bidAmount": "float"
}

update: Notify all connected clients about a new bid on an item.
Update Event Data:
{
  "id": "integer",
  "itemId": "integer",
  "userId": "integer",
  "bidAmount": "float",
  "createdAt": "string"
}

disconnect: dummy disconnect. Only console logs 'user disconnected'
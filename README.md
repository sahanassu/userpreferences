User Preferences Management
Description

This project consists of a backend API and a frontend application for managing user preferences. The backend is built with Node.js, Express, and MongoDB, while the frontend is developed using React.
Backend API

The API provides endpoints to create, read, update, and delete user preferences, with validation to prevent duplicate entries.
Endpoints

    Create User Preference
        URL: /userPrefs/create
        Method: POST

    Get All User Preferences
        URL: /userPrefs/getAll
        Method: GET

    Get User Preference by ID
        URL: /userPrefs/get/:id
        Method: GET

    Update User Preferences by ID
        URL: /userPrefs/update/:id/preferences
        Method: PATCH

    Delete User Preference by Key
        URL: /userPrefs/delete/:userId/preferences/:key
        Method: DELETE

    Add Multiple Key-Value Pairs
        URL: /userPrefs/add/:id/preferences
        Method: POST

Frontend Application

The React frontend allows users to interact with the backend API to view, create, and update user preferences. 

Features

    Display user preferences
    Create new user preferences
    Update existing user preferences
   "# user_preference" 
"# user_preference" 
"# user_preference" 
"# user_keyvalue" 

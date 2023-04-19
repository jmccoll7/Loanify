## LoanDataApp

This is a simple loan data app that allows users to add loan data and calculate the total loan amount.

### How to run the app

1. Clone the repo
2. Run `npm install` to install all the dependencies
3. Open the `.env` file and add the following environment variables:
    - `PORT` - the port you want to run the app on
    - `MONGODB_URI` - the URI of your MongoDB database
    - `NODE_ENV` - the environment you want to run the app in (development or production)
    - `TOKEN_SECRET_KEY` - the secret key used to sign the JWT token
4. Run `npm start` to start the app
5. Open `http://localhost:3000` in your browser (or use the port specified in your env file) 
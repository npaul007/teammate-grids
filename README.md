# Setting Up and Running the App

This guide will help you configure and run the app. Before proceeding, make sure you have NodeJS and Expo installed on your machine.

## Installation

1. **Install NodeJS**: If you haven't already, [install Node.js](https://nodejs.org/) on your system.

2. **Expo Installation**: Open your terminal and navigate to the root directory of the project. Run the following command to install Expo:

   ```bash
   expo install
   ```

3. **Backend Installation**: Navigate to the `backend/` subdirectory of the project in your terminal and run the following command to install the required backend dependencies:

   ```bash
   cd backend/
   npm install
   ```

## Configuration

### Root Directory

1. Create a `.env` file in the root directory of the project and set the following variables:

   ```env
   # The IP will be the IP address of your machine on your network
   EXPO_PUBLIC_API_HOST=http://10.0.0.207:4000/
   ```

### Backend Directory

1. Inside the `backend/` directory, create another `.env` file with the following variables:

   ```env
   # Database credentials will be that of your local MySQL database server
   NODE_ENV=dev
   DATABASE_NAME=
   DATABASE_HOST=
   DATABASE_PORT=
   DATABASE_USER=
   DATABASE_PASSWORD=
   DATABASE_SSL=false
   PORT=4000
   SECRET_KEY=ilovehockey
   NHL_API_HOST=https://statsapi.web.nhl.com/api/v1/
   ```

## Running the App

To run the app on your mobile device, follow these steps:

1. **Install Expo Go App**: Install the [Expo Go](https://expo.dev/client) app on your mobile device.

2. **Network Setup**: Ensure your mobile device is connected to the same WiFi network as your development machine.

3. **Terminal Setup**: Open two terminals:

   - In the first terminal, navigate to the `backend/` directory and run the following command to start the backend server:

     ```bash
     cd backend/
     node index
     ```

   - In the second terminal, go to the root directory of the project and run the following command to start the Expo development server:

     ```bash
     npx expo start
     ```

4. **Scan QR Code**: In the Expo Go app on your mobile device, scan the QR code that appears in the second terminal.

5. **Run the App**: The app should now run on your mobile device.

Enjoy using the app! If you encounter any issues or have questions, please refer to the documentation or message me!

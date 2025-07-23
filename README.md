# RentRedi User Management System

User management system with OpenWeatherMap integration and Firebase.

## How to Run (Step-by-step Instructions)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled
- OpenWeatherMap API key

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd rentredi

# Install all dependencies
npm run install:all

# Start both backend and frontend
npm start
```

### Individual Setup
```bash
# Backend Setup
cd api
npm install
# create .env file
npm start

# Frontend Setup (in a new terminal)
cd client
npm install
npm start
```

### Environment Configuration

Create a `.env` file in the `api/` folder:

```env
PORT=8080
NODE_ENV=development
OPENWEATHER_API_KEY=your_openweather_api_key_here 
```

You'll also need to add your Firebase service account credentials to `api/firebase-service-account.json`.


I implemented a full-stack user management system with the following architecture:

- **Backend**: RESTful API built with Node.js and Express, using Firebase Firestore as the database
- **Frontend**: React application with Material-UI for a modern, responsive interface
- **Integration**: OpenWeatherMap API integration to fetch weather data for user locations
- **Error Handling**: Comprehensive error handling and validation throughout the application
- **Service Layer**: Clean separation of concerns with dedicated service classes

The solution follows REST principles and implements proper separation between frontend and backend concerns.

## Implementations

### Backend Features
- ✅ Complete CRUD operations for users
- ✅ Firebase Firestore integration
- ✅ OpenWeatherMap API integration
- ✅ Input validation and error handling
- ✅ RESTful API endpoints
- ✅ Health check endpoint

### Frontend Features
- ✅ User creation form with validation
- ✅ User editing functionality
- ✅ User detail view with weather information

### API Endpoints
- `GET /` - API information
- `GET /health` - Health status
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/weather` - Get weather for user location

## Assumptions

1. **Firebase Setup**: Assumed Firebase project is already configured with Firestore enabled
2. **API Keys**: Assumed OpenWeatherMap API key is available and valid
3. **User Data**: Assumed only US zip codes
4. **Browser Support**: Assumed modern browser support for ES6+ features
6. **Port Availability**: Assumed ports 3000 (frontend) and 8080 (backend) are available

## Testing

### Unit Testing
- ✅ **Backend Tests**: Comprehensive unit tests for controllers, services, and middleware
- ✅ **Frontend Tests**: Component testing with React Testing Library
- ✅ **API Service Tests**: Mocked API calls and error handling

### Manual Testing
- ✅ **User CRUD Operations**: Tested all create, read, update, delete operations
- ✅ **Form Validation**: Tested input validation on both frontend and backend
- ✅ **Weather Integration**: Tested weather API calls with various city inputs
- ✅ **Error Handling**: Tested error scenarios (invalid IDs, network failures, etc.)
- ✅ **Responsive Design**: Tested UI on different screen sizes
- ✅ **Navigation**: Tested all routes and navigation flows

### API Testing
- ✅ **Endpoint Testing**: Tested all REST endpoints using Postman/curl
- ✅ **Data Validation**: Verified data integrity and format
- ✅ **Error Responses**: Tested proper error status codes and messages

### Running Tests
```bash
# Run all tests
npm test

# Run backend tests only
npm run test:api

# Run frontend tests only
npm run test:client

# Run tests with coverage
npm run test:coverage
```


## Technologies

- **Backend**: Node.js, Express, Firebase Admin
- **Frontend**: React, Material-UI, Axios
- **APIs**: OpenWeatherMap
- **Database**: Firebase Firestore

## Project Structure

```
rentredi/
├── api/                 # Backend API
│   ├── src/
│   │   ├── controllers/ # Controllers
│   │   ├── middleware/  # Middlewares
│   │   ├── routes/      # Routes
│   │   ├── services/    # Services
│   │   └── utils/       # Utilities
│   └── config.js        # Configuration
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Components
│   │   ├── services/    # API services
│   │   └── constants/   # Constants
│   └── config.js        # Configuration
└── README.md
```

## License

MIT

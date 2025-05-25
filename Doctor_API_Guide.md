# Prescripto Doctor API Testing Guide

## Overview of Doctor APIs
The Prescripto system has the following doctor APIs:

1. **Authentication**
   - `POST /doctor/login` - Doctor login

2. **Appointment Management**
   - `GET /doctor/appointments` - Get doctor's appointments
   - `POST /doctor/cancel-appointment` - Cancel an appointment
   - `POST /doctor/complete-appointment` - Mark appointment as completed

3. **Profile Management**
   - `GET /doctor/profile` - Get doctor's profile
   - `POST /doctor/update-profile` - Update doctor's profile
   - `POST /doctor/change-availability` - Change availability status

4. **Dashboard**
   - `GET /doctor/dashboard` - Get doctor's dashboard data

5. **Public Access**
   - `GET /doctor/list` - Get list of all doctors (public endpoint)

## Setting Up Postman for Testing

1. **Create a new collection** named "Prescripto Doctor APIs"
2. **Set up environment variables**:
   - `baseUrl`: `http://localhost:5000` (adjust if your server runs on a different port)
   - `doctorToken`: To store the doctor authentication token

## Testing Guide

### 1. Doctor Login

**Endpoint**: `POST {{baseUrl}}/doctor/login`

**Request Body**:
```json
{
  "email": "<DOCTOR_EMAIL>",
  "password": "<DOCTOR_PASSWORD>"
}
```

**Response**:
```json
{
  "success": true,
  "token": "<JWT TOKEN>"
}
```

**Important**: After successful login, save the token to your Postman environment variable:
1. In the Tests tab of your request, add this script:
```javascript
if (pm.response.json().success) {
    pm.environment.set("doctorToken", pm.response.json().token);
}
```

### 2. Get Doctor's Dashboard

**Endpoint**: `GET {{baseUrl}}/doctor/dashboard`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Response**:
```json
{
  "success": true,
  "dashData": {
    "earnings": 150,
    "appointments": 10,
    "patients": 8,
    "latestAppointments": [...]
  }
}
```

### 3. Get Doctor's Profile

**Endpoint**: `GET {{baseUrl}}/doctor/profile`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Response**:
```json
{
  "success": true,
  "profileData": {
    "_id": "<DOCTOR_ID>",
    "name": "Dr. John Smith",
    "email": "john.smith@example.com",
    "image": "https://res.cloudinary.com/...",
    "speciality": "Cardiologist",
    "degree": "MBBS, MD",
    "experience": "10 years",
    "about": "...",
    "available": true,
    "fees": 50,
    "slots_booked": {...},
    "address": {...},
    "date": 1620000000000
  }
}
```

### 4. Get Doctor's Appointments

**Endpoint**: `GET {{baseUrl}}/doctor/appointments`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Response**:
```json
{
  "success": true,
  "appointments": [...]
}
```

### 5. Update Doctor's Profile

**Endpoint**: `POST {{baseUrl}}/doctor/update-profile`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Request Body**:
```json
{
  "fees": 60,
  "address": {
    "street": "456 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "pincode": "10001"
  },
  "available": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile Updated"
}
```

### 6. Change Doctor's Availability

**Endpoint**: `POST {{baseUrl}}/doctor/change-availability`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Response**:
```json
{
  "success": true,
  "message": "Availability Changed"
}
```

### 7. Cancel an Appointment

**Endpoint**: `POST {{baseUrl}}/doctor/cancel-appointment`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Request Body**:
```json
{
  "appointmentId": "<APPOINTMENT_ID>"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment Cancelled"
}
```

### 8. Complete an Appointment

**Endpoint**: `POST {{baseUrl}}/doctor/complete-appointment`

**Headers**:
```
dtoken: {{doctorToken}}
```

**Request Body**:
```json
{
  "appointmentId": "<APPOINTMENT_ID>"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment Completed"
}
```

### 9. Get List of All Doctors (Public)

**Endpoint**: `GET {{baseUrl}}/doctor/list`

**Response**:
```json
{
  "success": true,
  "doctors": [...]
}
```

## Testing Tips and Common Issues

1. **Authentication Issues**:
   - Make sure the `dtoken` header is properly set for all authenticated endpoints
   - If you get "Not Authorized Login Again" message, your token might be invalid or expired - try logging in again

2. **Missing Appointment ID**:
   - For operations that require an Appointment ID, make sure to use a valid ID
   - You can get valid appointment IDs from the `/doctor/appointments` endpoint

3. **Getting Doctor Credentials**:
   - You'll need valid doctor credentials to test most of these APIs
   - You can either use an existing doctor's credentials or create a new doctor through the Admin API

4. **Testing Workflow**:
   1. Start by logging in and getting the doctor token
   2. View the dashboard and profile to verify authentication works
   3. Test profile update operations
   4. Test appointment operations (view, cancel, complete)

## Automating API Testing

You can create a script to help test the doctor APIs. Here's an example script that fetches doctor credentials and appointment IDs:

```javascript
// test-doctor-apis.js
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  // Get doctor credentials
  const doctorModel = mongoose.model('doctor', new mongoose.Schema({}));
  doctorModel.find({}, '_id name email').then(doctors => {
    console.log("Available doctors for testing:");
    console.log(JSON.stringify(doctors, null, 2));
    
    if (doctors.length > 0) {
      const testDoctorId = doctors[0]._id;
      
      // Get appointments for this doctor
      const appointmentModel = mongoose.model('appointment', new mongoose.Schema({}));
      appointmentModel.find({ docId: testDoctorId }, '_id userId docId date time isCompleted cancelled payment').then(appointments => {
        console.log(`Appointments for doctor ${doctors[0].name} (${testDoctorId}):`);
        console.log(JSON.stringify(appointments, null, 2));
        mongoose.connection.close();
      });
    } else {
      console.log("No doctors found in the database.");
      mongoose.connection.close();
    }
  });
}).catch(err => {
  console.error('Error connecting to database:', err);
  process.exit(1);
});
```

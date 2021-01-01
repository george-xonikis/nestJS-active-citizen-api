# Active Citizen - NestJS Rest API
RestAPI for the Active Citizen, an app which promotes people to be more engaged in their local communities

## The app has the following Endpoints

### 1. Auth
- POST: Sign-up (send email activation code)
  ```/auth/signup/```
- PATCH: User Activation (activate a new user using the activation code which was sent via email)
  ```/auth/signup/activate/ ```
- POST: Sign-in (get JWT)
  ```/auth/signin/  ```

### 2. User
- GET: Get User’s profile 
  ```/api/user/profile```


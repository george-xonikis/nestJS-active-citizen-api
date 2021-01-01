# Active Citizen - NestJS Rest API
RestAPI for the Active Citizen, an app which promotes people to be more engaged in their local communities

## The app has the following Endpoints

### 1. Auth
- POST: register-up (send email activation code)
  ```/auth/signup/```
- PATCH: User Activation (activate a new user using the activation code which was sent via email)
  ```/auth/signup/activate/ ```
- POST: Login (get JWT)
  ```/auth/login/  ```

### 2. User
- GET: Get User’s profile 
  ```/user/profile```
- PATCH: Change User’s password
  ```/user/change-paswword```

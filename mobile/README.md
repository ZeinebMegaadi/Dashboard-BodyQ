# BodyQ Mobile

React Native (Expo) app for the AI-powered Fitness & Health Assistant. TypeScript, React Navigation.

## Theme

Modern & bold: black background, violet `#7D39EB`, lime `#C6FF33`, white. See `src/theme/`.

## Auth flow

1. **Start Your Journey** → primary: Sign Up, secondary: Login  
2. **Sign Up** (name, email, password) → on success → **Account Setup** (onboarding)  
3. **Login** (email, password) → on success → **Main app** if profile complete, else **Account Setup**  
4. **Account Setup** (multi-step): name, about (gender, age), body (height, weight), fitness (goal, level, location). On complete → send to backend, mark profile complete → **Main app**

## Run

```bash
cd mobile
npm install
npx expo start
```

Then press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go.

## Structure

- `src/theme` — colors, typography  
- `src/components` — Button, Input, Screen  
- `src/context` — AuthContext (token, user, profileComplete; AsyncStorage)  
- `src/screens` — Start, SignUp, Login, AccountSetup, Main  
- `src/navigation` — AuthStack, OnboardingStack, AppStack, RootNavigator (picks stack by auth + profileComplete)

## Backend

Auth is mocked (in-memory token + AsyncStorage). Replace `login`/`register` in `AuthContext` with `POST /api/v1/auth/login` and `POST /api/v1/auth/register`; use backend `user.profileComplete` on login and after onboarding call `PATCH /api/v1/users/me` then set profile complete.

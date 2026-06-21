# PrimeCrest Inventory 📦

A cross-platform mobile inventory management system built with **Expo** and **React Native**. PrimeCrest provides both a customer-facing product shop and a full-featured admin dashboard for managing products, users, categories, and sales.

---

## ✨ Features

### Customer (Regular User)
- **Shop** — Browse products with search and category filtering, infinite scroll pagination
- **Cart** — Add, remove, and update item quantities, with total calculation
- **Profile** — View and manage account information

### Admin
- **Dashboard** — High-level business overview: total stock value, product stats, user counts, and 30-day sales summary
- **Product Management** — Add, edit, and delete products; track low-stock and out-of-stock items
- **User Management** — Add and delete users; view all registered users
- **Sales** — View sales records and revenue analytics
- **Category Management** — Create and manage product categories

---

## 🛠️ Tech Stack

| Category | Library |
|---|---|
| Framework | [Expo](https://expo.dev) v56 + [React Native](https://reactnative.dev) 0.85 |
| Routing | [Expo Router](https://expo.github.io/router) v56 (file-based) |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org) + [redux-persist](https://github.com/rt2zz/redux-persist) |
| Server State | [TanStack React Query](https://tanstack.com/query) v5 |
| HTTP Client | [Axios](https://axios-http.com) with JWT auth interceptors |
| Forms | [React Hook Form](https://react-hook-form.com) |
| UI | [@expo/vector-icons](https://icons.expo.fyi), [@gorhom/bottom-sheet](https://gorhom.github.io/react-native-bottom-sheet) |
| Theming | System-aware light/dark mode via `useColorScheme` |
| Language | TypeScript |

---

## 📁 Project Structure

```
primeCrestMobile/
├── src/
│   ├── app/                        # Expo Router file-based routes
│   │   ├── _layout.tsx             # Root layout (providers, fonts, splash)
│   │   ├── index.tsx               # Entry redirect
│   │   ├── login.tsx               # Login screen
│   │   └── (private)/              # Auth-guarded routes (tab navigator)
│   │       ├── _layout.tsx         # Tab layout + auth redirect guard
│   │       ├── shop.tsx            # Product browsing screen
│   │       ├── cart.tsx            # Shopping cart screen
│   │       ├── profile.tsx         # User profile screen
│   │       └── (admin)/            # Admin-only routes (stack navigator)
│   │           ├── _layout.tsx
│   │           ├── index.tsx       # Admin dashboard
│   │           ├── products.tsx    # Product management
│   │           ├── users.tsx       # User management
│   │           └── sales.tsx       # Sales analytics
│   ├── components/
│   │   ├── AdminModuleCard.tsx     # Dashboard module cards
│   │   ├── AdminProductCard.tsx    # Product row card (admin view)
│   │   ├── AdminSalesCard.tsx      # Sales record card
│   │   ├── AdminUserCard.tsx       # User row card
│   │   ├── CategoryDropdown.tsx    # Category filter dropdown
│   │   ├── Select.tsx              # Generic select/picker component
│   │   ├── SingleProductCard.tsx   # Product card (shop view)
│   │   ├── ThemedText.tsx          # Theme-aware text component
│   │   └── modals/
│   │       ├── AddProduct.tsx      # Add product bottom sheet
│   │       ├── EditProduct.tsx     # Edit product bottom sheet
│   │       ├── DeleteProduct.tsx   # Delete product confirmation
│   │       ├── AddUser.tsx         # Add user bottom sheet
│   │       ├── DeleteUser.tsx      # Delete user confirmation
│   │       └── AddNewCategory.tsx  # Add category bottom sheet
│   ├── lib/
│   │   ├── api.ts                  # Axios instance with JWT + auto-refresh interceptors
│   │   ├── constants.ts            # Theme color palettes (light/dark)
│   │   ├── context/                # React context providers
│   │   └── hooks/
│   │       └── useTheme.ts         # Theme hook
│   ├── store/
│   │   ├── configureStore.tsx      # Redux store setup with redux-persist
│   │   ├── rootReducer.tsx         # Combined reducers
│   │   ├── storeTypes.ts           # Store type definitions
│   │   └── slice/
│   │       ├── authSlice.ts        # Auth state (user, tokens, isAdmin flag)
│   │       ├── cartSlice.ts        # Cart state (items, totals)
│   │       └── actions.ts          # Initial state definitions
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # Helper functions (formatMoney, useThemeColors, etc.)
├── assets/                         # Fonts, images, icons
├── app.json                        # Expo app configuration
├── eas.json                        # EAS Build profiles
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/) for native builds

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd primeCrestMobile

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_BASE_URL
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_BASE_URL=https://your-api-base-url.com/api/
```

### Running the App

```bash
# Start the development server
npm start            # or: npx expo start -c

# Run on Android emulator / device
npm run android

# Run on iOS simulator / device
npm run ios

# Run in browser (limited functionality)
npm run web
```

---

## 🔐 Authentication

Authentication uses **JWT access + refresh tokens**:

- Tokens are stored in Redux state and persisted via `redux-persist` (AsyncStorage).
- Every request automatically attaches the `Bearer` access token via an Axios request interceptor.
- On a `401` response, the app automatically attempts a **single-flight token refresh** and retries the original request.
- If refresh fails, the user is logged out and redirected to the login screen.
- Route-level auth guarding is handled in `src/app/(private)/_layout.tsx`.

---

## 🎨 Theming

The app supports **automatic light/dark mode** based on the device system setting.

Color palettes are defined in `src/lib/constants.ts`:

| Token | Light | Dark |
|---|---|---|
| `background` | `#ffffff` | `#013b61` |
| `backgroundElement` | `#F0F0F3` | `#212225` |
| `text` | `#012849` | `#ffffff` |
| `accent` | `#013b61` | `#fd7b01` |

Use the `useThemeColors()` helper from `src/utils/helpers` to access the current theme colors in any component.

---

## 📦 Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (APK for internal testing)
eas build --profile preview2 --platform android

# Build for production
eas build --profile production --platform all
```

Available build profiles (defined in `eas.json`):

| Profile | Platform | Type |
|---|---|---|
| `development` | all | Internal distribution with dev client |
| `preview` | all | Internal distribution |
| `preview2` | Android | APK |
| `production` | all | App Store / Play Store |

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in browser |
| `npm run lint` | Run Expo linter |

---

## 📄 License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.

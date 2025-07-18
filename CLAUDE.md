# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native app built with Expo and TypeScript for scanning food product barcodes and retrieving nutritional information. The app uses expo-router for file-based navigation and expo-camera for barcode scanning functionality.

## Development Commands

**Start development server:**
```bash
npm start
# or
expo start
```

**Platform-specific builds:**
```bash
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
npm run web        # Run in web browser
```

**Code quality:**
```bash
npm run lint       # Run ESLint
```

**Project reset:**
```bash
npm run reset-project  # Move starter code to app-example/ and create blank app/
```

## Architecture

**Navigation Structure:**
- Uses expo-router with file-based routing
- Root layout: `app/_layout.tsx` - handles theming and font loading
- Tab navigation: `app/(tabs)/_layout.tsx` - three main tabs (Home, Product Query, Settings)
- Scanner screen: `app/scanner.tsx` - standalone barcode scanner (not in tabs)

**Key Components:**
- **Scanner**: Full-screen camera view with barcode detection, filters for food-related barcode types (EAN13, EAN8, UPC-A, UPC-E)
- **Theme System**: Uses `@react-navigation/native` themes with custom color scheme detection
- **Icon System**: Custom `IconSymbol` component with platform-specific implementations

**Barcode Scanning:**
- Only processes food-related barcode formats: EAN13, EAN8, UPC-A, UPC-E
- Uses expo-camera with real-time scanning capabilities
- Implements manual confirmation workflow for scanned barcodes

**File Organization:**
- `app/` - screens and layouts (expo-router structure)
- `components/` - reusable UI components and themed components
- `hooks/` - custom React hooks for color scheme and theme management  
- `constants/` - app-wide constants like Colors
- `assets/` - images, fonts, and other static assets

## Development Notes

**Dependencies:**
- Built on Expo SDK ~53.0.16
- React 19.0.0 and React Native 0.79.5
- Key Expo modules: expo-camera, expo-router, expo-font
- Uses TypeScript with strict configuration

**Camera Permissions:**
The scanner requires camera permissions - the app handles permission requests gracefully with user-friendly messaging.

**Platform Considerations:**
- Tab bar styling differs between iOS (transparent with blur) and Android
- Icon system has platform-specific implementations (IconSymbol.ios.tsx vs IconSymbol.tsx)
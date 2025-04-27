# Organic Tweets - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [UI/UX Design System](#uiux-design-system)
4. [Feature Documentation](#feature-documentation)
5. [Component Structure](#component-structure)
6. [Implementation Details](#implementation-details)
7. [Setup Instructions](#setup-instructions)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Organic Tweets** is a web application that provides a calming, aesthetically pleasing environment for composing and saving tweets. The interface is inspired by organic, natural design elements with soft shapes, rounded corners, and a soothing color palette.

### Core Functionality
- Compose tweets with text (up to 280 characters)
- Add media attachments (images and videos)
- Save tweets locally
- View and manage saved tweets
- Display tweet details

### Target User
Users who want a distraction-free, visually pleasing environment to draft and save tweets.

---

## Technical Architecture

### Tech Stack
- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useRef)

### File Structure
```
organic-tweets/
├── public/
├── src/
│   ├── App.tsx               # Main application component
│   ├── TweetComposer.tsx     # Main tweet composer component
│   ├── index.css             # Global styles
│   └── main.tsx              # Application entry point
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

### Data Flow
The application uses React's state management to:
1. Store tweet text and media input from the user
2. Manage saved tweets in local state
3. Handle UI states (saving, detail view)

---

## UI/UX Design System

### Color Palette
- **Primary Colors**:
  - Peach: `#F4B183` (buttons, accents)
  - Navy/Slate: `#2D3F4C` (text, icons)
  - Cream: `#F6F1E9` (backgrounds)
  - Mint: `#D1E0DB` (subtle accents)

### Typography
- **Heading**: Sans-serif, light weight
- **Body Text**: Sans-serif, regular weight
- **Size Scale**: Following Tailwind's default scale

### UI Elements
- **Buttons**: Rounded with soft transitions
- **Cards**: Rounded corners with subtle shadows
- **Input Fields**: Inset shadows for depth
- **Toggles**: Pill-shaped with smooth animation

### Design Principles
1. **Organic Shapes**: Rounded corners, soft edges, natural forms
2. **Neumorphic Elements**: Subtle shadows and highlights for depth
3. **Spacious Layout**: Generous whitespace for calm experience
4. **Natural Motifs**: Leaf, cloud, and landscape elements as decorations

---

## Feature Documentation

### Tweet Composer
- **Character Limit**: 280 characters with visual feedback
- **Media Support**: Up to 4 media files (images or videos)
- **Save Function**: Stores tweet in local state

### Media Management
- **Supported Types**: Images (.jpg, .png, .gif, etc.) and videos
- **Preview**: Thumbnails display before saving
- **Removal**: Individual files can be removed before saving

### Saved Tweets
- **Storage**: Maintained in React state (non-persistent)
- **Display**: List view with truncated content
- **Actions**: View details, delete

### Detail View
- **Full Content**: Shows complete tweet text
- **Media Gallery**: Displays all attached media files
- **Delete Option**: Remove tweets from saved collection

---

## Component Structure

### Main Components
1. **TweetComposer**: The parent component managing overall state
2. **TweetCard**: Individual saved tweet display
3. **TweetDetailView**: Expanded view of a single tweet

### Utility Components
1. **LeafSVG**: Decorative leaf element
2. **CloudSVG**: Decorative cloud element

### State Structure
```typescript
// Main state objects
const [tweetText, setTweetText] = useState('');
const [savedTweets, setSavedTweets] = useState([]);
const [mediaFiles, setMediaFiles] = useState([]);
const [isDetailView, setIsDetailView] = useState(false);
const [selectedTweet, setSelectedTweet] = useState(null);
```

### Media File Structure
```typescript
{
  id: number,       // Unique identifier
  type: string,     // 'image' or 'video'
  url: string,      // Local blob URL
  name: string      // Original filename
}
```

### Tweet Structure
```typescript
{
  id: number,       // Unique identifier
  text: string,     // Tweet content
  date: string,     // Timestamp
  media: Array      // Array of media objects
}
```

---

## Implementation Details

### Media Handling
Files are handled using the `URL.createObjectURL()` API to generate temporary URLs for previewing uploaded media. This approach avoids uploading files to a server during the draft stage.

```javascript
const handleFileSelect = (e, type) => {
  if (!canAddMoreMedia) return;
  
  const file = e.target.files[0];
  if (!file) return;
  
  // Create a preview URL
  const fileUrl = URL.createObjectURL(file);
  
  setMediaFiles([...mediaFiles, {
    id: Date.now(),
    type: type, // 'image' or 'video'
    url: fileUrl,
    name: file.name
  }]);
  
  // Reset the input
  e.target.value = null;
};
```

### Tweet Saving Logic
```javascript
const handleSaveTweet = () => {
  if ((tweetText.trim() === '' && mediaFiles.length === 0) || isLimitReached) return;
  
  setIsSaving(true);
  
  // Simulate saving delay
  setTimeout(() => {
    const newTweet = {
      id: Date.now(),
      text: tweetText,
      date: new Date().toLocaleString(),
      media: [...mediaFiles]
    };
    
    setSavedTweets([newTweet, ...savedTweets]);
    setTweetText('');
    setMediaFiles([]);
    setIsSaving(false);
  }, 800);
};
```

### UI Adaptations
The layout adapts to different screen sizes using Tailwind's responsive classes:
```html
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
```

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation Steps

1. **Create a new React+TypeScript project with Vite**:
   ```bash
   npm create vite@latest tweet-app -- --template react-ts
   cd tweet-app
   ```

2. **Install dependencies**:
   ```bash
   npm install lucide-react
   npm install -D tailwindcss@3 postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Configure Tailwind CSS**:
   Update `tailwind.config.js`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           peach: {
             100: '#FDF2E9',
             200: '#FBEADB',
             300: '#F4B183',
             400: '#E59C6B',
             600: '#D2691E',
           },
           mint: {
             100: '#E6F0ED',
             200: '#D1E0DB',
             600: '#3D7A68',
           },
         },
       },
     },
     plugins: [],
   }
   ```

4. **Set up CSS**:
   Update `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   html, body, #root {
     width: 100%;
     height: 100%;
     margin: 0;
     padding: 0;
     overflow-x: hidden;
   }

   *, *::before, *::after {
     box-sizing: border-box;
   }
   ```

5. **Update App.tsx**:
   ```tsx
   import TweetComposer from './TweetComposer'

   function App() {
     return (
       <div className="w-screen min-h-screen">
         <TweetComposer />
       </div>
     )
   }

   export default App
   ```

6. **Create TweetComposer.tsx** component with the provided code.

7. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## Best Practices

### Code Organization
- **Component Separation**: Keep components focused on single responsibilities
- **Prop Types**: Use TypeScript interfaces for props
- **State Management**: Keep related state together and lift state as needed

### UI/UX Principles
- **Feedback**: Provide visual feedback for all user actions
- **Accessibility**: Maintain good contrast and focus states
- **Consistency**: Use consistent spacing, colors, and interaction patterns

### Performance Considerations
- **Memoization**: Use React.memo for components that don't need frequent re-renders
- **Image Optimization**: Consider resizing images client-side before saving
- **Batch Updates**: Group state updates when possible

---

## Troubleshooting

### Common Issues

#### Layout Problems
- **Issue**: Application only showing on part of the screen
- **Solution**: Check global CSS, ensure full-width containers, and correct box-sizing

#### Tailwind Not Working
- **Issue**: Tailwind classes not applying styles
- **Solution**: 
  - Verify Tailwind is properly installed and configured
  - Check content paths in tailwind.config.js
  - Confirm PostCSS is properly set up

#### Media Issues
- **Issue**: Images or videos not displaying
- **Solution**:
  - Check browser console for errors
  - Verify the file types are supported
  - Ensure URL.createObjectURL is working properly

#### Text Overflow
- **Issue**: Long text breaking layout
- **Solution**: Use text-overflow, overflow properties, and appropriate wrapping

---

## Future Enhancements

### Potential Features
1. **Persistence**: Add local storage or backend API for tweet persistence
2. **User Accounts**: Multi-user support with profiles
3. **Scheduling**: Option to schedule tweets for future posting
4. **Draft Management**: Save multiple drafts for later editing
5. **Theme Options**: Light/dark mode toggle
6. **Rich Text Editing**: Support for basic formatting
7. **Hashtag/Mention Support**: Auto-detection and highlighting
8. **Analytics**: Track engagement metrics for saved tweets
9. **Export Options**: Export tweets to different formats
10. **Social Sharing**: Direct posting to social media platforms

### Technical Improvements
1. **State Management**: Consider Context API or Redux for complex state
2. **Caching**: Implement caching strategies for media files
3. **Testing**: Add unit and integration tests
4. **Accessibility**: Enhance keyboard navigation and screen reader support
5. **Performance Optimization**: Lazy loading for media and virtualized lists

---

**Document Version**: 1.0  
**Last Updated**: April 27, 2025  
**Author**: Ritu Raj Singh
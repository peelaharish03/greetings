# Birthday Wishes App

A beautiful, reusable Angular 17 standalone single-page application for creating personalized birthday wishes with configuration-driven personalization.

## Features

- 🎨 **Dynamic Theming**: All colors, fonts, and styling controlled by configuration
- 🎭 **Rich Animations**: Typing effects, floating balloons, fireworks, confetti
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🎵 **Background Music**: Auto-play birthday music with toggle control
- 🖼️ **Image Gallery**: Auto-sliding carousel of birthday person photos
- 🔄 **Reusable**: Easy to customize for different people
- 📤 **Shareable**: Built-in share functionality

## Project Structure

```
src/app/
├── components/
│   └── birthday-page.component.ts
├── config/
│   └── birthday.config.ts
├── services/
│   └── config.service.ts
├── app.ts
├── app.config.ts
├── app.routes.ts
└── main.ts
```

## Configuration

Edit `src/app/config/birthday.config.ts` to personalize the birthday wishes:

```typescript
export const BIRTHDAY_CONFIG = {
  personName: "Harish",
  mainMessage: "Happy Birthday Harish 🎉",
  subMessage: "Wishing you happiness and success!",
  themeColor: "#ff4081",
  backgroundGradient: ["#ff9a9e", "#fad0c4"],
  fontFamily: "'Poppins', sans-serif",
  personImages: [
    "assets/images/img1.jpg",
    "assets/images/img2.jpg",
    "assets/images/img3.jpg"
  ],
  backgroundMusic: "assets/music/happy-birthday.mp3"
};
```

## Setup Instructions

### Prerequisites
- Node.js 16+ 
- Angular CLI 17+

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Assets**
   Create folders and add your files:
   ```
   src/assets/
   ├── images/
   │   ├── img1.jpg
   │   ├── img2.jpg
   │   └── img3.jpg
   └── music/
       └── happy-birthday.mp3
   ```

3. **Run Development Server**
   ```bash
   ng serve
   ```

4. **Open Browser**
   Navigate to `http://localhost:4200`

## Customization Guide

### Changing the Birthday Person
1. Edit `src/app/config/birthday.config.ts`
2. Update `personName`, `mainMessage`, and `subMessage`
3. Replace images in `src/assets/images/`
4. Update `personImages` array with new file names

### Changing Colors
- `themeColor`: Primary accent color for buttons and highlights
- `backgroundGradient`: Two-color array for background gradient

### Changing Fonts
- Update `fontFamily` with any Google Font or system font
- Make sure to add Google Font link in `src/index.html` if needed

### Adding More Images
1. Add images to `src/assets/images/`
2. Update `personImages` array with new file paths
3. The carousel will automatically include all images

## Deployment

### Firebase Hosting
1. **Build the app**
   ```bash
   ng build
   ```

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Netlify
1. **Build the app**
   ```bash
   ng build
   ```

2. **Deploy dist folder to Netlify**
   - Drag and drop `dist/greetings` folder to Netlify
   - Or connect Git repository for automatic deployments

### Vercel
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## Browser Compatibility
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance Tips
- Optimize images before adding to assets
- Use compressed audio files for background music
- Consider lazy loading for large image sets

## Troubleshooting

### Audio Not Playing
- Modern browsers block autoplay
- User interaction required to start music
- Use the "Toggle Music" button

### Images Not Loading
- Check file paths in configuration
- Ensure images exist in `src/assets/images/`
- Verify file extensions match

### Animations Not Smooth
- Check device performance
- Reduce number of fireworks if needed
- Optimize image sizes

## License
MIT License - feel free to use for personal or commercial projects.

## Support
For issues and questions, please check the configuration and ensure all assets are properly loaded.

# Cribhub - Modern E-Commerce Platform

A full-featured e-commerce platform built with React, TypeScript, Vite, and Tailwind CSS. Allows users to browse products publicly and manage their buying/selling activities after authentication.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)

## 🌟 Features

### Public Features
- **Public Product Browsing** - View products without login
- **Advanced Search** - Search with category filters
- **Product Categories** - Electronics, Mobile, Fashion, Home & Lifestyle, Plant & Animals, and more
- **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- **Modern UI** - Clean interface with smooth animations

### User Features
- **Dual Mode** - Switch between Buying and Selling
- **User Dashboard** - Personalized statistics and quick actions
- **Order Management** - Track orders, view history, submit complaints
- **Product Listings** - Create and manage product listings
- **Wishlist & Cart** - Save favorites and manage cart
- **Profile Management** - Update personal and payment information

### Admin Features
- **Admin Dashboard** - System-wide statistics and insights
- **User Management** - View, edit, and manage users
- **Product Management** - Approve, disable, or remove products
- **Order Management** - View and manage all orders
- **Analytics** - Track platform performance

## 🎨 Design Features

- **Three-Tier Header**
  - Orange top bar with contact info
  - Main header with search and cart
  - Blue navigation bar with categories

- **Color Scheme**
  - Primary: Orange (#FF5722)
  - Secondary: Blue (#0EA5E9)
  - Accent: Green (#10B981)
  - Background: White & Gray

- **Modern Components**
  - Product cards with ratings and badges
  - Gradient buttons with hover effects
  - Smooth page transitions
  - Toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dfront-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Backend API is configured to: `https://dback-atwi.onrender.com`
   - Update in `src/services/api.ts` if needed

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
dfront-new/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── auth/       # Authentication components
│   │   ├── layout/     # Layout components (Header, etc.)
│   │   └── ui/         # UI components (Button, ProductCard, etc.)
│   ├── contexts/       # React contexts (AuthContext)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin pages
│   │   ├── auth/       # Auth pages (Login, Signup, etc.)
│   │   └── user/       # User pages (Dashboard, Browse, etc.)
│   ├── services/       # API services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── tailwind.config.js  # Tailwind configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 5.4.2** - Build tool
- **Tailwind CSS 3.4.1** - Styling
- **Framer Motion** - Animations
- **React Router DOM 7.8.2** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **PostCSS** - CSS processing

## 🔐 Authentication

The app uses JWT-based authentication:
- Login/Register through dedicated pages
- Token stored in localStorage
- Protected routes require authentication
- Admin routes require admin role

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🎯 Key Features Implementation

### Public Browsing
Visitors can browse products without creating an account. They'll be prompted to login only when:
- Adding items to cart
- Making purchases
- Accessing user dashboard
- Creating listings

### Enhanced Error Handling
- **60-second API timeout** for slow backend responses
- **Specific error messages** for different failure types
- **Info toasts** for backend cold-start warnings
- **Error boundary** to catch React crashes

### Product Management
- Create listings with images and videos
- Set conditions (New, Like New, Used)
- Specify location and delivery fees
- Track sales and manage inventory

## 🐛 Bug Fixes & Improvements

### Recent Fixes
✅ Public browsing enabled
✅ Full-width mobile login
✅ 60-second API timeout
✅ Error boundary added
✅ Alert() replaced with toast
✅ Product type fields in mappers
✅ Conflicting useAuth hook removed
✅ Forgot password feature
✅ Enhanced Header with 3-tier layout
✅ Modern ProductCard component

## 📊 Performance

- **Bundle Size**: ~528 KB (163 KB gzipped)
- **Build Time**: ~2 seconds
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🔧 Configuration

### API Configuration
Edit `src/services/api.ts`:
```typescript
export const API_BASE = 'https://dback-atwi.onrender.com';
const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 60000, // 60 seconds for slow backend
});
```

### Color Configuration
Edit `tailwind.config.js`:
```javascript
colors: {
  orange: {
    DEFAULT: '#ff5722',
    light: '#ff7043',
    dark: '#e64a19',
  },
  // ... other colors
}
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing library
- Tailwind CSS for the utility-first CSS framework
- Vite for the blazing fast build tool
- All contributors and users

## 📞 Support

For support, email contact@gmail.com or call 125-874-9658

## 🔮 Future Enhancements

- [ ] Real-time chat between buyers and sellers
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product recommendations
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode

---

**Built with ❤️ using React + TypeScript + Vite + Tailwind CSS**

# 🎨 UI Components Reference Guide

## Quick Access Guide to Enhanced Components

---

## 📄 Landing Page (`src/pages/LandingPage.tsx`)

### Sections:
1. **Navigation Bar** - Fixed top with logo and login links
2. **Hero Section** - Main headline with benefits and CTAs
3. **Features Section** - 6 feature cards with icons
4. **Portal Selection** - Student and Teacher portal cards
5. **CTA Section** - Call-to-action with gradient background
6. **Footer** - Company info and links

### Key Classes:
- `.bg-gradient-to-br from-blue-50 to-purple-50` - Gradient backgrounds
- `.group-hover:opacity-100` - Hover effects
- `.transform hover:-translate-y-1` - Lift effect on hover

---

## 🔐 Login Pages

### Files:
- `src/components/auth/LoginForm.tsx` - Main form container
- `src/components/auth/LoginFormFields.tsx` - Form inputs
- `src/components/auth/FormField.tsx` - Individual form field

### Features:
- **Background Animations**: Gradient circles with pulse animation
- **Form Validation**: Only enable submit when fields are filled
- **Loading State**: Spinner and text change during submission
- **Portal Switching**: Easy switch between Student/Teacher login
- **Demo Credentials**: Display box with test credentials

### Form Field Features:
```tsx
// Enhanced form field with:
- Icon indicators (User, Key icons)
- Gradient background hover effect
- Blue focus border (2px)
- Focus shadow animation
- Better placeholder text
```

---

## 📊 Student Dashboard (`src/pages/student/StudentDashboard.tsx`)

### Components:
1. **Header Section** - Welcome message with gradient background
2. **Statistics Cards** - 3 cards showing attendance, quizzes, score
3. **Quick Access Cards** - 4 action cards (Statistics, Chat, Quiz, History)
4. **Motivational Section** - Encouraging message with gradient

### Color Coding:
- Attendance Rate: Green to Emerald gradient
- Quizzes Completed: Blue to Cyan gradient
- Average Score: Purple to Pink gradient

### Animations:
- Stat cards scale up on hover: `hover:scale-105`
- Card shadow transitions: `hover:shadow-2xl`
- Smooth color transitions: `transition-all duration-300`

---

## 👨‍🏫 Teacher Dashboard (`src/pages/teacher/TeacherDashboard.tsx`)

### Components:
1. **Header Section** - Welcome message with gradient background
2. **Statistics Cards** - Total Students, Quizzes, Attendance Rate
3. **Management Tools** - 6 action cards for teacher operations
4. **Quick Tips** - Face Recognition and Quiz Best Practices boxes

### Management Tools:
- Mark Attendance (Camera icon)
- Add New Student (UserPlus icon)
- View Students (Users icon)
- Download Report (Download icon)
- Chat with Students (MessageCircle icon)
- Create Quiz (FileText icon)

### Tip Boxes:
- Face Recognition Tips (Blue gradient)
- Quiz Best Practices (Purple gradient)
- Checkmark list items

---

## 🎯 Dashboard Card (`src/components/dashboard/DashboardCard.tsx`)

### Features:
```tsx
// Enhanced card with:
- Gradient icon background (Blue to Purple)
- Arrow icon appears on hover
- Bottom accent line grows on hover
- Shadow transitions
- Lift effect (-translate-y-1)
```

### States:
- **Normal**: White background, gray border
- **Hover**: Blue border, shadow enhanced, card lifts
- **Active**: Icon arrow visible, accent line shows

### Color Scheme:
```
Icon Background: from-blue-500 to-purple-500
Hover Border: border-blue-200
Accent Line: from-blue-500 to-purple-500
```

---

## 🧭 Dashboard Layout (`src/components/layouts/DashboardLayout.tsx`)

### Navigation Components:
1. **Top Bar**
   - Logo with gradient background
   - Breadcrumb indicator
   - Notification bell (hidden on mobile)
   - User profile dropdown
   - Mobile menu toggle

2. **User Profile Dropdown**
   - Profile option
   - Settings option
   - Logout option with confirmation

3. **Footer**
   - 4-column layout
   - Company info
   - Quick links
   - Contact information

### Mobile Features:
- Responsive menu toggle
- Hidden breadcrumb on small screens
- Hidden notifications on small screens
- Touch-friendly button sizes

---

## 🎨 Animation Classes

### Fade In
```css
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
```

### Slide Up
```css
.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
```

### Pulse Glow
```css
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### Bounce Slow
```css
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
```

### Gradient Shift
```css
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

---

## 🌈 Color Palettes

### Primary Gradient
- From: `#0284c7` (Blue-600)
- To: `#9333ea` (Purple-600)
- Usage: Main buttons, icons, accents

### Gradient Backgrounds
- Blue Gradient: `from-blue-600 to-purple-600`
- Teacher Portal: `from-purple-600 to-pink-600`
- Student Portal: `from-blue-600 to-cyan-600`
- Success: `from-green-500 to-emerald-600`
- Warning: `from-yellow-400 to-red-500`

---

## 🔘 Button Styles

### Primary Button
```tsx
className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
           text-white rounded-lg hover:shadow-lg 
           transform hover:scale-105 active:scale-95 
           transition-all duration-300"
```

### Secondary Button
```tsx
className="px-8 py-3 border-2 border-blue-600 text-blue-600 
           rounded-lg hover:bg-blue-50 
           transition-all transform hover:scale-105 active:scale-95"
```

### Disabled Button
```tsx
className="disabled:from-gray-400 disabled:to-gray-400 
           disabled:cursor-not-allowed opacity-50"
```

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Hidden breadcrumb
- Hidden notifications
- Menu toggle visible
- Single column layouts
- Smaller fonts and padding

### Tablet (641-1024px)
- 2-3 column grids
- Full navigation visible
- Larger spacing
- Optimized padding

### Desktop (> 1024px)
- Full navigation
- All features visible
- 3+ column grids
- Maximum width container

---

## 🎯 Interactive Elements

### Hover Effects:
- Scale: `hover:scale-105`
- Translate: `hover:-translate-y-1`
- Shadow: `hover:shadow-xl`
- Color: `hover:text-blue-600`

### Focus Effects:
- Ring: `focus:ring-2 focus:ring-blue-500`
- Shadow: `focus:shadow-md`
- Border: `focus:border-blue-600`

### Active Effects:
- Scale down: `active:scale-95`
- Opacity: `active:opacity-75`

---

## 📐 Spacing Guide

### Padding
- Small: `p-2` (0.5rem)
- Medium: `p-4` (1rem)
- Large: `p-6` (1.5rem)
- Extra Large: `p-8` (2rem)

### Margins
- Small: `m-2` (0.5rem)
- Medium: `m-4` (1rem)
- Large: `m-6` (1.5rem)
- Extra Large: `m-8` (2rem)

### Gap (Grid/Flex)
- Small: `gap-2` (0.5rem)
- Medium: `gap-4` (1rem)
- Large: `gap-6` (1.5rem)
- Extra Large: `gap-8` (2rem)

---

## 🔍 Common Pattern - Card with Hover

```tsx
<div className="bg-white rounded-xl shadow-md 
                hover:shadow-2xl transition-all 
                p-6 border border-gray-100 
                hover:border-blue-200 
                h-full transform hover:-translate-y-1">
  {/* Card content */}
</div>
```

---

## 🔍 Common Pattern - Gradient Header

```tsx
<div className="bg-gradient-to-r from-blue-600 to-purple-600 
                text-white p-8 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-64 h-64 
                  bg-white opacity-5 rounded-full 
                  transform translate-x-1/2 -translate-y-1/2"></div>
  <div className="relative z-10">
    {/* Header content */}
  </div>
</div>
```

---

## 🔍 Common Pattern - Icon Button

```tsx
<button className="flex items-center space-x-2 
                   px-4 py-2 rounded-lg 
                   hover:bg-blue-50 
                   transition-colors text-sm font-medium">
  <IconComponent className="w-5 h-5" />
  <span>Label</span>
</button>
```

---

## 📚 Component Usage Examples

### Using DashboardCard
```tsx
<DashboardCard
  icon={BarChart3}
  title="View Statistics"
  description="Check your attendance records"
  to="/student/statistics"
/>
```

### Using LoginForm
```tsx
<LoginForm 
  onSubmit={handleLogin} 
  error={error} 
  role="student" 
/>
```

### Using DashboardLayout
```tsx
<DashboardLayout>
  <div className="p-8">
    {/* Dashboard content */}
  </div>
</DashboardLayout>
```

---

## ✨ Best Practices

1. **Always use gradients** for visual appeal
2. **Add hover effects** for interactivity
3. **Use transitions** for smooth animations (300-500ms)
4. **Maintain spacing** with consistent gaps
5. **Color code** different sections
6. **Use icons** for visual indicators
7. **Mobile first** approach for responsive design
8. **Test focus states** for accessibility

---

## 🚀 Performance Tips

1. Use `transform` and `opacity` for animations (GPU accelerated)
2. Avoid heavy filters in hover states
3. Use CSS transitions instead of JS animations
4. Lazy load images and heavy components
5. Use `will-change` sparingly for performance
6. Test on real devices for smooth animations
7. Use `prefers-reduced-motion` for accessibility

---

**Last Updated**: January 18, 2026
**UI Version**: 1.0.0

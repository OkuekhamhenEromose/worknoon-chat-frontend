# worknoon-chat-frontend

Real-time chat UI for Worknoon — built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Socket.IO**.

---

## Demo Walkthrough

🎥 **Frontend Demo Video**

Watch the full implementation walkthrough here:

**Loom:** https://www.loom.com/share/033dfeb161ca406793f939a203976388

### Walkthrough Covers

- Authentication flow and role selection
- Real-time messaging with Socket.IO
- Inbox and chat experience
- Typing indicators and online presence
- File upload support
- Notifications system
- Profile management
- Admin dashboard analytics
- Dark/light theme switching
- Offline support through Service Worker
- Frontend architecture and design decisions

---

## Project Goal

The goal of this frontend implementation is to provide a clean, responsive, and scalable chat experience suitable for an eCommerce environment where customers, agents, merchants, and designers can communicate in real time.

The application focuses on:

- Performance
- Responsive UX
- Authentication and security
- Real-time interactions
- Maintainable architecture
- Accessibility and scalability

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (dark/light theme) |
| State | Zustand (auth store + chat store) |
| Real-time | Socket.IO client |
| HTTP | Axios with auto-refresh interceptor |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Offline | Service Worker + `/offline` fallback page |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-org/worknoon-chat-frontend.git
cd worknoon-chat-frontend

# 2. Install
npm install

# 3. Configure
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL

# 4. Run
npm run dev   # → http://localhost:3000
```

---

## Environment Variables

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5001     # Backend API + Socket.IO URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001  # Explicit socket URL (falls back to API_URL)
NEXT_PUBLIC_MAX_FILE_SIZE_MB=10              # Max upload size shown in UI
NEXTAUTH_SECRET=your-secret                  # Session signing (future NextAuth use)
NEXTAUTH_URL=http://localhost:3000
```

---

## Pages

| Route | Description | Auth required |
|-------|-------------|---------------|
| `/` | Redirects → `/inbox` or `/login` | — |
| `/login` | Sign in form | No |
| `/signup` | Registration with role selection | No |
| `/inbox` | Inbox + real-time chat view | ✅ |
| `/notifications` | Notification centre | ✅ |
| `/profile` | Edit name, upload avatar | ✅ |
| `/admin` | Analytics dashboard + user management | ✅ Admin only |
| `/offline` | Shown by service worker when offline | — |

---

## Architecture

```
app/
├── layout.tsx               Root layout (fonts, toast, SW registration)
├── page.tsx                 Redirect guard (server component)
├── globals.css              CSS variables — dark + light theme
├── (app)/                   Route group with auth sidebar layout
│   ├── layout.tsx           Sidebar nav + logout + theme toggle
│   ├── inbox/page.tsx
│   ├── notifications/page.tsx
│   ├── profile/page.tsx
│   └── admin/page.tsx
├── login/page.tsx
├── signup/page.tsx
└── offline/page.tsx

components/
├── chat/
│   ├── InboxView.tsx        Three-panel inbox layout
│   ├── ConversationList.tsx Search + filter + conversation items
│   ├── ChatWindow.tsx       Message area + input + file uploader
│   ├── ConversationInfoPanel.tsx  Right info sidebar
│   ├── MessageBubble.tsx    Individual message with status icon
│   ├── TypingIndicator.tsx  Animated typing dots
│   └── FileUploader.tsx     Multi-file attach with preview
├── dashboard/
│   ├── AdminDashboard.tsx
│   ├── AnalyticsCard.tsx
│   ├── UserTable.tsx
│   └── MessageVolumeChart.tsx  SVG bar chart
├── shared/
│   └── NotificationPanel.tsx
├── ui/
│   ├── UserAvatar.tsx       Initials fallback + online dot
│   ├── RoleBadge.tsx        Colour-coded role pill
│   ├── OnlineStatus.tsx
│   └── Skeleton.tsx         Loading skeletons
└── ServiceWorkerRegistration.tsx

store/index.ts      Zustand — useAuthStore + useChatStore
hooks/index.ts      useDebounce · useSocket · useScrollToBottom
lib/
├── api.ts          Axios httpClient + all API modules
└── utils.ts        Date/time formatters, file size, initials
middleware.ts       Edge auth guard — redirect to /login if no cookie
```

---

## Features Implemented

### Required
- ✅ JWT sign-up / login (tokens persisted in httpOnly cookies)
- ✅ User roles: admin, agent, customer, designer, merchant
- ✅ Real-time messaging via Socket.IO
- ✅ CRUD conversations + messages
- ✅ Read/unread badges + timestamps
- ✅ Inbox + Chat View
- ✅ Profile page with avatar upload
- ✅ Admin Dashboard with analytics + user table

### Bonus
- ✅ Typing indicators
- ✅ Online/offline status
- ✅ File uploads (attachments in messages)
- ✅ Notifications panel
- ✅ Dark / Light mode toggle
- ✅ Offline fallback (Service Worker + `/offline` page)
- ✅ Edge-runtime auth middleware (no flash of unauthenticated content)

---

## Dark / Light Mode

The theme is toggled by the sidebar moon/sun button. It sets `data-theme="light"` on `<html>` and all colours switch via CSS custom properties — no JavaScript re-render required. The service worker caches the offline page so it works without network too.

---

## Challenges & Design Decisions

- **App Router vs Pages Router**: App Router was chosen for server-component redirects and edge-runtime middleware, enabling zero-flash auth protection.
- **Zustand over Redux**: Simpler boilerplate for two focused stores (auth + chat). `persist` middleware keeps the auth token in localStorage across page reloads.
- **CSS variables over Tailwind only**: All colours are CSS variables so the dark/light switch works instantly without rehydration. Tailwind config maps these vars to Tailwind classes for utility use.
- **Socket in a hook**: `useSocket` manages the singleton connection and wires all server events to the Zustand store, keeping components declarative.
- **Axios refresh interceptor**: Automatically retries a failed request after refreshing the access token, making the 15-minute token expiry transparent to the user.
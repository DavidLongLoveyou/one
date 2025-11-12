# The Great Beans - Next.js Frontend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_API_URL` to your Strapi backend URL
   - Set `STRAPI_API_TOKEN` if using authenticated requests

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Visit Application**
   - http://localhost:3000 (English)
   - http://localhost:3000/vi (Vietnamese)

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx (Homepage)
│   │   └── layout.tsx (Locale wrapper)
│   ├── layout.tsx (Root layout)
│   └── globals.css
├── components/
│   ├── ui/ (shadcn base components)
│   ├── sections/ (Homepage sections)
│   └── ...
├── lib/
│   ├── cms-client.ts (Strapi API client)
│   ├── utils.ts
│   └── seo/ (SEO utilities)
└── types/
    └── strapi.ts (Generated types)
```

## Design System

- **Primary Color**: Green-600 (#059669)
- **Fonts**: Inter (sans), Playfair Display (serif)
- **Spacing**: Base-4 scale
- **Layout**: Golden Ratio (1.618:1)

## Next Steps

After frontend skeleton is complete, proceed to Session 3: API Client & SEO Foundation.


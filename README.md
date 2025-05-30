# 🛒 ExpressIT Store

A modern, responsive eCommerce platform built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS** — featuring real-time product listings, dynamic product detail pages, domain validation, and store registration.

---

## 🚀 Features

- ✅ Dynamic Routing (Next.js App Router)
- ✅ SSR with `getProductById()`
- ✅ Domain name validation via API
- ✅ Store registration form with client-side validation
- ✅ Tailwind CSS styling
- ✅ TypeScript typesafety
- ✅ Skeleton loader on product page
- ✅ Dark mode toggle (optional)
- ✅ Deployed to Netlify

---

## 📦 Tech Stack

| Tech            | Description                      |
|----------------|----------------------------------|
| Next.js 15     | Full-stack React framework       |
| React 19       | Modern React with latest features|
| TypeScript     | Type-safe JavaScript             |
| Tailwind CSS 4 | Utility-first CSS                |
| Netlify        | Hosting & CI/CD                  |

---

## 🛠️ Installation

```bash
# 1. Clone the repo
git clone https://github.com/shahedzaman612/expressit-store.git
cd expressit-store

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
npm start
```

---

## 🧹 Clean Build (for PowerShell / Windows)

```powershell
Remove-Item -Recurse -Force .next, node_modules, package-lock.json
npm install
npm run build
```

---

## 🌐 Deployment (Netlify)

### ✅ Settings

| Setting         | Value          |
|----------------|----------------|
| Build Command  | `npm run build` |
| Publish Dir    | `.next`         |
| Base Directory | *(leave empty)* |

Make sure to add `@netlify/next` plugin to your `package.json` if needed.

---

## 🔧 Project Structure

```
/src
  ├── app
  │   ├── Products
  │   │   ├── page.tsx       # Product listing
  │   │   └── [id]/page.tsx  # Product detail page
  │   ├── layout.tsx
  │   └── page.tsx
  ├── components
  │   └── StoreForm.tsx      # Domain & store registration form
  ├── styles
      └── globals.css
```

---

## ✅ Environment

No `.env` required — external APIs used:

- Product API: `https://glore-bd-backend-node-mongo.vercel.app/api/product`
- Domain Checker: `https://interview-task-green.vercel.app/task/domains/check/{subdomain}`
- Store Creation: `https://interview-task-green.vercel.app/task/stores/create`

---

## 🧪 Validation Rules

- **Store Name**: Minimum 3 characters
- **Email**: Must be valid format
- **Domain**: Real-time validation
- **Currency / Category**: Dropdown

---

## 📷 Screenshots

| Product Page | Store Form |
|--------------|------------|
| ✅ SSR + Image | ✅ Validations + UX |
| ![Products](./screenshots/products.png) | ![Store](./screenshots/store-form.png) |

---

## 🙋‍♂️ Author

**Md. Shahed Zaman**  
Frontend Developer @ Express IT BD  
GitHub: [@shahedzaman612](https://github.com/shahedzaman612)

---

## 📝 License

This project is licensed under the MIT License.
# StockFlow - Inventory Management System

StockFlow is a modern inventory management system built with Next.js. It helps businesses manage products, categories, suppliers, stock levels, and inventory movements from a centralized dashboard.

The project demonstrates core Next.js concepts including the App Router, Server Components, Client Components, SSR, SSG, ISR, API Route Handlers, image optimization, MongoDB integration, Cloudinary image storage, and Vercel deployment.

## Features

### Dashboard

* Overview of total products
* Low-stock product count
* Total categories
* Total suppliers
* Total units in inventory
* Seven-day stock movement chart
* Low-stock product list
* Recent inventory activity

### Product Management

* View all products
* Search and filter products
* Add new products
* Edit products
* Delete products
* View detailed product information
* SKU management
* Product pricing
* Current stock tracking
* Minimum stock level
* Product descriptions
* Product image upload
* Automatic stock status

Product stock statuses:

* In Stock
* Low Stock
* Out of Stock

### Category Management

* Create categories
* Edit categories
* Delete categories
* View product count per category
* Automatically update product category names when a category is renamed

### Supplier Management

* Create suppliers
* Edit suppliers
* Delete suppliers
* Supplier contact information
* View products associated with each supplier
* Automatically update product supplier names when a supplier company is renamed

### Inventory Management

* Stock In
* Stock Out
* Prevent negative stock
* Record inventory movement history
* Track previous and new stock levels
* Add notes to inventory movements
* Search inventory history
* Filter Stock In and Stock Out movements

### Reports

* Total products
* Total inventory units
* Low-stock products
* Product categories
* Inventory health percentage
* Out-of-stock products
* Inventory summary

### Image Management

* Product image upload
* Cloudinary image storage
* Image preview before upload
* File type validation
* 5MB image size limit
* Next.js Image optimization

### Responsive Design

* Desktop sidebar navigation
* Mobile and tablet hamburger navigation
* Responsive tables
* Responsive dashboard cards
* Responsive forms and modals
* Dark modern UI

## Tech Stack

### Frontend

* Next.js
* React
* JavaScript
* Tailwind CSS
* Lucide React
* Recharts

### Backend

* Next.js Route Handlers
* Node.js
* MongoDB
* Mongoose

### Storage

* MongoDB Atlas
* Cloudinary

### Deployment

* Vercel

## Project Architecture

StockFlow uses the Next.js App Router with a single full-stack application.

```text
Browser
   |
   v
Next.js App Router
   |
   +----------------------+
   |                      |
   v                      v
Server Components     Client Components
   |                      |
   v                      v
MongoDB              API Route Handlers
                          |
                          v
                       MongoDB
                          |
                          v
                      Cloudinary
```

## Folder Structure

```text
stockflow/
├── app/
│   ├── api/
│   │   ├── categories/
│   │   ├── inventory/
│   │   ├── products/
│   │   ├── suppliers/
│   │   └── upload/
│   │
│   ├── about/
│   ├── categories/
│   ├── inventory/
│   ├── products/
│   │   ├── [id]/
│   │   ├── new/
│   │   └── ...
│   ├── reports/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── categories/
│   ├── dashboard/
│   ├── inventory/
│   ├── layout/
│   ├── products/
│   └── suppliers/
│
├── lib/
│   ├── cloudinary.js
│   └── mongodb.js
│
├── models/
│   ├── Category.js
│   ├── InventoryMovement.js
│   ├── Product.js
│   └── Supplier.js
│
├── images/
├── public/
├── seed.js
├── next.config.mjs
├── package.json
└── README.md
```

## Next.js Rendering Strategies

StockFlow demonstrates three different rendering strategies.

### Server-Side Rendering - SSR

The main dashboard uses Server-Side Rendering.

```js
export const dynamic = 'force-dynamic'
```

The dashboard fetches current inventory information from MongoDB whenever the page is requested.

This is useful for information that should remain up to date, such as:

* Current stock
* Low-stock products
* Recent inventory movements
* Product counts

Route:

```text
/
```

### Static Site Generation - SSG

The About page contains static content that does not need request-time database access.

Route:

```text
/about
```

Because the content is static, Next.js can generate the page ahead of time.

SSG is useful for pages such as:

* About pages
* Documentation
* Marketing pages
* Static information pages

### Incremental Static Regeneration - ISR

The Reports page uses ISR:

```js
export const revalidate = 60
```

This allows Next.js to cache the generated page and regenerate it periodically when new requests arrive after the revalidation period.

Route:

```text
/reports
```

ISR is useful when data needs to be updated periodically but does not need to be generated for every request.

## Server Components

StockFlow uses Server Components for pages that fetch data directly from MongoDB.

Examples include:

* Dashboard
* Product list
* Product details
* Reports

Example:

```js
export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <DashboardLayout>
      ...
    </DashboardLayout>
  )
}
```

This allows database queries to remain on the server instead of exposing database credentials to the browser.

## Client Components

Client Components are used when browser-side interaction is required.

Examples include:

* Product forms
* Stock adjustment
* Category management
* Supplier management
* Inventory filtering
* Inventory history
* Charts
* Mobile sidebar

Client Components use:

```js
'use client'
```

when they require React state, effects, event handlers, or browser APIs.

## API Route Handlers

StockFlow uses Next.js Route Handlers instead of a separate Express backend.

### Products

```text
GET    /api/products
POST   /api/products

GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

### Categories

```text
GET    /api/categories
POST   /api/categories

PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Suppliers

```text
GET    /api/suppliers
POST   /api/suppliers

PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
```

### Inventory

```text
GET    /api/inventory
POST   /api/inventory

GET    /api/inventory/:productId
```

### Image Upload

```text
POST /api/upload
```

Images are uploaded to Cloudinary and the resulting URL is stored with the product.

## Database Models

### Product

Stores:

* Name
* SKU
* Description
* Price
* Stock
* Minimum stock
* Category
* Supplier
* Image

### Category

Stores:

* Name
* Description

### Supplier

Stores:

* Contact name
* Company
* Email
* Phone
* Address

### Inventory Movement

Stores:

* Product
* Movement type
* Quantity
* Previous stock
* New stock
* Note
* Timestamp

## Inventory Logic

Stock can be increased using Stock In:

```text
Previous Stock + Quantity = New Stock
```

Stock can be decreased using Stock Out:

```text
Previous Stock - Quantity = New Stock
```

The API prevents stock from becoming negative.

For example:

```text
Current Stock: 20

Stock Out: 5

New Stock: 15
```

Every movement is recorded in the `InventoryMovement` collection.

## Image Optimization

Product images are stored using Cloudinary.

The application uses the Next.js Image component:

```jsx
import Image from 'next/image'
```

Example:

```jsx
<Image
  src={product.image}
  alt={product.name}
  fill
  sizes="(max-width: 1024px) 100vw, 33vw"
  className="rounded-xl object-cover"
/>
```

Cloudinary is configured as a trusted remote image source in `next.config.mjs`.

## Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Never commit `.env.local` or expose these credentials publicly.

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Enter the project:

```bash
cd stockflow
```

Install dependencies:

```bash
npm install
```

Create `.env.local` and add the required environment variables.

## Running the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Seeding the Database

StockFlow includes a seed script for creating sample inventory data.

The seed script:

1. Connects to MongoDB
2. Clears existing products
3. Clears existing categories
4. Clears existing suppliers
5. Clears existing inventory movements
6. Downloads sample product images
7. Creates categories
8. Creates suppliers
9. Creates products
10. Creates inventory movement history

Run:

```bash
npm run seed
```

The seed operation replaces the existing data in the StockFlow collections with the sample dataset.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run seed
```

Seeds the MongoDB database with sample data.

## Deployment

StockFlow can be deployed using Vercel.

### 1. Push the project to GitHub

```bash
git add .
git commit -m "Build StockFlow inventory management system"
git push origin main
```

### 2. Import the repository into Vercel

Create a new Vercel project and connect the GitHub repository.

### 3. Add Environment Variables

Add the following environment variables in Vercel:

```text
MONGODB_URI
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### 4. Deploy

Vercel will build and deploy the Next.js application.

## Future Improvements

Potential future improvements include:

* Authentication and role-based access
* Product image cleanup from Cloudinary
* MongoDB transactions for atomic inventory updates
* Advanced analytics
* Export reports as CSV/PDF
* Barcode scanning
* Purchase order management
* Sales integration
* Multi-location inventory
* Inventory alerts and notifications

## License

This project is built for educational and portfolio purposes.

# Author

**Furqan Ali**

Full-Stack Developer

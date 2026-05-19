# NewOLX - Classifieds Marketplace Platform

## Product Overview
NewOLX is a web-based classifieds marketplace application where users can browse, create, edit, and delete product listings. It also includes a newsletter subscription system and email contact functionality.

## Target Users
- General public browsing products for sale
- Sellers wanting to list products
- Newsletter subscribers

## Core Features

### 1. Product Listings (Ventas)
- Browse all products on homepage
- View product details (title, description, price, category, location, image)
- Create new product listing with image upload
- Edit existing product listing
- Delete product listing
- Filter products by category
- Supported categories: Tecnología, Hogar, Ropa, Deportes, Vehículos, Otros

### 2. Newsletter Subscription (Suscripciones)
- Subscribe with name, email, and message
- Role assignment (administrador, miembro, usuario) - defaults to usuario
- Full CRUD for subscriptions

### 3. Email Contact (Correo)
- Submit email address via contact form
- List all submitted emails

## Technical Requirements
- Node.js Express.js 5 backend
- MySQL database
- Static HTML/CSS frontend (vanilla)
- REST API endpoints for all CRUD operations
- Image upload support via multer

## Pages
- Homepage (/) - Browse products
- Form (/form.html) - Newsletter subscription
- Create Listing (/formVenta.html) - New product form
- Product Detail (/detail) - Single product view
- Edit Listing (/edit.html) - Edit product form
- All Listings (/ventas.html) - Filtered product view

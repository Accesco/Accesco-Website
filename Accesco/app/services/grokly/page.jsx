'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import "./grokly.css";

// ══════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════
const categories = [
  { id: "all", name: "All", color: "#0c831f", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/All.png" },
  { id: "vegetables-fruits", name: "Veggies & Fruits", color: "#10b981", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Fruits.png" },
  { id: "dairy-breakfast", name: "Dairy & Breakfast", color: "#3b82f6", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Dairy.png" },
  { id: "munchies", name: "Munchies", color: "#f59e0b", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Munchies.png" },
  { id: "cold-drinks", name: "Cold Drinks", color: "#ef4444", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Cold.png" },
  { id: "instant-frozen", name: "Instant & Frozen", color: "#8b5cf6", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Instant.png" },
  { id: "tea-coffee", name: "Tea & Coffee", color: "#78350f", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Tea.png" },
  { id: "bakery-biscuits", name: "Bakery & Biscuits", color: "#d97706", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Bakery.png" },
  { id: "sweet-tooth", name: "Sweet Tooth", color: "#ec4899", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Sweets.png" },
  { id: "atta-rice-dal", name: "Atta, Rice & Dal", color: "#eab308", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Atta.png" },
  { id: "masala-oil", name: "Masala & Oil", color: "#dc2626", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Masala.png" },
  { id: "sauces-spreads", name: "Sauces & Spreads", color: "#f97316", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Sauces.png" },
  { id: "organic-healthy", name: "Organic & Healthy", color: "#059669", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Organic.png" },
  { id: "baby-care", name: "Baby Care", color: "#06b6d4", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Baby.png" },
  { id: "pharma-wellness", name: "Pharma & Wellness", color: "#0891b2", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Pharma.png" },
  { id: "cleaning", name: "Cleaning", color: "#0284c7", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Cleaning.png" },
  { id: "home-office", name: "Home & Office", color: "#6366f1", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Home.png" },
  { id: "personal-care", name: "Personal Care", color: "#a855f7", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Personal.png" },
  { id: "pet-care", name: "Pet Care", color: "#d946ef", image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=90/assets/eta-icons/Pet.png" },
];

const products = [
  { id: "veg-001", name: "Tomato - Hybrid", brand: "Fresho", cat: "vegetables-fruits", price: 28, mrp: 35, disc: 20, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10590a.jpg", tags: ["Bestseller"], rating: 4.2 },
  { id: "veg-002", name: "Onion", brand: "Fresho", cat: "vegetables-fruits", price: 35, mrp: 40, disc: 12, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/17553a.jpg", tags: ["Bestseller"], rating: 4.1 },
  { id: "veg-003", name: "Potato", brand: "Fresho", cat: "vegetables-fruits", price: 22, mrp: 28, disc: 21, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/17482a.jpg", tags: ["Bestseller"], rating: 4.3 },
  { id: "veg-004", name: "Capsicum - Green", brand: "Fresho", cat: "vegetables-fruits", price: 45, mrp: 55, disc: 18, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10791a.jpg", rating: 4.0 },
  { id: "veg-005", name: "Carrot - Orange", brand: "Fresho", cat: "vegetables-fruits", price: 38, mrp: 45, disc: 15, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/143133a.jpg", rating: 4.4 },
  { id: "veg-006", name: "Cucumber", brand: "Fresho", cat: "vegetables-fruits", price: 32, mrp: 40, disc: 20, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10183a.jpg", rating: 4.2 },
  { id: "veg-007", name: "Cauliflower", brand: "Fresho", cat: "vegetables-fruits", price: 42, mrp: 50, disc: 16, unit: "1 pc", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10792a.jpg", rating: 4.1 },
  { id: "veg-008", name: "Ladies Finger (Bhindi)", brand: "Fresho", cat: "vegetables-fruits", price: 48, mrp: 60, disc: 20, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10795a.jpg", rating: 4.2 },
  { id: "fruit-001", name: "Banana - Robusta", brand: "Fresho", cat: "vegetables-fruits", price: 55, mrp: 65, disc: 15, unit: "6 pcs", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10184a.jpg", tags: ["Bestseller"], rating: 4.5 },
  { id: "fruit-002", name: "Apple - Shimla", brand: "Fresho", cat: "vegetables-fruits", price: 165, mrp: 195, disc: 15, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/13107a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "fruit-003", name: "Mango - Alphonso", brand: "Fresho", cat: "vegetables-fruits", price: 285, mrp: 350, disc: 18, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10185a.jpg", tags: ["Premium"], rating: 4.7 },
  { id: "fruit-004", name: "Orange", brand: "Fresho", cat: "vegetables-fruits", price: 95, mrp: 115, disc: 17, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10186a.jpg", rating: 4.4 },
  { id: "fruit-005", name: "Grapes - Green", brand: "Fresho", cat: "vegetables-fruits", price: 125, mrp: 145, disc: 13, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10187a.jpg", rating: 4.5 },
  { id: "fruit-006", name: "Pomegranate", brand: "Fresho", cat: "vegetables-fruits", price: 185, mrp: 220, disc: 15, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10188a.jpg", rating: 4.6 },
  { id: "dairy-001", name: "Amul Taaza Toned Milk", brand: "Amul", cat: "dairy-breakfast", price: 27, mrp: 30, disc: 10, unit: "500 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483840a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "dairy-002", name: "Amul Gold Full Cream Milk", brand: "Amul", cat: "dairy-breakfast", price: 32, mrp: 35, disc: 8, unit: "500 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483841a.jpg", tags: ["Bestseller"], rating: 4.7 },
  { id: "dairy-003", name: "Mother Dairy Classic Curd", brand: "Mother Dairy", cat: "dairy-breakfast", price: 30, mrp: 35, disc: 14, unit: "400 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90349a.jpg", tags: ["Bestseller"], rating: 4.5 },
  { id: "dairy-004", name: "Amul Butter - Salted", brand: "Amul", cat: "dairy-breakfast", price: 58, mrp: 60, disc: 3, unit: "100 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1254a.jpg", tags: ["Bestseller"], rating: 4.8 },
  { id: "dairy-005", name: "Amul Cheese Slices", brand: "Amul", cat: "dairy-breakfast", price: 135, mrp: 145, disc: 6, unit: "200 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1303a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "dairy-006", name: "Britannia Whole Wheat Bread", brand: "Britannia", cat: "dairy-breakfast", price: 45, mrp: 50, disc: 10, unit: "450 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/90072a.jpg", tags: ["Bestseller"], rating: 4.4 },
  { id: "dairy-007", name: "Amul Fresh Cream", brand: "Amul", cat: "dairy-breakfast", price: 52, mrp: 55, disc: 5, unit: "250 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1316a.jpg", rating: 4.5 },
  { id: "dairy-008", name: "Amul Masti Buttermilk", brand: "Amul", cat: "dairy-breakfast", price: 20, mrp: 22, disc: 9, unit: "200 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/1317a.jpg", rating: 4.4 },
  { id: "munch-001", name: "Lays India's Magic Masala", brand: "Lays", cat: "munchies", price: 20, mrp: 20, disc: 0, unit: "52 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483689a.jpg", tags: ["Bestseller"], rating: 4.5 },
  { id: "munch-002", name: "Kurkure Masala Munch", brand: "Kurkure", cat: "munchies", price: 20, mrp: 20, disc: 0, unit: "78 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10491a.jpg", tags: ["Bestseller"], rating: 4.4 },
  { id: "munch-003", name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", cat: "munchies", price: 55, mrp: 60, disc: 8, unit: "200 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10066a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "munch-004", name: "Pringles Original", brand: "Pringles", cat: "munchies", price: 99, mrp: 110, disc: 10, unit: "107 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483693a.jpg", rating: 4.6 },
  { id: "munch-005", name: "Haldiram's Moong Dal", brand: "Haldiram's", cat: "munchies", price: 50, mrp: 55, disc: 9, unit: "200 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10067a.jpg", rating: 4.5 },
  { id: "munch-006", name: "Bikaji Bhujia Sev", brand: "Bikaji", cat: "munchies", price: 45, mrp: 50, disc: 10, unit: "200 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/10068a.jpg", rating: 4.4 },
  { id: "drink-001", name: "Coca-Cola Soft Drink", brand: "Coca-Cola", cat: "cold-drinks", price: 40, mrp: 45, disc: 11, unit: "750 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483598a.jpg", tags: ["Bestseller"], rating: 4.5 },
  { id: "drink-002", name: "Sprite Lime Soft Drink", brand: "Sprite", cat: "cold-drinks", price: 40, mrp: 45, disc: 11, unit: "750 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483600a.jpg", tags: ["Bestseller"], rating: 4.4 },
  { id: "drink-003", name: "Tropicana Mixed Fruit Juice", brand: "Tropicana", cat: "cold-drinks", price: 110, mrp: 120, disc: 8, unit: "1 l", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483602a.jpg", rating: 4.6 },
  { id: "drink-004", name: "Pepsi Black", brand: "Pepsi", cat: "cold-drinks", price: 40, mrp: 45, disc: 11, unit: "750 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483605a.jpg", rating: 4.3 },
  { id: "instant-001", name: "Maggi 2-Minute Masala Noodles", brand: "Maggi", cat: "instant-frozen", price: 14, mrp: 15, disc: 6, unit: "70 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483606a.jpg", tags: ["Bestseller"], rating: 4.7 },
  { id: "instant-002", name: "Yippee! Magic Masala Noodles", brand: "Yippee", cat: "instant-frozen", price: 12, mrp: 14, disc: 14, unit: "70 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483608a.jpg", rating: 4.4 },
  { id: "instant-003", name: "McCain French Fries", brand: "McCain", cat: "instant-frozen", price: 135, mrp: 150, disc: 10, unit: "420 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483610a.jpg", rating: 4.5 },
  { id: "tea-001", name: "Tata Tea Gold", brand: "Tata Tea", cat: "tea-coffee", price: 235, mrp: 250, disc: 6, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483612a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "tea-002", name: "Nescafe Classic Coffee", brand: "Nescafe", cat: "tea-coffee", price: 320, mrp: 350, disc: 8, unit: "200 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483614a.jpg", tags: ["Bestseller"], rating: 4.7 },
  { id: "tea-003", name: "Red Label Natural Care Tea", brand: "Red Label", cat: "tea-coffee", price: 265, mrp: 285, disc: 7, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483616a.jpg", rating: 4.5 },
  { id: "bakery-001", name: "Parle-G Gold Biscuits", brand: "Parle", cat: "bakery-biscuits", price: 10, mrp: 10, disc: 0, unit: "100 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483618a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "bakery-002", name: "Britannia Good Day Butter Cookies", brand: "Britannia", cat: "bakery-biscuits", price: 35, mrp: 40, disc: 12, unit: "150 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483620a.jpg", rating: 4.5 },
  { id: "bakery-003", name: "Sunfeast Dark Fantasy Choco Fills", brand: "Sunfeast", cat: "bakery-biscuits", price: 40, mrp: 45, disc: 11, unit: "150 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483622a.jpg", rating: 4.7 },
  { id: "sweet-001", name: "Cadbury Dairy Milk Chocolate", brand: "Cadbury", cat: "sweet-tooth", price: 45, mrp: 50, disc: 10, unit: "55 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483624a.jpg", tags: ["Bestseller"], rating: 4.8 },
  { id: "sweet-002", name: "KitKat Chocolate", brand: "KitKat", cat: "sweet-tooth", price: 20, mrp: 20, disc: 0, unit: "27 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483626a.jpg", rating: 4.6 },
  { id: "sweet-003", name: "5 Star Chocolate", brand: "5 Star", cat: "sweet-tooth", price: 10, mrp: 10, disc: 0, unit: "22 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483628a.jpg", rating: 4.5 },
  { id: "atta-001", name: "Aashirvaad Whole Wheat Atta", brand: "Aashirvaad", cat: "atta-rice-dal", price: 285, mrp: 310, disc: 8, unit: "5 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483630a.jpg", tags: ["Bestseller"], rating: 4.7 },
  { id: "atta-002", name: "India Gate Basmati Rice", brand: "India Gate", cat: "atta-rice-dal", price: 525, mrp: 575, disc: 8, unit: "5 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483632a.jpg", rating: 4.6 },
  { id: "atta-003", name: "Tata Sampann Toor Dal", brand: "Tata Sampann", cat: "atta-rice-dal", price: 145, mrp: 160, disc: 9, unit: "1 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483634a.jpg", rating: 4.5 },
  { id: "masala-001", name: "Fortune Sunflower Refined Oil", brand: "Fortune", cat: "masala-oil", price: 185, mrp: 200, disc: 7, unit: "1 l", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483636a.jpg", tags: ["Bestseller"], rating: 4.5 },
  { id: "masala-002", name: "MDH Chana Masala", brand: "MDH", cat: "masala-oil", price: 95, mrp: 105, disc: 9, unit: "100 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483638a.jpg", rating: 4.6 },
  { id: "masala-003", name: "Everest Garam Masala", brand: "Everest", cat: "masala-oil", price: 85, mrp: 95, disc: 10, unit: "100 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483640a.jpg", rating: 4.5 },
  { id: "sauce-001", name: "Kissan Fresh Tomato Ketchup", brand: "Kissan", cat: "sauces-spreads", price: 95, mrp: 105, disc: 9, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483642a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "sauce-002", name: "Maggi Hot & Sweet Sauce", brand: "Maggi", cat: "sauces-spreads", price: 85, mrp: 95, disc: 10, unit: "500 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483644a.jpg", rating: 4.5 },
  { id: "sauce-003", name: "Nutella Hazelnut Spread", brand: "Nutella", cat: "sauces-spreads", price: 385, mrp: 420, disc: 8, unit: "350 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483646a.jpg", rating: 4.7 },
  { id: "organic-001", name: "Organic India Tulsi Green Tea", brand: "Organic India", cat: "organic-healthy", price: 185, mrp: 210, disc: 11, unit: "25 bags", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483648a.jpg", rating: 4.6 },
  { id: "organic-002", name: "Soulfull Ragi Bites", brand: "Soulfull", cat: "organic-healthy", price: 125, mrp: 140, disc: 10, unit: "250 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483650a.jpg", rating: 4.5 },
  { id: "baby-001", name: "Pampers Baby Dry Pants", brand: "Pampers", cat: "baby-care", price: 999, mrp: 1099, disc: 9, unit: "56 pants", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483652a.jpg", tags: ["Bestseller"], rating: 4.7 },
  { id: "baby-002", name: "Cerelac Wheat Apple", brand: "Cerelac", cat: "baby-care", price: 235, mrp: 260, disc: 9, unit: "300 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483654a.jpg", rating: 4.6 },
  { id: "pharma-001", name: "Dettol Antiseptic Liquid", brand: "Dettol", cat: "pharma-wellness", price: 125, mrp: 140, disc: 10, unit: "250 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483656a.jpg", rating: 4.6 },
  { id: "pharma-002", name: "Vicks Vaporub", brand: "Vicks", cat: "pharma-wellness", price: 95, mrp: 105, disc: 9, unit: "50 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483658a.jpg", rating: 4.5 },
  { id: "clean-001", name: "Vim Dishwash Gel", brand: "Vim", cat: "cleaning", price: 125, mrp: 140, disc: 10, unit: "750 ml", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483660a.jpg", rating: 4.5 },
  { id: "clean-002", name: "Harpic Toilet Cleaner", brand: "Harpic", cat: "cleaning", price: 185, mrp: 210, disc: 11, unit: "1 l", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483662a.jpg", rating: 4.6 },
  { id: "home-001", name: "Scotch Brite Scrub Pad", brand: "Scotch Brite", cat: "home-office", price: 35, mrp: 40, disc: 12, unit: "3 pcs", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483664a.jpg", rating: 4.5 },
  { id: "personal-001", name: "Colgate Total Toothpaste", brand: "Colgate", cat: "personal-care", price: 95, mrp: 110, disc: 13, unit: "140 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483666a.jpg", tags: ["Bestseller"], rating: 4.6 },
  { id: "personal-002", name: "Dove Soap", brand: "Dove", cat: "personal-care", price: 65, mrp: 75, disc: 13, unit: "100 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483668a.jpg", rating: 4.7 },
  { id: "pet-001", name: "Pedigree Adult Dog Food", brand: "Pedigree", cat: "pet-care", price: 385, mrp: 425, disc: 9, unit: "1.2 kg", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483670a.jpg", rating: 4.5 },
  { id: "pet-002", name: "Whiskas Cat Food", brand: "Whiskas", cat: "pet-care", price: 185, mrp: 210, disc: 11, unit: "480 g", img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/483672a.jpg", rating: 4.4 },
];

const banners = [
  { bg: "linear-gradient(135deg,#0c831f,#065f17)", tag: "UP TO 30% OFF", title: "Farm Fresh Veggies", sub: "Direct from farm to your door in 11 mins" },
  { bg: "linear-gradient(135deg,#1d4ed8,#1e40af)", tag: "BESTSELLERS", title: "Dairy Essentials", sub: "Amul, Mother Dairy & 100+ brands" },
  { bg: "linear-gradient(135deg,#b45309,#92400e)", tag: "SAVE BIG TODAY", title: "Morning Bliss", sub: "Tea, Coffee & Healthy Drinks" },
  { bg: "linear-gradient(135deg,#7c3aed,#5b21b6)", tag: "NEW ARRIVALS", title: "Sweet Cravings", sub: "Chocolates, candy & more treats" },
];

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════
const starsStr = (r) => Array.from({ length: 5 }, (_, i) => (i < Math.floor(r) ? "★" : "☆")).join("");
const fallbackImg = (name) => `https://placehold.co/120x120/e8f5e9/0c831f?text=${encodeURIComponent(name[0])}`;

const GroklyLogo = () => (
  <Image 
    src="/images/grokly-icon.png" 
    alt="Grokly Logo" 
    width={40} 
    height={40}
    style={{ display: 'block' }}
  />
);

// ══════════════════════════════════════════════
//  SUB-COMPONENTS
// ══════════════════════════════════════════════

function ProductCard({ p, qty, onAdd, onInc, onDec }) {
  return (
    <div className="pcard" data-pid={p.id}>
      {p.disc > 0 && <div className="disc-badge">{p.disc}% OFF</div>}
      {p.tags?.includes("Bestseller") && <div className="best-badge">⚡ Best</div>}
      {p.tags?.includes("Premium") && (
        <div className="best-badge" style={{ background: "#faf5ff", color: "#7c3aed", borderColor: "#e9d5ff" }}>✦ Premium</div>
      )}
      <div className="pimg-wrap">
        <img className="pimg" src={p.img} alt={p.name} loading="lazy"
          onError={(e) => { e.target.src = fallbackImg(p.name); }} />
      </div>
      <div className="pdeliv"><span>⚡</span> 11 MINS</div>
      <div className="pinfo">
        <div className="punit">{p.unit}</div>
        <div className="pname">{p.name}</div>
        <div className="pbrand">{p.brand}</div>
        <div className="pstars">{starsStr(p.rating)}<span>{p.rating}</span></div>
        <div className="pfoot">
          <div className="pprice-wrap">
            <div className="pprice">₹{p.price}</div>
            {p.mrp > p.price && <div className="pmrp">₹{p.mrp}</div>}
          </div>
          {qty === 0 ? (
            <button className="add-btn" onClick={() => onAdd(p.id)}>ADD</button>
          ) : (
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => onDec(p.id)}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => onInc(p.id)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onInc, onDec, onCheckout }) {
  const items = Object.entries(cart)
    .map(([id, q]) => ({ p: products.find((x) => x.id === id), q }))
    .filter((x) => x.p);

  const total = items.reduce((s, { p, q }) => s + p.price * q, 0);
  const savings = items.reduce((s, { p, q }) => s + (p.mrp - p.price) * q, 0);
  const count = items.reduce((s, { q }) => s + q, 0);
  const delivFee = total >= 199 ? 0 : 19;

  return (
    <div id="cart-overlay" className="open" onClick={onClose}>
      <div id="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cd-head">
          <div>
            <div className="cd-title">My Cart</div>
            <div className="cd-sub">{count} item{count !== 1 ? "s" : ""}</div>
          </div>
          <button className="cd-close" onClick={onClose}>✕</button>
        </div>
        <div
          className="cd-deliv-banner"
          style={{
            background: count === 0 ? "#f0fdf4" : delivFee === 0 ? "#f0fdf4" : "#fff8e1",
            color: count === 0 ? "#065f17" : delivFee === 0 ? "#065f17" : "#e65100",
          }}
        >
          {count === 0
            ? "Your cart is empty"
            : delivFee === 0
            ? "🎉 You got FREE delivery on this order!"
            : `Add ₹${199 - total} more for FREE delivery`}
        </div>
        <div id="cd-body" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {count === 0 ? (
            <div className="cd-empty">
              <svg className="cd-empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <div className="cd-empty-title">Your cart is empty</div>
              <div className="cd-empty-sub">Add items to get started</div>
            </div>
          ) : (
            <>
              <div className="cd-items">
                {items.map(({ p, q }) => (
                  <div className="ci" key={p.id}>
                    <img className="ci-img" src={p.img} alt={p.name}
                      onError={(e) => { e.target.src = fallbackImg(p.name); }} />
                    <div className="ci-info">
                      <div className="ci-name">{p.name}</div>
                      <div className="ci-unit">{p.unit}</div>
                      <div className="ci-price">₹{p.price} × {q} = <strong>₹{p.price * q}</strong></div>
                    </div>
                    <div className="ci-qty">
                      <button className="ci-qbtn" onClick={() => onDec(p.id)}>−</button>
                      <span className="ci-qnum">{q}</span>
                      <button className="ci-qbtn" onClick={() => onInc(p.id)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cd-summary">
                <div className="sum-row"><span>Item Total</span><span>₹{total}</span></div>
                <div className="sum-row"><span>Delivery Fee</span><span className={delivFee === 0 ? "sum-free" : ""}>{delivFee === 0 ? "FREE" : `₹${delivFee}`}</span></div>
                <div className="sum-row"><span>Handling Fee</span><span>₹2</span></div>
                {savings > 0 && <div className="sum-row sum-save"><span>🎉 Total Savings</span><span>−₹{savings}</span></div>}
                <div className="sum-row sum-total"><span>To Pay</span><span>₹{total + delivFee + 2}</span></div>
              </div>
              <button className="cd-checkout" onClick={onCheckout}>Proceed to Checkout →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════
export default function GroklyPage() {
  const [cart, setCart] = useState({});
  const [activeCat, setActiveCat] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [bannerIdx, setBannerIdx] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });
  const bannerTimer = useRef(null);

  // Cart helpers
  const cartTotal = useCallback(() =>
    Object.entries(cart).reduce((s, [id, q]) => { const p = products.find((x) => x.id === id); return s + (p ? p.price * q : 0); }, 0), [cart]);
  const cartCount = useCallback(() => Object.values(cart).reduce((s, q) => s + q, 0), [cart]);
  const cartSavings = useCallback(() =>
    Object.entries(cart).reduce((s, [id, q]) => { const p = products.find((x) => x.id === id); return s + (p ? (p.mrp - p.price) * q : 0); }, 0), [cart]);

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 1800);
  };

  const addToCart = (id) => { setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })); showToast("Added to cart ✓"); };
  const incCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decCart = (id) => setCart((c) => {
    if (!c[id]) return c;
    const next = { ...c, [id]: c[id] - 1 };
    if (next[id] <= 0) delete next[id];
    return next;
  });

  // Banner auto-play
  useEffect(() => {
    bannerTimer.current = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 3800);
    return () => clearInterval(bannerTimer.current);
  }, []);

  const goHome = () => { setActiveCat("all"); setSearchQ(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const count = cartCount();
  const total = cartTotal();
  const savings = cartSavings();

  // Filter products
  const filtered = searchQ
    ? products.filter((p) => p.name.toLowerCase().includes(searchQ) || p.brand.toLowerCase().includes(searchQ))
    : activeCat !== "all"
    ? products.filter((p) => p.cat === activeCat)
    : products;

  const bestsellers = products.filter((p) => p.tags?.includes("Bestseller"));

  const renderCard = (p) => (
    <ProductCard key={p.id} p={p} qty={cart[p.id] || 0} onAdd={addToCart} onInc={incCart} onDec={decCart} />
  );

  return (
    <>
      {/* ════ DESKTOP TOP BAR ════ */}
      <div id="topbar">
        <div className="topbar-inner">
          <div className="logo" onClick={goHome}>
            <div className="logo-icon"><GroklyLogo /></div>
            <span className="logo-text">grokly</span>
          </div>
          <div className="loc-btn">
            <span className="loc-pin">📍</span>
            <div className="loc-text">
              <span className="loc-label">Deliver to</span>
              <span className="loc-name">Pune, Maharashtra ▾</span>
            </div>
          </div>
          <div className="desk-search">
            <span className="s-icon">🔍</span>
            <input
              type="text"
              placeholder='Search for "kurkure"'
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value.toLowerCase().trim())}
            />
            {searchQ && (
              <button className="s-clear" style={{ display: "block" }} onClick={() => setSearchQ("")}>✕</button>
            )}
          </div>
          <div className="desk-deliv">
            <span className="bolt">⚡</span>
            <span><strong>11 Min</strong> Delivery</span>
          </div>
          <button className="hdr-login">Login</button>
          <button className="hdr-cart" onClick={() => setCartOpen(true)}>
            🛒 &nbsp;Cart
            {count > 0 && <span className="hdr-cart-count">{count}</span>}
            {count > 0 && <span className="hdr-cart-amt">₹{total}</span>}
          </button>
        </div>
      </div>

      {/* ════ DESKTOP SUB-NAV ════ */}
      <div id="subnav">
        <div className="subnav-inner">
          {categories.map((c) => (
            <button key={c.id} className={`cat-chip${activeCat === c.id ? " active" : ""}`} onClick={() => { setActiveCat(c.id); setSearchQ(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Image src={c.image} alt={c.name} width={20} height={20} className="cat-chip-img" />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ════ MOBILE HEADER ════ */}
      <div id="mobile-header">
        <div className="mh-row1">
          <div className="logo" onClick={goHome}>
            <div className="logo-icon"><GroklyLogo /></div>
            <span className="logo-text">grokly</span>
          </div>
          <div className="mh-loc">
            <span className="loc-pin">📍</span>
            <div className="mh-loc-txt">
              <span className="loc-label">Deliver to</span>
              <span className="loc-name" style={{ fontSize: "12px", fontWeight: 800, color: "var(--tp)" }}>Pune, MH ▾</span>
            </div>
          </div>
          <button className="mh-cart" onClick={() => setCartOpen(true)}>
            <svg className="mh-cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {count > 0 && <span className="mh-badge" style={{ display: "flex" }}>{count > 9 ? "9+" : count}</span>}
          </button>
        </div>
        <div className="mh-search">
          <span style={{ fontSize: "16px" }}>🔍</span>
          <input
            type="text"
            placeholder='Search for "banana"'
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value.toLowerCase().trim())}
          />
        </div>
        <div className="mh-strip">
          <span style={{ fontSize: "13px" }}>⚡</span>
          <span className="mh-strip-txt">Delivery in <strong>11 minutes</strong> · 7000+ products</span>
        </div>
      </div>

      {/* ════ MOBILE CATEGORY BAR ════ */}
      <div id="mobile-catbar">
        <div className="mcat-track">
          {categories.map((c) => (
            <button key={c.id} className={`mcat-chip${activeCat === c.id ? " active" : ""}`}
              onClick={() => { setActiveCat(c.id); setSearchQ(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Image src={c.image} alt={c.name} width={32} height={32} className="mcat-img" />
              <span className="cn">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ════ APP SHELL ════ */}
      <div id="app">
        <div id="body-wrap">
          <aside id="sidebar" />
          <main id="content">

            {/* ── SEARCH VIEW ── */}
            {searchQ ? (
              <>
                <div className="results-head">Results for "{searchQ}" ({filtered.length})</div>
                {filtered.length === 0 ? (
                  <div className="no-results">
                    <svg className="no-results-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <h3>No products found</h3>
                    <p>Try searching something else</p>
                  </div>
                ) : (
                  <div className="prod-grid">{filtered.map(renderCard)}</div>
                )}
              </>
            ) : activeCat !== "all" ? (
              /* ── CATEGORY VIEW ── */
              (() => {
                const cat = categories.find((c) => c.id === activeCat);
                return (
                  <>
                    <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ fontSize: "32px" }}>{cat.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 800, color: "#1a1a1a" }}>{cat.name}</div>
                        <div style={{ fontSize: "13px", color: "#999", fontWeight: 600 }}>{filtered.length} products</div>
                      </div>
                    </div>
                    <div className="prod-grid">{filtered.map(renderCard)}</div>
                  </>
                );
              })()
            ) : (
              /* ── HOME VIEW ── */
              <>
                {/* Hero Banners */}
                <div id="banners">
                  <div className="banner-wrap">
                    <div className="banner-slides" id="banner-track"
                      style={{ width: `${banners.length * 100}%`, transform: `translateX(-${bannerIdx * (100 / banners.length)}%)` }}>
                      {banners.map((b, i) => (
                        <div key={i} className="banner-slide"
                          style={{ background: b.bg, width: `${100 / banners.length}%` }}>
                          <div className="b-content">
                            <div className="b-tag">{b.tag}</div>
                            <div className="b-title">{b.title}</div>
                            <div className="b-sub">{b.sub}</div>
                            <button className="b-cta">Shop Now ›</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="b-dots">
                    {banners.map((_, i) => (
                      <button key={i} className={`b-dot${i === bannerIdx ? " active" : ""}`}
                        onClick={() => { setBannerIdx(i); clearInterval(bannerTimer.current); bannerTimer.current = setInterval(() => setBannerIdx((x) => (x + 1) % banners.length), 3800); }} />
                    ))}
                  </div>
                </div>

                {/* Promo Strip */}
                <div className="promo-strip">
                  {[
                    { title: "11-Min Delivery", sub: "7000+ products available", bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", bc: "#bbf7d0" },
                    { title: "Free Delivery above ₹199", sub: "No hidden charges", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", bc: "#bfdbfe" },
                    { title: "100% Safe Payments", sub: "UPI, Cards & more", bg: "linear-gradient(135deg,#fff7ed,#fed7aa)", bc: "#fdba74" },
                    { title: "Easy Returns", sub: "Hassle-free refunds", bg: "linear-gradient(135deg,#fdf4ff,#f3e8ff)", bc: "#e9d5ff" },
                  ].map((pc, i) => (
                    <div key={i} className="promo-card" style={{ background: pc.bg, borderColor: pc.bc }}>
                      <div className="promo-text"><p>{pc.title}</p><span>{pc.sub}</span></div>
                    </div>
                  ))}
                </div>

                {/* Shop by Category */}
                <div className="divider" />
                <div className="sec-head">
                  <div className="sec-title">Shop by Category</div>
                </div>
                <div className="qcat-grid">
                  {categories.slice(1, 9).map((c) => (
                    <div key={c.id} className="qcat-tile" onClick={() => { setActiveCat(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      <Image 
                        src={c.image} 
                        alt={c.name} 
                        width={56} 
                        height={56} 
                        className="qt-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="qt-name">{c.name}</div>
                    </div>
                  ))}
                </div>

                {/* Bestsellers */}
                <div className="divider" />
                <div className="sec-head">
                  <div className="sec-title">⚡ Bestsellers</div>
                  <button className="sec-see" onClick={() => setActiveCat("all")}>See All</button>
                </div>
                <div className="h-scroll">
                  {bestsellers.slice(0, 12).map((p) => (
                    <div key={p.id} style={{ flexShrink: 0, width: "155px" }}>{renderCard(p)}</div>
                  ))}
                </div>

                {/* Fresh Deals */}
                <div className="divider" />
                <div className="sec-head">
                  <div className="sec-title">🥬 Fresh Deals Today</div>
                  <button className="sec-see" onClick={() => setActiveCat("vegetables-fruits")}>See All</button>
                </div>
                <div className="prod-grid">
                  {products.filter((p) => p.cat === "vegetables-fruits").slice(0, 8).map(renderCard)}
                </div>

                {/* Dairy */}
                <div className="divider" />
                <div className="sec-head">
                  <div className="sec-title">🥛 Dairy & Breakfast</div>
                  <button className="sec-see" onClick={() => setActiveCat("dairy-breakfast")}>See All</button>
                </div>
                <div className="prod-grid">
                  {products.filter((p) => p.cat === "dairy-breakfast").slice(0, 8).map(renderCard)}
                </div>

                {/* Snacks */}
                <div className="divider" />
                <div className="sec-head">
                  <div className="sec-title">🍿 Munchies & Snacks</div>
                  <button className="sec-see" onClick={() => setActiveCat("munchies")}>See All</button>
                </div>
                <div className="prod-grid">
                  {products.filter((p) => p.cat === "munchies").slice(0, 6).map(renderCard)}
                </div>

                {/* Grokly Pass Banner */}
                <div style={{ padding: "16px 20px 0" }}>
                  <div style={{ borderRadius: "20px", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", overflow: "hidden", position: "relative" }}>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,.7)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>LIMITED TIME</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 900, color: "#fff", marginBottom: "6px" }}>Get Grokly Pass</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,.8)", fontWeight: 600, marginBottom: "14px" }}>Unlimited free delivery every month</div>
                      <button className="b-cta" onClick={() => showToast("Grokly Pass coming soon! 🚀")}>Get Pass ›</button>
                    </div>
                    <div style={{ fontSize: "72px", filter: "drop-shadow(0 6px 16px rgba(0,0,0,.3))" }}>🛵</div>
                  </div>
                </div>

                {/* All Products */}
                <div className="divider" />
                <div className="sec-head">
                  <div className="sec-title">🛒 All Products</div>
                </div>
                <div className="prod-grid">{products.map(renderCard)}</div>
              </>
            )}
          </main>
        </div>

        {/* ════ FOOTER ════ */}
        <footer id="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon" style={{ width: "34px", height: "34px" }}><GroklyLogo /></div>
                <span className="logo-text">grokly</span>
              </div>
              <p>India's fastest grocery delivery — fresh produce, daily essentials & more delivered in 11 minutes.</p>
              <div className="footer-deliv">⚡ Delivery in 11 minutes</div>
              <div style={{ marginTop: "16px", display: "flex", gap: "10px" }} className="footer-social">
                {["𝕏", "in", "📸", "▶"].map((s, i) => <div key={i} className="social-btn">{s}</div>)}
              </div>
            </div>
            {[
              { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Investors"] },
              { title: "For Customers", links: ["My Account", "My Orders", "Grokly Pass", "Refer & Earn", "Gift Cards"] },
              { title: "For Partners", links: ["Sell on Grokly", "Advertise", "Delivery Partner", "Store Partner"] },
              { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Refund Policy"] },
            ].map((col) => (
              <div key={col.title} className="f-col">
                <h4>{col.title}</h4>
                <ul>{col.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
              </div>
            ))}
            <div className="f-col">
              <h4>Download App</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                {[{ icon: "🍎", label: "Download on the", store: "App Store" }, { icon: "▶", label: "Get it on", store: "Google Play" }].map((s) => (
                  <div key={s.store} style={{ background: "#111", border: "1px solid #333", borderRadius: "10px", padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: "9px", color: "#888", fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontSize: "13px", color: "#fff", fontWeight: 800 }}>{s.store}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Grokly Technologies Pvt. Ltd. All rights reserved.</p>
            <div className="footer-badges">
              {["🔒 SSL Secured", "✅ FSSAI Licensed", "💳 Secure Payments"].map((b) => (
                <span key={b} className="badge-pill">{b}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* ════ FLOATING CART BAR ════ */}
      {count > 0 && (
        <div id="cart-bar" className="show" onClick={() => setCartOpen(true)}>
          <div className="cb-left">
            <span className="cb-count">{count} item{count > 1 ? "s" : ""}</span>
            {savings > 0 && <span className="cb-save">You save ₹{savings}</span>}
          </div>
          <div className="cb-right">
            <span className="cb-total">₹{total}</span>
            <span className="cb-cta">View Cart →</span>
          </div>
        </div>
      )}

      {/* ════ BOTTOM NAV (mobile) ════ */}
      <div id="bottom-nav">
        {[
          { label: "Home", action: goHome, svg: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
          { label: "Search", action: () => document.querySelector(".mh-search input")?.focus(), svg: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></> },
          { label: "Orders", action: () => showToast("No orders yet"), svg: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></> },
          { label: "Account", action: () => showToast("Login to view account"), svg: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
        ].map(({ label, action, svg }) => (
          <button key={label} className="bnav-tab" onClick={action}>
            <svg className="bnav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {svg}
            </svg>
            <span className="bnav-label">{label}</span>
          </button>
        ))}
      </div>

      {/* ════ CART DRAWER ════ */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onInc={incCart}
          onDec={decCart}
          onCheckout={() => showToast("Order placed! Arriving in 11 mins 🛵")}
        />
      )}

      {/* ════ TOAST ════ */}
      <div id="toast" className={toast.show ? "show" : ""}>{toast.msg}</div>
    </>
  );
}
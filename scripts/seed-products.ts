import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import * as fs from "fs";
import * as path from "path";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL not found in .env.local");
}

const client = new ConvexHttpClient(convexUrl);

// Product definitions with image mappings
const productDefinitions = [
  // Spring
  {
    title: "Spring Garden Hydrangea Wreath",
    slug: "spring-garden-hydrangea-wreath",
    price: 65,
    description: "A beautiful spring wreath featuring lush hydrangeas and delicate greenery. Perfect for bringing fresh garden vibes to your front door.",
    image: "spring-garden-hydrangea-pro.png",
    style: "classic" as const,
    colours: ["white", "green", "pink"],
    suitableFor: ["front door", "indoor", "spring", "summer"],
    stock: 3,
    featured: true,
    badge: null,
  },
  // Autumn
  {
    title: "Autumn Sunflower Harvest",
    slug: "autumn-sunflower-harvest",
    price: 75,
    description: "Celebrate the harvest season with this stunning sunflower wreath featuring rich autumn colours and rustic charm.",
    image: "autumn-sunflower-harvest-pro.png",
    style: "seasonal" as const,
    colours: ["yellow", "orange", "brown", "red"],
    suitableFor: ["front door", "autumn", "thanksgiving"],
    stock: 5,
    featured: true,
    badge: "Best Seller",
  },
  {
    title: "Autumn Pumpkin Harvest Wreath",
    slug: "autumn-pumpkin-harvest",
    price: 70,
    description: "A charming autumn wreath adorned with realistic pumpkins and gourds. Perfect for the fall season.",
    image: "autumn-pumpkin-harvest-pro.png",
    style: "rustic" as const,
    colours: ["orange", "cream", "brown"],
    suitableFor: ["front door", "autumn", "thanksgiving"],
    stock: 2,
    featured: false,
    badge: null,
  },
  {
    title: "Autumn Rustic Wreath",
    slug: "autumn-rustic-wreath",
    price: 80,
    description: "An elegant autumn arrangement with rich burgundy and orange tones, featuring dried leaves and berries.",
    image: "autumn-rustic-pro.png",
    style: "classic" as const,
    colours: ["burgundy", "orange", "brown"],
    suitableFor: ["front door", "indoor", "autumn"],
    stock: 3,
    featured: false,
    badge: null,
  },
  {
    title: "Autumn Luxury Arrangement",
    slug: "autumn-luxury-arrangement",
    price: 95,
    description: "A premium autumn wreath with metallic accents and luxurious fall foliage. Makes a stunning statement piece.",
    image: "autumn-luxury-pro.png",
    style: "classic" as const,
    colours: ["gold", "bronze", "burgundy", "orange"],
    suitableFor: ["front door", "indoor", "autumn"],
    stock: 1,
    featured: false,
    badge: "Premium",
  },
  {
    title: "Autumn Witch Hat Decoration",
    slug: "autumn-witch-hat",
    price: 55,
    description: "A whimsical witch hat decoration perfect for Halloween. Features autumn florals and spooky charm.",
    image: "autumn-witch-hat-pro.png",
    style: "seasonal" as const,
    colours: ["black", "orange", "yellow"],
    suitableFor: ["front door", "halloween", "autumn"],
    stock: 4,
    featured: false,
    badge: null,
  },
  // Christmas
  {
    title: "Christmas Sage & Gold Wreath",
    slug: "christmas-sage-gold-wreath",
    price: 85,
    description: "An elegant Christmas wreath in sophisticated sage and gold tones. A modern twist on traditional holiday decor.",
    image: "christmas-sage-gold-pro.png",
    style: "seasonal" as const,
    colours: ["sage", "gold", "cream"],
    suitableFor: ["front door", "indoor", "christmas"],
    stock: 4,
    featured: true,
    badge: "New",
  },
  {
    title: "Christmas Traditional Wreath",
    slug: "christmas-traditional-wreath",
    price: 72,
    description: "A classic Christmas wreath with traditional red, green and gold colours. Timeless holiday elegance.",
    image: "christmas-traditional-pro.png",
    style: "seasonal" as const,
    colours: ["red", "green", "gold"],
    suitableFor: ["front door", "indoor", "christmas"],
    stock: 6,
    featured: false,
    badge: "Seasonal",
  },
  {
    title: "Christmas Swag Arrangement",
    slug: "christmas-swag",
    price: 55,
    description: "A beautiful Christmas swag perfect for doors, mantels or walls. Features festive greenery and decorations.",
    image: "christmas-swag-pro.png",
    style: "seasonal" as const,
    colours: ["green", "gold", "cream"],
    suitableFor: ["door", "mantel", "wall", "christmas"],
    stock: 8,
    featured: false,
    badge: null,
  },
  {
    title: "White Poinsettia Wreath",
    slug: "white-poinsettia-wreath",
    price: 68,
    description: "An elegant white poinsettia wreath with a delicate, wintery feel. Perfect for a refined Christmas display.",
    image: "christmas-white-poinsettia-pro.png",
    style: "classic" as const,
    colours: ["white", "green", "cream"],
    suitableFor: ["front door", "indoor", "christmas", "winter"],
    stock: 5,
    featured: false,
    badge: null,
  },
  // Halloween
  {
    title: "Halloween Skeleton Wreath",
    slug: "halloween-skeleton-wreath",
    price: 78,
    description: "A spooky skeleton-themed Halloween wreath that will delight trick-or-treaters. Features bones, roses and gothic elements.",
    image: "halloween-skeleton-pro.png",
    style: "seasonal" as const,
    colours: ["black", "white", "grey"],
    suitableFor: ["front door", "halloween"],
    stock: 3,
    featured: true,
    badge: "Limited",
  },
];

const categories = [
  { name: "Door Wreaths", slug: "door-wreaths", description: "Beautiful wreaths for your front door" },
  { name: "Seasonal", slug: "seasonal", description: "Wreaths for every season and holiday" },
  { name: "Memorial", slug: "memorial", description: "Thoughtful memorial arrangements" },
  { name: "Indoor", slug: "indoor", description: "Wreaths perfect for indoor display" },
];

async function uploadImage(imagePath: string): Promise<Id<"_storage">> {
  // Get upload URL from Convex
  const uploadUrl = await client.mutation(api.products.generateUploadUrl);

  // Read image file
  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = path.basename(imagePath);
  const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/webp';

  // Upload to Convex storage
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": mimeType },
    body: imageBuffer,
  });

  const { storageId } = await response.json();
  console.log(`Uploaded ${fileName} -> ${storageId}`);
  return storageId;
}

async function seed() {
  console.log("Starting seed process...\n");

  // 1. Create categories
  console.log("Creating categories...");
  const categoryIds: Record<string, Id<"categories">> = {};

  for (const category of categories) {
    const existingCategory = await client.query(api.categories.getBySlug, { slug: category.slug });
    if (existingCategory) {
      categoryIds[category.slug] = existingCategory._id;
      console.log(`Category "${category.name}" already exists`);
    } else {
      const id = await client.mutation(api.categories.create, category);
      categoryIds[category.slug] = id;
      console.log(`Created category: ${category.name}`);
    }
  }

  console.log("\nUploading images and creating products...");
  const imagesDir = path.join(__dirname, "../public/images/products");

  for (const product of productDefinitions) {
    // Check if product already exists
    const existing = await client.query(api.products.getBySlug, { slug: product.slug });
    if (existing) {
      console.log(`Product "${product.title}" already exists, skipping...`);
      continue;
    }

    // Upload image
    const imagePath = path.join(imagesDir, product.image);
    if (!fs.existsSync(imagePath)) {
      console.log(`Image not found: ${product.image}, skipping product...`);
      continue;
    }

    const storageId = await uploadImage(imagePath);

    // Determine category based on style
    let categorySlug = "door-wreaths";
    if (product.style === "seasonal") categorySlug = "seasonal";

    // Create product
    await client.mutation(api.products.create, {
      title: product.title,
      slug: product.slug,
      price: product.price,
      description: product.description,
      images: [storageId],
      size: "40-50cm diameter",
      colours: product.colours,
      style: product.style,
      suitableFor: product.suitableFor,
      stock: product.stock,
      categoryId: categoryIds[categorySlug],
      featured: product.featured,
      sizeCategory: "large",
      status: "active",
    });

    console.log(`Created product: ${product.title}`);
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);

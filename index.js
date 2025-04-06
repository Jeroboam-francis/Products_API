import express from "express";
import { PrismaClient } from "@prisma/client";
import validateProduct from "./middleware/validateProduct.js";

const client = new PrismaClient();
const app = express();

app.use(express.json());

// Create a Product
app.post("/products", validateProduct, async (req, res) => {
  const { productTitle, productDescription, unitsLeft, pricePerUnit } =
    req.body;

  try {
    const newProduct = await client.products.create({
      data: {
        productTitle,
        productDescription,
        unitsLeft,
        pricePerUnit,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Product Inserted successfully",
      data: newProduct,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while inserting the product",
    });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const allProducts = await client.products.findMany();
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: allProducts,
    });
  } catch (e) {}
  res.status(500).json({
    status: "error",
    message: "An error occurred while fetching the product",
  });
});

// Get a single product using id parameter
app.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await client.products.findFirst({
      where: { productId },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product fetched successfully",
      data: product,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Product failed to fetche",
    });
  }
});

app.put("/products/:id", (req, res) => {
  const id = req.params.id;
  const product = req.body;
  res.send(`Updating product with id ${id} to name ${product.name}`);
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Deleting product with id ${id}`);
});

let port = 3000;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 3000;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

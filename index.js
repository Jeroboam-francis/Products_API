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
    const getAllProducts = await client.products.findMany();
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: getAllProducts,
    });
  } catch (e) {}
  res.status(500).json({
    status: "error",
    message: "An error occurred while fetching the product",
  });
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;
  res.send(`Getting product with id ${id}`);
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

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

// Get all products created
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

// Updates product found  using id
app.patch("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const {
    productTitle,
    productDescription,
    unitsLeft,
    pricePerUnit,
    isOnOffer,
  } = req.body;
  try {
    const updatedProduct = await client.products.update({
      where: { productId },
      data: {
        productTitle: productTitle && productTitle,
        productDescription: productDescription && productDescription,
        unitsLeft: unitsLeft && unitsLeft,
        pricePerUnit: pricePerUnit && pricePerUnit,
        isOnOffer: isOnOffer && isOnOffer,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Product failed to update",
    });
  }
});
// Delete a product using id
app.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  await client.products.delete({
    where: { productId },
  });

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });

  try {
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "Product failed to delete",
    });
  }
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

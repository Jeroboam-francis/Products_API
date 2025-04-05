function validateProduct(req, res, next) {
  const { productTitle, productDescription, unitsLeft, pricePerUnit } =
    req.body;

  if (!productTitle || !productDescription || !unitsLeft || !pricePerUnit) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  next();
}
export default validateProduct;

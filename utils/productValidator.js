import { object, string, number, array } from "yup";

const productSchema = object({
  title: string()
    .required("Product title is required")
    .min(3, "Product title must be at least 3 characters"),
  description: string()
    .required("Product description is required")
    .min(10, "Product description must be at least 10 characters"),
  price: number()
    .required("Product price is required")
    .positive("Product price must be a positive number"),
  category: string().required("Product category is required"),
  stock: number()
    .required("Product stock is required")
    .integer("Product stock must be an integer"),
  // thumbnail: string().required("Product thumbnail is required"),
});

const validateProduct = async (req, res, next) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error validating product data", errors: error.errors });
  }
};

export default validateProduct;

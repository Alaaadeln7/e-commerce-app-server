import { object, string, number, array } from 'yup';

const productSchema = object({
  title: string().required('Product name is required').min(3, 'Product name must be at least 3 characters'),
  description: string().required('Product description is required').min(10, 'Product description must be at least 10 characters'),
  price: number().required('Product price is required').positive('Product price must be a positive number'),
  category: string().required('Product category is required'),
  stock: number().required('Product stock is required').integer('Product stock must be an integer'),
  discount: number().min(0, 'Discount must be greater than or equal to 0').max(100, 'Maximum discount is 100'),
  discountCode: string().optional(),
  thumbnail: string().required('Product thumbnail is required').url('Product thumbnail must be a valid URL'),
  images: array().of(string().url('Product image must be a valid URL')).max(5, 'You can upload up to 5 images')
});

const validateProduct = async (req, res, next) => {
  try {
    await productSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Error validating product data', errors: error.errors });
  }
};

export default validateProduct;

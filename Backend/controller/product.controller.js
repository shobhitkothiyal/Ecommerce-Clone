import productService from "../services/product.service.js";

const createProduct = async (req, res) => {
  try {
    let productData = { ...req.body };

    // Ensure numbers
    if (productData.price) productData.price = Number(productData.price);
    if (productData.discountedPrice)
      productData.discountedPrice = Number(productData.discountedPrice);

    // Parse JSON fields that might be stringified in FormData
    if (typeof productData.variants === "string") {
      try {
        productData.variants = JSON.parse(productData.variants);
      } catch (e) {
        console.error("Error parsing variants JSON", e);
        productData.variants = [];
      }
    }

// ✅ NORMALIZE VARIANTS COLORS (ADMIN-DRIVEN)
if (Array.isArray(productData.variants)) {
  productData.variants = productData.variants.map((variant) => {
    const isDual =
      Array.isArray(variant.colors) && variant.colors.length === 2;

    if (isDual) {
      return {
        ...variant,
        type: "dual",
        colors: variant.colors,
        hex: "", // IMPORTANT: clear solid color
      };
    }

    // SINGLE COLOR
    return {
      ...variant,
      type: "solid",
      hex: variant.hex || "#000000",
      colors: [], // IMPORTANT: clear dual colors
    };
  });
}



    if (typeof productData.size === "string") {
      try {
        productData.sizes = JSON.parse(productData.size);
      } catch (e) {
        productData.sizes = [];
      }
    }
    // Also support 'sizes' key if sent directly
    if (typeof productData.sizes === "string") {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {
        productData.sizes = [];
      }
    }

    // Parse 'details' JSON
    if (typeof productData.details === "string") {
      try {
        productData.details = JSON.parse(productData.details);
      } catch (e) {
        console.error("Error parsing details JSON", e);
        productData.details = {};
      }
    }

    // Handle Files
    if (req.files && req.files.length > 0) {
      // 1. Main Product Images
      const mainImages = req.files.filter(
        (f) => f.fieldname === "images" || f.fieldname === "image",
      );
      if (mainImages.length > 0) {
        productData.images = mainImages.map((f) => f.path);
      } else if (!productData.images) {
        productData.images = [];
      }

      // 2. Variant Images (assuming fieldname format: variantImages_INDEX)
      if (productData.variants && Array.isArray(productData.variants)) {
        productData.variants = productData.variants.map((variant, index) => {
          const variantFiles = req.files.filter(
            (f) => f.fieldname === `variantImages_${index}`,
          );
          const variantImageUrls = variantFiles.map((f) => f.path);

          // Merge with existing logic if any (e.g. if we allow URLs + Files)
          return {
            ...variant,
            images:
              variantImageUrls.length > 0
                ? variantImageUrls
                : variant.images || [],
          };
        });
      }
    }

    const product = await productService.createProduct(productData);
    return res.status(201).send(product);
  } catch (error) {
    console.error(
      "Create product failed",
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    );
    return res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.deleteProduct(productId);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    let productData = { ...req.body };

    // Ensure numbers
    if (productData.price) productData.price = Number(productData.price);
    if (productData.discountedPrice)
      productData.discountedPrice = Number(productData.discountedPrice);

    // Parse JSON fields
    if (typeof productData.variants === "string") {
      try {
        productData.variants = JSON.parse(productData.variants);
      } catch (e) {
        // If parsing fails, use as is or ignore
      }
    }
    if (typeof productData.size === "string") {
      try {
        productData.sizes = JSON.parse(productData.size);
      } catch (e) {}
    } else if (productData.size) {
      productData.sizes = productData.size;
    }

    if (typeof productData.sizes === "string") {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch (e) {}
    }

    if (typeof productData.details === "string") {
      try {
        productData.details = JSON.parse(productData.details);
      } catch (e) {}
    }

    // Handle Files
    if (req.files && req.files.length > 0) {
      // 1. Main Images
      const mainImages = req.files.filter(
        (f) => f.fieldname === "images" || f.fieldname === "image",
      );
      if (mainImages.length > 0) {
        const newUrls = mainImages.map((f) => f.path);
        // If updating, you might want to append or replace. For now, let's assume we append to existing if existingImageUrls is passed?
        // Actually typically update replaces or we need a logic.
        // Simplest for now: if files provided, USE THEM.
        // Better: Check if `existingImageUrls` string/array exists in body

        let existingUrlList = [];
        if (productData.existingImageUrls) {
          try {
            existingUrlList = JSON.parse(productData.existingImageUrls);
          } catch (e) {
            existingUrlList = [];
          }
        }
        productData.images = [...existingUrlList, ...newUrls];
      }

      // 2. Variant Images
      if (productData.variants && Array.isArray(productData.variants)) {
        productData.variants = productData.variants.map((variant, index) => {
          const variantFiles = req.files.filter(
            (f) => f.fieldname === `variantImages_${index}`,
          );
          const variantImageUrls = variantFiles.map((f) => f.path);

          // Handle existing variant images?
          // If admin form sends full variant object, assume it has current images in `images` array (urls).
          // We merge new file uploads into that array.
          return {
            ...variant,
            images: [...(variant.images || []), ...variantImageUrls],
          };
        });
      }
    } else {
      // handle case where only text fields update but we preserve existing images
      if (productData.existingImageUrls) {
        try {
          productData.images = JSON.parse(productData.existingImageUrls);
        } catch (e) {}
      }
    }

    const product = await productService.updateProduct(productId, productData);
    return res.status(201).send(product);
  } catch (error) {
    console.error(
      "Update error",
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    );
    return res.status(500).send({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.findProductById(productId);
    return res.status(201).send(product);
  } catch (error) {
    if (error.message === "Product not found") {
      return res.status(404).send({ error: error.message });
    }
    return res.status(500).send({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    return res.status(201).send(products);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const createMultipleProducts = async (req, res) => {
  const products = req.body;
  try {
    const createdProducts = [];
    for (const product of products) {
      createdProducts.push(await productService.createProduct(product));
    }
    return res.status(201).send({ message: "Products Created Successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export default {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  createMultipleProducts,
  findProductById,
};
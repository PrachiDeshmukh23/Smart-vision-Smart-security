const db = require('../config/db');
const { makeSlug } = require('../utils/slugify');

async function getAllProducts(req, res, next) {
  try {
    const { category, brand, featured, is_new, search, sort, page = 1, limit = 12 } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.status = 'active'
    `;
    const params = [];

    if (category) {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }
    if (brand) {
      query += ` AND (b.slug = ? OR b.id = ?)`;
      params.push(brand, brand);
    }
    if (featured === 'true' || featured === '1') {
      query += ` AND p.featured = 1`;
    }
    if (is_new === 'true' || is_new === '1') {
      query += ` AND p.is_new = 1`;
    }
    if (search) {
      query += ` AND (p.name LIKE ? OR p.model_number LIKE ? OR p.short_description LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (sort === 'price_asc') {
      query += ` ORDER BY p.price ASC, p.id DESC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY p.price DESC, p.id DESC`;
    } else if (sort === 'name_asc') {
      query += ` ORDER BY p.name ASC`;
    } else {
      query += ` ORDER BY p.featured DESC, p.id DESC`;
    }

    const [allRows] = await db.query(query, params);
    const total = allRows.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const offset = (pageNum - 1) * limitNum;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const [products] = await db.query(query, params);

    for (let p of products) {
      const [specs] = await db.query(
        'SELECT id, specification_name, specification_value FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC',
        [p.id]
      );
      p.specifications = specs;
      const [imgs] = await db.query(
        'SELECT id, image FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
        [p.id]
      );
      p.images = imgs;
    }

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products
    });
  } catch (err) {
    next(err);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name, b.logo as brand_logo
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       WHERE p.slug = ? OR p.id = ?`,
      [slug, slug]
    );

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[0];

    const [images] = await db.query(
      'SELECT id, image, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
      [product.id]
    );
    product.images = images;

    const [specs] = await db.query(
      'SELECT id, specification_name, specification_value, sort_order FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC',
      [product.id]
    );
    product.specifications = specs;

    const [related] = await db.query(
      `SELECT p.id, p.name, p.slug, p.model_number, p.short_description, p.main_image, p.price, p.show_price, p.featured, p.is_new, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
       ORDER BY p.featured DESC, p.id DESC LIMIT 4`,
      [product.category_id, product.id]
    );
    product.related_products = related;

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

async function adminListProducts(req, res, next) {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, b.name as brand_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN brands b ON p.brand_id = b.id
       ORDER BY p.id DESC`
    );
    for (let p of products) {
      const [specs] = await db.query(
        'SELECT id, specification_name, specification_value FROM product_specifications WHERE product_id = ? ORDER BY sort_order ASC',
        [p.id]
      );
      p.specifications = specs;
      const [imgs] = await db.query(
        'SELECT id, image FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
        [p.id]
      );
      p.images = imgs;
    }
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const {
      category_id, brand_id, name, slug, model_number, short_description,
      description, price, show_price, featured, is_new, stock_status,
      brochure, seo_title, seo_description, status, specifications
    } = req.body;

    if (!name || !category_id || !model_number) {
      return res.status(400).json({ success: false, message: 'Name, category and model number required' });
    }

    const genSlug = slug ? makeSlug(slug) : makeSlug(`${name}-${model_number}`);
    let mainImage = req.body.main_image || '/assets/products/placeholder.jpg';
    if (req.files && req.files['main_image'] && req.files['main_image'][0]) {
      mainImage = `/uploads/products/${req.files['main_image'][0].filename}`;
    }

    let brochurePath = brochure || null;
    if (req.files && req.files['brochure'] && req.files['brochure'][0]) {
      brochurePath = `/uploads/downloads/${req.files['brochure'][0].filename}`;
    }

    const [result] = await db.query(
      `INSERT INTO products (
        category_id, brand_id, name, slug, model_number, short_description,
        description, main_image, price, show_price, featured, is_new,
        stock_status, brochure, seo_title, seo_description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id, brand_id || null, name, genSlug, model_number, short_description || null,
        description || null, mainImage, price ? parseFloat(price) : null,
        show_price ? 1 : 0, featured ? 1 : 0, is_new ? 1 : 0,
        stock_status || 'in_stock', brochurePath, seo_title || name, seo_description || short_description,
        status || 'active'
      ]
    );

    const productId = result.insertId;

    if (specifications) {
      const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      if (Array.isArray(parsedSpecs)) {
        for (let i = 0; i < parsedSpecs.length; i++) {
          const spec = parsedSpecs[i];
          if ((spec.name || spec.specification_name) && (spec.value || spec.specification_value)) {
            await db.query(
              'INSERT INTO product_specifications (product_id, specification_name, specification_value, sort_order) VALUES (?, ?, ?, ?)',
              [productId, spec.name || spec.specification_name, spec.value || spec.specification_value, i + 1]
            );
          }
        }
      }
    }

    if (req.files && req.files['gallery_images']) {
      for (let i = 0; i < req.files['gallery_images'].length; i++) {
        const file = req.files['gallery_images'][i];
        await db.query(
          'INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)',
          [productId, `/uploads/products/${file.filename}`, i + 1]
        );
      }
    }

    res.status(201).json({ success: true, message: 'Product created successfully', id: productId, slug: genSlug });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      category_id, brand_id, name, slug, model_number, short_description,
      description, price, show_price, featured, is_new, stock_status,
      brochure, seo_title, seo_description, status, specifications
    } = req.body;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let mainImage = req.body.main_image || existing[0].main_image;
    if (req.files && req.files['main_image'] && req.files['main_image'][0]) {
      mainImage = `/uploads/products/${req.files['main_image'][0].filename}`;
    }

    let brochurePath = brochure !== undefined ? brochure : existing[0].brochure;
    if (req.files && req.files['brochure'] && req.files['brochure'][0]) {
      brochurePath = `/uploads/downloads/${req.files['brochure'][0].filename}`;
    }

    const finalSlug = slug ? makeSlug(slug) : (name ? makeSlug(`${name}-${model_number || existing[0].model_number}`) : existing[0].slug);

    await db.query(
      `UPDATE products SET
        category_id = COALESCE(?, category_id),
        brand_id = ?,
        name = COALESCE(?, name),
        slug = ?,
        model_number = COALESCE(?, model_number),
        short_description = ?,
        description = ?,
        main_image = ?,
        price = ?,
        show_price = ?,
        featured = ?,
        is_new = ?,
        stock_status = ?,
        brochure = ?,
        seo_title = ?,
        seo_description = ?,
        status = ?
      WHERE id = ?`,
      [
        category_id || null, brand_id || null, name || null, finalSlug, model_number || null,
        short_description || null, description || null, mainImage,
        price ? parseFloat(price) : null, show_price ? 1 : 0,
        featured ? 1 : 0, is_new ? 1 : 0, stock_status || 'in_stock',
        brochurePath, seo_title || name, seo_description || short_description,
        status || 'active', id
      ]
    );

    if (specifications !== undefined) {
      await db.query('DELETE FROM product_specifications WHERE product_id = ?', [id]);
      const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      if (Array.isArray(parsedSpecs)) {
        for (let i = 0; i < parsedSpecs.length; i++) {
          const spec = parsedSpecs[i];
          if ((spec.name || spec.specification_name) && (spec.value || spec.specification_value)) {
            await db.query(
              'INSERT INTO product_specifications (product_id, specification_name, specification_value, sort_order) VALUES (?, ?, ?, ?)',
              [id, spec.name || spec.specification_name, spec.value || spec.specification_value, i + 1]
            );
          }
        }
      }
    }

    if (req.files && req.files['gallery_images']) {
      for (let i = 0; i < req.files['gallery_images'].length; i++) {
        const file = req.files['gallery_images'][i];
        await db.query(
          'INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)',
          [id, `/uploads/products/${file.filename}`, i + 1]
        );
      }
    }

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductBySlug,
  adminListProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

-- Catalog refactor: fleurs, resines, vapes, accessoires (no huiles/cosmetiques/infusions)

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

ALTER TABLE products ADD CONSTRAINT products_category_check
  CHECK (category IN ('fleurs', 'resines', 'vapes', 'accessoires'));

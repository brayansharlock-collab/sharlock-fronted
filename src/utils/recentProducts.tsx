export const saveRecentProduct = (product: any) => {
  if (!product) return;

  const newItem = {
    id: product.id,
    name: product.name,
    image: product.image_cover,
    category: product.subcategory?.category_detail?.id || "",
    subcategory: product.subcategory?.id || "",
    date: new Date().toISOString(),
  };

  const key = "recentProducts";
  const stored = JSON.parse(localStorage.getItem(key) || "[]");

  const filtered = stored.filter((item: any) => item.id !== newItem.id);

  const updated = [newItem, ...filtered].slice(0, 10);

  localStorage.setItem(key, JSON.stringify(updated));
};

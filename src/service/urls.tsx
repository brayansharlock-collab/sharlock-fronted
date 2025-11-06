export const API_URL_ALL = {
    BASE_URL: import.meta.env.VITE_REACT_APP_API_URL,
    USERS: `api/accounts/user/`,
    AUTH: `api/accounts/api-token-auth/`,
    REFRESH: `api/accounts/api-token-refresh/`,
    ADRESS: `api/accounts/addresses/`,

    ORDERS: `api/orders/`,

    // Direcciones
    DEPARMENT: "/api/accounts/department/",
    APARMENT_TYPE: "/api/accounts/apartament-type/",

    // Productos y categorías
    PRODUCTS: "/api/products/productos/",
    PRODUCTS_CREATE: "/api/products/create/",
    CATEGORIES: "/api/products/categorias/",
    SUBCATEGORIES: "/api/products/sub-categorias/",
    FILTER_NAMES: "/api/products/nombre-filtros/",
    FILTER_OPTIONS: "/api/products/opciones-filtros/",
    FAVORITES: "/api/products/favorites/",
    COMMENTS: "/api/products/comments/",
    PRODUCTS_DISCOUNT: "/api/products/get-products-discount/",

    // Carrito de compras
    CART: "/api/products/shopping-cart/",
    COUNT_CAR: "/api/products/get-count-shopping-cart/",
    CART_CLEAR: "api/products/delete-shopping-cart/",
    COUPON: "api/products/coupon/",
    RECIPIENT: "api/products/receipt/",
    GUIE: "api/products/get-distributor/",

    PUBLICY: "api/accounts/video-banner/",

    BANNER: "api/accounts/banner/",
    GOOGLE: "api/accounts/api-token-auth-google/",
}
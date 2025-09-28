export const API_URL_ALL = {
    BASE_URL: import.meta.env.VITE_REACT_APP_API_URL,
    USERS: `api/accounts/user/`,
    AUTH: `api/accounts/api-token-auth/`,
    REFRESH: `es/api/v1/api-token-refresh/`,
    ADRESS: `api/accounts/addresses/`,

    ORDERS: `api/orders/`,
 
    // Direcciones
    DEPARMENT: "/api/accounts/department/",
    APARMENT_TYPE: "/api/accounts/apartament-type/",

    // Productos y categorías
    PRODUCTS: "/api/products/productos/",
    CATEGORIES: "/api/products/categorias/",
    SUBCATEGORIES: "/api/products/sub-categorias/",
    FILTER_NAMES: "/api/products/nombre-filtros/",
    FILTER_OPTIONS: "/api/products/opciones-filtros/",
    FAVORITES: "/api/products/favorites/",

    // Carrito de compras
    CART: "/api/products/shopping-cart/",
    CART_CLEAR: "api/products/delete-shopping-cart/",
    COUPON: "api/products/coupon/",

    BANNER: "api/accounts/banner/",
}
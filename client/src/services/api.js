import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getSettings = async () => {
    const response = await api.get('/settings');
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const addCategory = async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

export const addProduct = async (data) => {
    const response = await api.post('/products', data);
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export const getEvents = async () => {
    // Keep events as placeholder for now or move to DB later
    return [
        {
            id: 1,
            title: "Live Jazz Night",
            date: "2023-11-20",
            description: "Enjoy smooth jazz with your coffee.",
            image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&q=80"
        }
    ];
};

export const getReviews = async () => {
    return [
        {
            id: 1,
            user: "Malaga En la mesa",
            rating: 5,
            comment: "Hoy visitamos esta increíble cafetería para probar sus novedades para Halloween. Donde probamos sus famosos cookie cup clásico y su nueva versión para esta campaña. También una galleta de gran tamaño relleno de kineder morado y una nube con forma de fantasma que estaba brutal.",
            date: "Reciente"
        },
        {
            id: 2,
            user: "Sergio Blanes",
            rating: 5,
            comment: "Fuimos a probarlo porque lo vimos en Instagram, y superó todas nuestras espectativas! El café esta delicioso, y la taza-galleta también esta riquísima! Estaba lleno, buena señal. Tienes un salón en la planta de arriba.",
            date: "Hace poco"
        },
        {
            id: 3,
            user: "Nahir Alonso",
            rating: 5,
            comment: "Hemos venido desde Madrid directo a Málaga por esta cafetería. Todo super rico, destacar la tarta de queso de frutos rojos y alfajor de maicena el mejor que hemos probado aquí en España de momento. La atención de las chicas super bien y atentas.",
            date: "Hace 1 semana"
        },
        {
            id: 4,
            user: "Elena González",
            rating: 5,
            comment: "Estaba todo muy rico, el servicio súper agradable y la presentación monísima!!! Mis amigas y yo probamos varias cositas: iced latte, chocolate con osito, croffle de chocolate blanco con kitkat. TODO recomendadísimo!",
            date: "Reciente"
        },
        {
            id: 5,
            user: "ALEX LAND",
            rating: 5,
            comment: "Excelente cafetería. El cafe esta muy bueno y además tienen tazas hechas de galletas y chocolate en la cual te sirven el cafe. El personal y muy amable y las tartas están riquísimas. Tienen unas galletas caseras de otra galaxia!!!",
            date: "Hace 3 semanas"
        },
        {
            id: 6,
            user: "Maria Arroyo",
            rating: 5,
            comment: "Es perfecto, para un buen desayuno o merienda La comida riquísima, muchísima variedad y todo artesanal La chica es un amor, es muy cercana y hace un servicio increíble Fuimos dos días seguidos y hubiéramos ido más!",
            date: "Reciente"
        }
    ];
};

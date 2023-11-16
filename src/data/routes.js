import Create from "../components/Profile/Categories/Create";
import AllArticles from "../pages/Articles/AllArticles";
import CreateArticle from "../pages/Articles/CreateArticle";
import SingleArticle from "../pages/Articles/SingleArticle";
import UpdateArticle from "../pages/Articles/UpdateArticle";
import Community from "../pages/Community";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Categories from "../pages/Profile/Categories";
import Followers from "../pages/Profile/Followers";
import Index from "../pages/Profile/Index";
import LikedPosts from "../pages/Profile/LikedPosts";
import MyPosts from "../pages/Profile/MyPosts";
import PUC from "../pages/Profile/PUC";
import Tags from "../pages/Profile/Tags";
import Register from "../pages/Register";


const routes = [
    {
        id: 1, 
        path: '/',
        element: Home,
        isProtected: false
    },
    
    {
        id: 2, 
        path: '/our_mission',
        element: Community,
        isProtected: false
    },
    {
        id: 3, 
        path: '/register',
        element: Register,
        isProtected: false
    },
    {
        id: 4, 
        path: '/login',
        element: Login,
        isProtected: false
    },
    {
        id: 5, 
        path: '/profile',
        element: Index,
        isProtected: true
    },
    
    {
        id: 5, 
        path: '/profile/followers',
        element: Followers,
        isProtected: true
    },
    
    {
        id: 6, 
        path: '/profile/my-posts',
        element: MyPosts,
        isProtected: true
    },
    
    {
        id: 7, 
        path: '/profile/liked-posts',
        element: LikedPosts,
        isProtected: true
    },
    {
        id: 8, 
        path: '/articles/:articleId',
        element: SingleArticle,
        isProtected: false
    },
    
    {
        id: 9, 
        path: '/articles/create',
        element: CreateArticle,
        isProtected: true
    },
    
    {
        id: 10, 
        path: '/articles/:articleId/update',
        element: UpdateArticle,
        isProtected: true
    },
    {
        id: 11, 
        path: '/categories',
        element: Categories,
        isProtected: true
    },
    {
        id: 12, 
        path: '/tags',
        element: Tags,
        isProtected: true
    },
    {
        id: 13, 
        path: '/articles',
        element: AllArticles,
        isProtected: true
    },
    {
        id: 14, 
        path: '/public/user/:userId',
        element: PUC,
        isProtected: true
    },
];

export default routes;
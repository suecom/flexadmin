import Users from './components/Users';
import Listings from './components/Listings';
import Transactions from './components/Transactions';
import Reviews from './components/Reviews';
import Messages from './components/Messages';
import Images from './components/Images';

const routes = [
    {
        path: "/users",
        exact: true,
        label: 'Users',
        icon: 'far fa-user nav-icon',
        component: Users
    },
    {
        path: "/listings",
        exact: true,
        label: 'Listings',
        icon: 'fas fa-car nav-icon',
        component: Listings
    },
    {
        path: "/transactions",
        exact: true,
        label: 'Transactions',
        icon: 'fas fa-pound-sign nav-icon',
        component: Transactions
    },
    {
        path: "/reviews",
        exact: true,
        label: 'Reviews',
        icon: 'fas fa-star nav-icon',
        component: Reviews
    },
    {
        path: "/messages",
        exact: true,
        label: 'Messages',
        icon: 'fas fa-comments nav-icon',
        component: Messages
    },
    {
        path: "/images",
        exact: true,
        label: 'Images',
        icon: 'far fa-image nav-icon',
        component: Images
    }
];

export default routes;
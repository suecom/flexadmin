import Users from './components/Users';
import Listings from './components/Listings';

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
      label: 'Listings',
      icon: 'fas fa-car nav-icon',
      component: Listings
    },
    {
      path: "/transactions",
      label: 'Transactions',
      icon: 'fas fa-pound-sign nav-icon',
      component: Users
    },
    {
        path: "/reviews",
        label: 'Reviews',
        icon: 'fas fa-star nav-icon',
        component: Users
    },
    {
        path: "/messages",
        label: 'Messages',
        icon: 'fas fa-comments nav-icon',
        component: Users
    },
    {
        path: "/images",
        label: 'Images',
        icon: 'far fa-image nav-icon',
        component: Users
    }
];

export default routes;
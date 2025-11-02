import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Home } from './app/pages/home/home';
import { Configuracion } from './app/pages/configuracion/configuracion';
import { Equivalencias } from './app/pages/equivalencias/equivalencias';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/overeni/prihlasit', pathMatch: 'full' },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'domu', component: Home },
            { path: 'nastaveni', component: Configuracion },
            { path: 'ekvivalence', component: Equivalencias }
        ]
    },
    { path: 'overeni', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/overeni/prihlasit' }
];

import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';

export default [
    { path: 'pristup', component: Access },
    { path: 'chyba', component: Error },
    { path: 'prihlasit', component: Login }
] as Routes;

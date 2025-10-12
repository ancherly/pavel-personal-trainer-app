import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Principal',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Gestión',
                items: [
                    { label: 'Formularios', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Datos', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'Reportes', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'CRUD', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] }
                ]
            },
            {
                label: 'Herramientas',
                items: [
                    { label: 'Componentes', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Botones', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'] },
                    { label: 'Mensajes', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'Archivos', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] }
                ]
            },
            {
                label: 'Configuración',
                items: [
                    {
                        label: 'Autenticación',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Iniciar Sesión',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Acceso Denegado',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Páginas',
                        icon: 'pi pi-fw pi-clone',
                        items: [
                            {
                                label: 'Página de Inicio',
                                icon: 'pi pi-fw pi-globe',
                                routerLink: ['/landing']
                            },
                            {
                                label: 'No Encontrado',
                                icon: 'pi pi-fw pi-exclamation-circle',
                                routerLink: ['/pages/notfound']
                            },
                            {
                                label: 'Vacía',
                                icon: 'pi pi-fw pi-circle-off',
                                routerLink: ['/pages/empty']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Recursos',
                items: [
                    {
                        label: 'Documentación',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
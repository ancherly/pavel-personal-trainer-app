import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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

    constructor(private router: Router) {}

    ngOnInit() {
        // Keep menu minimal: a Features section (links to key pages) and
        // a Configuración section with quick access to user/food management.
        this.model = [
            {
                label: 'Funkce',
                items: [
                    { label: 'Domů', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                    { label: 'Ekvivalence', icon: 'pi pi-fw pi-table', routerLink: ['/equivalencias'] }
                ]
            },
            {
                label: 'Konfigurace',
                items: [
                    {
                        label: 'Správa uživatelů',
                        icon: 'pi pi-fw pi-users',
                        command: () => this.router.navigate(['/configuracion'], { queryParams: { tab: 'usuarios' } })
                    },
                    {
                        label: 'Správa potravin',
                        icon: 'pi pi-fw pi-shopping-cart',
                        command: () => this.router.navigate(['/configuracion'], { queryParams: { tab: 'alimentos' } })
                    }
                ]
            }
        ];
    }
}

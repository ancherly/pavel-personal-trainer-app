import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>

        <!-- Footer fijado abajo del todo del sidebar -->
        <div class="sidebar-footer" style="position: absolute; bottom: 1rem; left: 0; right: 0; display:flex; justify-content:center; padding: 0 1rem;">
            <button type="button" class="logout-button p-button p-component" (click)="logout()" aria-label="Odhlásit se" style="display:flex; align-items:center; gap:0.5rem; width:100%; max-width:280px;">
                <span class="p-button-icon pi pi-sign-out" aria-hidden="true"></span>
                <span class="p-button-label">Odhlásit se</span>
            </button>
        </div>
    </div>`,
    styles: [
        `
            ::ng-deep .p-button:not(:disabled):hover {
                background: transparent !important;
                color: var(--brand-primary) !important;
                border: 1px solid var(--brand-primary) !important;
            }
        `
    ]
})
export class AppSidebar {
    constructor(
        public el: ElementRef,
        private router: Router
    ) {}

    logout() {
        // Clear any auth-related storage (adjust keys to your app) and navigate to login
        try {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
        } catch (e) {
            // ignore
        }
        this.router.navigate(['/auth/login']);
    }
}

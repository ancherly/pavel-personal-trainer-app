import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule],
    template: ` <div class="layout-topbar">
        <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <a class="layout-topbar-logo-centered" routerLink="/">
            <img src="logo/Logo-Pavel-Personal-Trainer-266x300.png" alt="Logo Pavel Personal Trainer" style="height: 40px; width: auto;" />
        </a>
    </div>`,
    styles: [
        `
            .layout-topbar {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                padding: 0 1rem;
            }

            .layout-menu-button {
                position: absolute;
                left: 1rem;
                z-index: 1;
            }

            .layout-topbar-logo-centered {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--primary-color);
                transition: all 0.3s ease;
            }

            .layout-topbar-logo-centered:hover {
                transform: scale(1.05);
            }

            .layout-topbar-logo-centered span {
                background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            @media screen and (max-width: 768px) {
                .layout-topbar-logo-centered {
                    font-size: 1.1rem;
                    gap: 0.5rem;
                }

                .layout-topbar-logo-centered img {
                    height: 35px !important;
                }
            }

            @media screen and (max-width: 480px) {
                .layout-topbar-logo-centered {
                    font-size: 1rem;
                }

                .layout-topbar-logo-centered img {
                    height: 30px !important;
                }
            }
        `
    ]
})
export class AppTopbar {
    constructor(public layoutService: LayoutService) {}
}

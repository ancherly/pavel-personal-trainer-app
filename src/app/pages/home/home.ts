import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CardModule, ButtonModule, RouterModule, RippleModule],
    template: `
        <div class="home-container">
            <div class="home-wrapper">
                <div class="cards-container">
                    <div class="card-wrapper">
                        <p-card class="menu-card config-card" routerLink="/configuracion">
                            <ng-template pTemplate="header">
                                <div class="card-icon-container">
                                    <!-- Icono personalizado para configuración -->
                                    <img src="logo/config.webp" alt="Configuración" class="card-icon-img" />
                                </div>
                            </ng-template>
                            <ng-template pTemplate="content">
                                <div class="card-content">
                                    <h3 class="card-title">Configuración</h3>
                                    <p class="card-description">Gestione los usuarios y las raciones pertinentes para usarlas en la aplicación</p>
                                </div>
                            </ng-template>
                        </p-card>
                    </div>

                    <div class="card-wrapper">
                        <p-card class="equivalencias-card" routerLink="/equivalencias">
                            <ng-template pTemplate="header">
                                <div class="card-icon-container">
                                    <!-- Usamos el asset movido a public/logo/ -->
                                    <img src="logo/balance.webp" alt="Equivalencias" class="card-icon-img" />
                                </div>
                            </ng-template>
                            <ng-template pTemplate="content">
                                <div class="card-content">
                                    <h3 class="card-title">Equivalencias</h3>
                                    <p class="card-description">Consulta y gestiona las equivalencias nutricionales y medidas de alimentos.</p>
                                </div>
                            </ng-template>
                        </p-card>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .home-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: calc(100vh - 120px);
                overflow: hidden;
                font-family: var(--font-family-primary);
                padding: 2rem;
                box-sizing: border-box;
                position: relative;
            }

            .home-container::before {
                display: none; /* Ya no necesitamos el overlay local */
            }

            .home-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
                width: 100%;
                max-width: 1200px;
            }

            .cards-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 2rem;
                width: 100%;
                max-width: 800px;

                @media (max-width: 768px) {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
            }

            .card-wrapper {
                display: flex;
                justify-content: center;
            }

            /* Estilos base para ambas cards con la misma estructura */
            ::ng-deep .config-card,
            ::ng-deep .equivalencias-card {
                width: 100% !important;
                max-width: 360px !important;
                border: 1px solid rgba(28, 169, 244, 0.3);
                cursor: pointer !important;
                border-radius: 20px !important;
                overflow: hidden !important;
                box-shadow:
                    0 8px 32px rgba(0, 180, 216, 0.12),
                    0 2px 8px rgba(0, 0, 0, 0.04),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
                background: rgb(0 0 0 / 53%) !important;
                backdrop-filter: blur(16px) saturate(180%) !important;
                transition:
                    transform 500ms ease-in-out,
                    box-shadow 500ms ease-in-out,
                    border-color 500ms ease-in-out,
                    background 500ms ease-in-out !important;
                transform: scale(1) translateY(0) !important;
            }

            ::ng-deep .config-card:hover,
            ::ng-deep .equivalencias-card:hover {
                /* MISMOS EFECTOS HOVER */
                transition:
                    transform 500ms ease-in-out,
                    box-shadow 500ms ease-in-out,
                    border-color 500ms ease-in-out,
                    background 500ms ease-in-out !important;
                transform: scale(1.05) translateY(-5px) !important;
                box-shadow: 0 20px 40px rgba(0, 180, 216, 0.25) !important;
                border-color: var(--brand-primary) !important;
                background: linear-gradient(180deg, #0f172a00 0%, #0f172ad6) !important;
                backdrop-filter: blur(20px) !important;
            }

            /* Si usamos iconos de fuente, que también pasen a color oscuro */
            ::ng-deep .config-card:hover .card-icon,
            ::ng-deep .equivalencias-card:hover .card-icon {
                color: #0b0b0b !important;
            }

            /* Eliminar cualquier transición de elementos hijos que pueda interferir */
            ::ng-deep .config-card *,
            ::ng-deep .equivalencias-card * {
                transition: none !important;
            }

            /* Aplicar solo la transición padre */
            ::ng-deep .config-card .p-card,
            ::ng-deep .equivalencias-card .p-card {
                width: 100% !important;
                height: 100% !important;
                transition: none !important;
                transform: none !important;
            }

            ::ng-deep .p-card-body {
                padding: 0 !important;
            }

            ::ng-deep .config-card .p-card-header,
            ::ng-deep .equivalencias-card .p-card-header {
                background: linear-gradient(0deg, #92ebff00 0%, #00b4d84d 100%) !important;
                // padding: 2rem !important;
                // border-radius: 20px 20px 0 0 !important;
            }

            ::ng-deep .config-card .p-card-content,
            ::ng-deep .equivalencias-card .p-card-content {
                padding: 1rem !important;
            }

            @media (max-width: 576px) {
                ::ng-deep .config-card .p-card-header,
                ::ng-deep .equivalencias-card .p-card-header {
                    padding: 1rem !important;
                    padding-bottom: 0 !important;
                }

                ::ng-deep .config-card .p-card-content,
                ::ng-deep .equivalencias-card .p-card-content {
                    padding: 1.5rem !important;
                }
            }

            .card-icon-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .card-icon {
                font-size: 3rem;
                color: white;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

                @media (max-width: 576px) {
                    font-size: 2.5rem;
                }
            }

            /* Imagen personalizada para iconos (WebP/PNG) */
            .card-icon-img {
                width: 10rem;
                height: 10rem;
                object-fit: contain;
                display: block;
                filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12));
            }

            @media (max-width: 576px) {
                .card-icon-img {
                    width: 6.5rem;
                    height: 6.5rem;
                }
            }

            .card-content {
                text-align: center;
            }

            .card-title {
                color: #ffffff;
                font-size: 1.5rem;
                font-weight: 700;
                font-family: var(--font-family-secondary);
                margin-bottom: 1rem;
                line-height: 1.3;

                @media (max-width: 576px) {
                    font-size: 1.25rem;
                }
            }

            .card-description {
                color: #ffffff;
                font-size: 1rem;
                line-height: 1.6;
                margin: 0;

                @media (max-width: 576px) {
                    font-size: 0.9rem;
                }
            }

            /* Animaciones adicionales */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .card-wrapper:nth-child(1) .config-card {
                animation: fadeInUp 0.6s ease-out;
            }

            .card-wrapper:nth-child(2) .equivalencias-card {
                animation: fadeInUp 0.6s ease-out;
            }
        `
    ]
})
export class Home {}

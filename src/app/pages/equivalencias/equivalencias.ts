import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputNumberModule } from 'primeng/inputnumber';
import { LucideAngularModule, Carrot, Ham, Nut, ArrowRightLeft, Pointer } from 'lucide-angular';

// Interfaces
interface Alimento {
    id: string;
    nombre: string;
    hidratos: number; // por 100g
    proteinas: number; // por 100g
    grasas: number; // por 100g
}

interface AlimentoEquivalente {
    alimento: Alimento;
    pesoEquivalente?: number; // Opcional, se calcula al seleccionar
}

@Component({
    selector: 'app-equivalencias',
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, InputIconModule, IconFieldModule, InputNumberModule, LucideAngularModule],
    template: `
        <div class="equivalencias-container">
            <div class="layout-grid">
                <!-- Paso 1: Seleccionar Alimento y Ajustar Cantidad -->
                <p-card class="paso-card">
                    <ng-template pTemplate="content">
                        <!-- Buscador -->
                        <div class="search-toolbar">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <lucide-icon [img]="PointerIcon" [size]="24" class="search-icon-pointer"></lucide-icon>
                                <p-iconField iconPosition="left" class="search-field">
                                    <p-inputIcon>
                                        <i class="pi pi-search"></i>
                                    </p-inputIcon>
                                    <input pInputText type="text" [(ngModel)]="searchTerm" (input)="filtrarAlimentos()" placeholder="Vyhledat potravinu..." class="search-input" />
                                </p-iconField>
                            </div>
                        </div>

                        <!-- Tabla de Alimentos -->
                        <div class="tabla-wrapper">
                            <div class="tabla">
                                <!-- Body de la tabla -->
                                <div class="tabla-body">
                                    @for (alimento of alimentosFiltrados(); track alimento.id) {
                                        <div class="tabla-row" [class.selected]="alimentoSeleccionado?.id === alimento.id" (click)="seleccionarAlimento(alimento)">
                                            <i class="pi pi-check-circle check-icon" *ngIf="alimentoSeleccionado?.id === alimento.id"></i>
                                            <span class="alimento-nombre">{{ alimento.nombre }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Panel de Control de Peso (fuera del wrapper) -->
                        <div class="panel-control" *ngIf="alimentoSeleccionado">
                            <div class="control-header">
                                <i class="pi pi-arrow-right"></i>
                                <strong>{{ alimentoSeleccionado.nombre }}</strong>
                            </div>

                            <div class="control-body">
                                <!-- Ajuste de peso -->
                                <div class="peso-ajuste">
                                    <div class="peso-controls">
                                        <p-button icon="pi pi-minus" severity="secondary" [text]="true" [rounded]="true" size="small" (onClick)="decrementarPeso()" [disabled]="pesoSeleccionado <= 0" />
                                        <p-inputNumber [(ngModel)]="pesoSeleccionado" [min]="0" [max]="1000" [step]="10" suffix=" g" [showButtons]="false" styleClass="peso-input-inline" />
                                        <p-button icon="pi pi-plus" severity="secondary" [text]="true" [rounded]="true" size="small" (onClick)="incrementarPeso()" />
                                    </div>
                                </div>

                                <!-- Macros calculados inline -->
                                <div class="macros-inline" *ngIf="pesoSeleccionado > 0">
                                    <div class="macro-badge hidratos">
                                        <div class="macro-info">
                                            <span class="label">Sacharidy</span>
                                            <strong>{{ hidratosCalculados }}</strong>
                                        </div>
                                    </div>
                                    <div class="macro-badge proteinas">
                                        <div class="macro-info">
                                            <span class="label">Bílkoviny</span>
                                            <strong>{{ proteinasCalculadas }}</strong>
                                        </div>
                                    </div>
                                    <div class="macro-badge grasas">
                                        <div class="macro-info">
                                            <span class="label">Tuky</span>
                                            <strong>{{ grasasCalculadas }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-card>

                <!-- Paso 2: Ver Equivalencias -->
                <p-card class="paso-card" *ngIf="alimentoSeleccionado && pesoSeleccionado > 0">
                    <ng-template pTemplate="content">
                        <!-- Buscador de Equivalentes -->
                        <div class="search-toolbar">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <lucide-icon [img]="ArrowRightLeftIcon" [size]="24" class="search-icon-equiv"></lucide-icon>
                                <p-iconField iconPosition="left" class="search-field">
                                    <p-inputIcon>
                                        <i class="pi pi-search"></i>
                                    </p-inputIcon>
                                    <input pInputText type="text" [(ngModel)]="searchTermEquiv" (input)="filtrarEquivalentes()" placeholder="Vyhledat ekvivalent..." class="search-input" />
                                </p-iconField>
                            </div>
                        </div>

                        <!-- Tabla de Equivalentes -->
                        <div class="tabla-wrapper">
                            <div class="tabla">
                                <!-- Body -->
                                <div class="tabla-body">
                                    @for (alimento of equivalentesFiltrados(); track alimento.id) {
                                        <div class="tabla-row" [class.selected]="equivalenteSeleccionado?.alimento?.id === alimento.id" (click)="seleccionarEquivalente(alimento)">
                                            <i class="pi pi-check-circle check-icon" *ngIf="equivalenteSeleccionado?.alimento?.id === alimento.id"></i>
                                            <span class="alimento-nombre">{{ alimento.nombre }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <!-- Panel de Control de Equivalente (fuera del wrapper) -->
                        <div class="panel-control" *ngIf="equivalenteSeleccionado">
                            <div class="control-header-inline">
                                <div class="alimento-info">
                                    <i class="pi pi-arrow-right"></i>
                                    <strong>{{ equivalenteSeleccionado.alimento.nombre }}</strong>
                                </div>
                                <div class="peso-display-inline">
                                    <span class="peso-value">{{ equivalenteSeleccionado.pesoEquivalente || 0 }} g</span>
                                </div>
                            </div>

                            <div class="control-body">
                                <!-- Macros calculados inline -->
                                <div class="macros-inline">
                                    <div class="macro-badge hidratos">
                                        <div class="macro-info">
                                            <span class="label">Sacharidy</span>
                                            <strong>{{ ((equivalenteSeleccionado.alimento.hidratos * (equivalenteSeleccionado.pesoEquivalente || 0)) / 100).toFixed(1) }}</strong>
                                        </div>
                                    </div>
                                    <div class="macro-badge proteinas">
                                        <div class="macro-info">
                                            <span class="label">Bílkoviny</span>
                                            <strong>{{ ((equivalenteSeleccionado.alimento.proteinas * (equivalenteSeleccionado.pesoEquivalente || 0)) / 100).toFixed(1) }}</strong>
                                        </div>
                                    </div>
                                    <div class="macro-badge grasas">
                                        <div class="macro-info">
                                            <span class="label">Tuky</span>
                                            <strong>{{ ((equivalenteSeleccionado.alimento.grasas * (equivalenteSeleccionado.pesoEquivalente || 0)) / 100).toFixed(1) }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-card>

                <!-- Placeholder cuando no hay alimento seleccionado (solo en desktop) -->
                <div class="placeholder-card" *ngIf="!alimentoSeleccionado">
                    <div class="placeholder-content">
                        <div class="placeholder-icon">
                            <i class="pi pi-arrow-right-arrow-left"></i>
                        </div>
                        <h3>Vyberte potravinu</h3>
                        <p>Vyberte potravinu ze seznamu a zobrazte její nutriční ekvivalenty</p>
                        <div class="placeholder-decoration">
                            <lucide-icon [img]="CarrotIcon" [size]="32" class="macro-icon carbs"></lucide-icon>
                            <lucide-icon [img]="HamIcon" [size]="32" class="macro-icon protein"></lucide-icon>
                            <lucide-icon [img]="NutIcon" [size]="32" class="macro-icon fat"></lucide-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .equivalencias-container {
                max-width: 1600px;
                margin: 0 auto;

                overflow-y: visible;
            }

            /* Grid layout para cards lado a lado */
            .layout-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
                overflow: visible; /* Permitir que el grid crezca con el contenido */
            }

            @media screen and (min-width: 1024px) {
                .layout-grid {
                    grid-template-columns: 1fr 1fr;
                    align-items: start;
                }
            }

            /* Card de Paso */
            ::ng-deep .paso-card {
                background: rgba(15, 23, 42, 0.7098039216) !important;
                backdrop-filter: unset !important;
                border: 2px solid var(--brand-primary);
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;

                @media screen and (min-width: 1024px) {
                    height: 100%; /* Altura fija solo en desktop para cards lado a lado */
                }
            }

            ::ng-deep .paso-card .p-card-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: visible; /* Permitir que el contenido sea visible */
                min-height: 0;

                @media screen and (min-width: 1024px) {
                    overflow: hidden; /* En desktop sí mantener overflow hidden */
                }
            }

            ::ng-deep .paso-card .p-card-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: visible; /* Permitir que el contenido sea visible */
                min-height: 0;

                @media screen and (min-width: 1024px) {
                    overflow: hidden; /* En desktop sí mantener overflow hidden */
                }
            }

            ::ng-deep .paso-card:hover {
                box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
                transform: translateY(-2px);
            }

            /* Panel de Control integrado en la tabla */
            .panel-control {
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(146, 235, 255, 0.3);
                border-radius: 12px;
                padding: 1rem;
                flex-shrink: 0;
                margin-top: 1rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                overflow: hidden;
            }

            .control-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.95rem;
                color: var(--brand-primary);
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid rgba(146, 235, 255, 0.2);
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .control-header strong {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                min-width: 0;
            }

            /* Header en línea con peso */
            .control-header-inline {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid rgba(146, 235, 255, 0.2);
                flex-wrap: wrap;
            }

            .alimento-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.95rem;
                color: var(--brand-primary);
                font-weight: 600;
                overflow: hidden;
                flex: 1 1 auto;
                min-width: 0;
            }

            .alimento-info strong {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .alimento-info i {
                flex-shrink: 0;
            }

            .control-body {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }

            /* Ajuste de peso */
            .peso-ajuste {
                display: flex;
                flex-direction: row;
                gap: 0.75rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(146, 235, 255, 0.15);
                align-items: center;
                justify-content: center;
            }

            .label-peso {
                font-weight: 600;
                color: rgba(255, 255, 255, 0.9);
                font-size: 0.95rem;
            }

            .peso-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                flex-shrink: 0;
            }

            .peso-display {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }

            .peso-display-inline {
                display: flex;
                align-items: center;
                flex-shrink: 0;
            }

            .peso-label {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
            }

            .peso-value {
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--brand-primary);
                background: rgba(146, 235, 255, 0.15);
                padding: 0.4rem 1rem;
                border-radius: 8px;
                border: 1px solid rgba(146, 235, 255, 0.3);
                white-space: nowrap;
            }

            ::ng-deep .peso-input-inline input {
                text-align: center;
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--brand-primary);
                padding: 0.5rem 0.75rem;
                background: rgba(255, 255, 255, 0.1) !important;
                border: 1px solid rgba(146, 235, 255, 0.3) !important;
                border-radius: 8px !important;
            }

            ::ng-deep .peso-input-inline input:focus {
                background: rgba(255, 255, 255, 0.15) !important;
                border-color: var(--brand-primary) !important;
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
            }

            ::ng-deep .peso-controls .p-button {
                background: rgba(146, 235, 255, 0.15) !important;
                border: 1px solid rgba(146, 235, 255, 0.3) !important;
            }

            ::ng-deep .peso-controls .p-button:hover {
                background: rgba(146, 235, 255, 0.25) !important;
                border-color: var(--brand-primary) !important;
            }

            ::ng-deep .peso-controls .p-button .pi {
                font-size: 1rem;
                color: rgba(255, 255, 255, 0.9);
            }

            /* Macros como badges minimalistas en una fila */
            .macros-inline {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: space-between;
            }

            .macro-badge {
                border: 1px solid var(--brand-primary);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.3rem;
                padding: 0.6rem 0.5rem;
                border-radius: 8px;
                color: var(--brand-primary);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
                transition: all 0.2s ease;
                text-align: center;
                flex: 1 1 calc(33.333% - 0.4rem);
                min-width: 80px;
                max-width: 150px;
            }

            .macro-badge:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }

            ::ng-deep .macro-badge .macro-icon-small {
                flex-shrink: 0;
                opacity: 0.9;
            }

            .macro-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.2rem;
                width: 100%;
            }

            .macro-badge .label {
                font-weight: 500;
                font-size: 0.75rem;
                opacity: 0.85;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }

            .macro-badge strong {
                font-size: 1.15rem;
                font-weight: 700;
                white-space: nowrap;
            }

            /* Header personalizado */
            .card-header-custom {
                background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
                padding: 1.5rem 2rem;
                border-radius: 12px 12px 0 0;
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .paso-numero {
                background: rgba(255, 255, 255, 0.95);
                color: var(--brand-primary);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.75rem;
                font-weight: 800;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
                flex-shrink: 0;
            }

            .card-header-custom h2 {
                margin: 0;
                color: white;
                font-size: 1.25rem;
                font-weight: 600;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            @media screen and (min-width: 1024px) {
                .card-header-custom h2 {
                    font-size: 1.35rem;
                }
            }

            /* Buscador */
            .search-toolbar {
                margin-bottom: 0.75rem;
                flex-shrink: 0;
            }

            .search-field {
                width: 100%;
                flex: 1;
            }

            ::ng-deep .search-icon-equiv {
                color: var(--brand-primary);
                flex-shrink: 0;
                opacity: 0.9;
                transition: all 0.3s ease;
            }

            ::ng-deep .search-icon-equiv:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            ::ng-deep .search-icon-pointer {
                color: var(--brand-primary);
                flex-shrink: 0;
                opacity: 0.9;
                transition: all 0.3s ease;
            }

            ::ng-deep .search-icon-pointer:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            ::ng-deep .search-input {
                width: 100%;
                font-size: 1rem;
                background: #0f172ac4 !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                color: #ffffff !important;
                transition: all 0.3s ease !important;
            }

            ::ng-deep .search-input::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
            }

            ::ng-deep .search-input:hover {
                border-color: rgba(28, 169, 244, 0.5) !important;
                background: rgba(255, 255, 255, 0.2) !important;
            }

            ::ng-deep .search-input:focus {
                border-color: var(--brand-primary) !important;
                background: rgba(255, 255, 255, 0.25) !important;
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
            }

            ::ng-deep .search-field .p-inputicon {
                color: rgba(255, 255, 255, 0.7) !important;
            }

            /* Tabla */
            .tabla-wrapper {
                border: 1px solid var(--brand-primary);
                border-radius: 8px;
                overflow: hidden;
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
                position: relative;
            }

            .tabla {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 0;
                overflow: hidden;
            }

            .tabla-body {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
                min-height: 0;
                max-height: 100%;
                position: relative;
            }

            /* En desktop, hacer que las tablas ocupen altura completa */
            @media screen and (min-width: 1024px) {
                .layout-grid {
                    height: calc(100vh - 13rem);
                    align-items: stretch;
                }

                .paso-card {
                    height: calc(100vh - 6rem);
                    max-height: calc(100vh - 6rem);
                    overflow: hidden;
                }

                ::ng-deep .p-card-content {
                    height: 100%;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                ::ng-deep .p-card-body {
                    height: 100%;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .search-toolbar {
                    flex-shrink: 0;
                }

                .tabla-wrapper {
                    flex: 0 1 auto;
                    min-height: 200px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .tabla {
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .tabla-body {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto !important;
                    overflow-x: hidden;
                }

                .panel-control {
                    flex-shrink: 0;
                    margin-top: 0.75rem;
                    max-width: 100%;
                }
            }

            .tabla-body-equiv {
                /* Sin restricciones adicionales, hereda de .tabla-body */
            }

            .tabla-row {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .tabla-row:hover {
                background: rgba(146, 235, 255, 0.15);
                border-left: 3px solid var(--brand-primary);
                padding-left: calc(1.25rem - 3px);
            }

            .tabla-row.selected {
                background: linear-gradient(135deg, rgba(146, 235, 255, 0.25), rgba(255, 166, 0, 0.15));
                border-left: 4px solid var(--brand-primary);
                font-weight: 600;
                padding-left: calc(1.25rem - 4px);
            }

            .check-icon {
                color: var(--brand-primary);
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            .alimento-nombre {
                color: var(--brand-primary);
                font-size: 1rem;
                font-weight: 500;
            }

            .tabla-row.selected .alimento-nombre {
                font-weight: 600;
            }

            .equiv-icon {
                color: var(--brand-primary);
                font-size: 1.25rem;
                flex-shrink: 0;
            }

            /* Placeholder Card */
            .placeholder-card {
                background: #0f172ab5;
                -webkit-backdrop-filter: blur(15px);
                border: 2px solid var(--brand-primary);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                transition: all 0.3s ease;
            }

            /* Ocultar placeholder en móviles/tablets */
            @media screen and (max-width: 1023px) {
                .placeholder-card {
                    display: none;
                }
            }

            .placeholder-card:hover {
                border-color: rgba(146, 235, 255, 0.6);
                background: var(--code-background);
                transform: translateY(-2px);
                box-shadow: 0 0px 10px var(--brand-primary);
            }

            .placeholder-content {
                text-align: center;
                max-width: 350px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }

            .placeholder-icon {
                width: 100px;
                height: 100px;
                margin: 0 auto 1.5rem;
                border: 1px solid var(--brand-primary);
                background: linear-gradient(356deg, #92ebff66, #92ebff66);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 25px rgba(146, 235, 255, 0.3);
                animation: pulse 2s ease-in-out infinite;
            }

            .placeholder-icon i {
                font-size: 3rem;
                color: white;
            }

            @keyframes pulse {
                0%,
                100% {
                    transform: scale(1);
                    box-shadow: 0 8px 25px rgba(146, 235, 255, 0.3);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 12px 35px rgba(146, 235, 255, 0.5);
                }
            }

            .placeholder-content h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
                margin-bottom: 0.75rem;
                background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .placeholder-content p {
                font-size: 1rem;
                color: #666;
                line-height: 1.6;
                margin-bottom: 2rem;
            }

            .placeholder-decoration {
                display: flex;
                justify-content: center;
                gap: 1.5rem;
                margin-top: 2rem;
                opacity: 0.7;
            }

            ::ng-deep .placeholder-decoration .macro-icon {
                animation: float 3s ease-in-out infinite;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            }

            ::ng-deep .placeholder-decoration .macro-icon.carbs {
                color: #2196f3;
            }

            ::ng-deep .placeholder-decoration .macro-icon.protein {
                color: #4caf50;
                animation-delay: 0.5s;
            }

            ::ng-deep .placeholder-decoration .macro-icon.fat {
                color: #ff7043;
                animation-delay: 1s;
            }

            @keyframes float {
                0%,
                100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            /* Responsive para pantallas medianas y grandes con zoom */
            @media screen and (max-width: 1400px) {
                .panel-control {
                    padding: 0.9rem;
                }

                .control-header {
                    font-size: 0.9rem;
                }

                .alimento-info {
                    font-size: 0.9rem;
                }

                .peso-value {
                    font-size: 1.15rem;
                    padding: 0.35rem 0.9rem;
                }

                ::ng-deep .peso-input-inline input {
                    font-size: 1.15rem;
                    padding: 0.45rem 0.65rem;
                }

                .macros-inline {
                    gap: 0.4rem;
                }

                .macro-badge {
                    padding: 0.55rem 0.45rem;
                    flex: 1 1 calc(33.333% - 0.35rem);
                    min-width: 75px;
                }

                .macro-badge .label {
                    font-size: 0.7rem;
                }

                .macro-badge strong {
                    font-size: 1.05rem;
                }
            }

            @media screen and (max-width: 1200px) {
                .panel-control {
                    padding: 0.85rem;
                }

                .control-header {
                    font-size: 0.85rem;
                }

                .alimento-info {
                    font-size: 0.85rem;
                }

                .control-header-inline {
                    gap: 0.75rem;
                }

                .peso-value {
                    font-size: 1.1rem;
                    padding: 0.35rem 0.85rem;
                }

                ::ng-deep .peso-input-inline input {
                    font-size: 1.1rem;
                    padding: 0.4rem 0.6rem;
                }

                .macros-inline {
                    gap: 0.35rem;
                }

                .macro-badge {
                    padding: 0.5rem 0.4rem;
                    flex: 1 1 calc(33.333% - 0.3rem);
                    min-width: 70px;
                }

                .macro-badge .label {
                    font-size: 0.68rem;
                }

                .macro-badge strong {
                    font-size: 1rem;
                }
            }

            @media screen and (max-width: 1024px) {
                .panel-control {
                    padding: 0.8rem;
                }

                .alimento-info {
                    font-size: 0.8rem;
                }

                .control-header-inline {
                    gap: 0.6rem;
                }

                .peso-value {
                    font-size: 1.05rem;
                    padding: 0.3rem 0.75rem;
                }

                ::ng-deep .peso-input-inline input {
                    font-size: 1.05rem;
                    padding: 0.35rem 0.55rem;
                }

                .macros-inline {
                    gap: 0.3rem;
                }

                .macro-badge {
                    padding: 0.45rem 0.35rem;
                    flex: 1 1 calc(33.333% - 0.25rem);
                    min-width: 65px;
                }

                .macro-badge .label {
                    font-size: 0.65rem;
                }

                .macro-badge strong {
                    font-size: 0.95rem;
                }
            }

            /* Responsive */
            @media screen and (max-width: 767px) {
                /* Hacer que los cards en móvil también tengan altura fija */
                .paso-card {
                    height: calc(100dvh - 6rem) !important;
                    max-height: calc(100dvh - 6rem) !important;
                    min-height: calc(100dvh - 6rem) !important;
                    overflow: hidden;

                    @supports not (height: 100dvh) {
                        height: calc(100vh - 6rem) !important;
                        max-height: calc(100vh - 6rem) !important;
                        min-height: calc(100vh - 6rem) !important;
                    }
                }

                ::ng-deep .paso-card .p-card-content {
                    height: 100%;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                ::ng-deep .paso-card .p-card-body {
                    height: 100%;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .search-toolbar {
                    flex-shrink: 0;
                }

                .tabla-wrapper {
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .tabla {
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .tabla-body {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto !important;
                    overflow-x: hidden;
                }

                .panel-control {
                    flex-shrink: 0;
                    margin-top: 0.75rem;
                    max-width: 100%;
                }
            }

            @media screen and (max-width: 768px) {
                .placeholder-card {
                    min-height: 300px;
                    padding: 2rem 1rem;
                }

                .placeholder-icon {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 1rem;
                }

                .placeholder-icon i {
                    font-size: 2.5rem;
                }

                .placeholder-content h3 {
                    font-size: 1.25rem;
                }

                .placeholder-content p {
                    font-size: 0.9rem;
                }

                ::ng-deep .placeholder-decoration .macro-icon {
                    width: 28px;
                    height: 28px;
                }

                .card-header-custom {
                    flex-direction: column;
                    text-align: center;
                    padding: 1rem;
                }

                .card-header-custom h2 {
                    font-size: 1.1rem;
                }

                .paso-numero {
                    width: 40px;
                    height: 40px;
                    font-size: 1.5rem;
                }

                .tabla-row {
                    padding: 0.875rem 1rem;
                    font-size: 0.875rem;
                }

                .alimento-nombre {
                    font-size: 0.9rem;
                }

                .control-header {
                    font-size: 0.9rem;
                }

                .control-header-inline {
                    gap: 1rem;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .peso-controls {
                    align-self: stretch;
                }

                ::ng-deep .peso-input-inline {
                    flex: 1;
                }

                .peso-display-inline {
                    align-self: stretch;
                }

                .peso-value {
                    width: 100%;
                    text-align: center;
                }

                .macros-inline {
                    gap: 0.35rem;
                    flex-wrap: wrap;
                }

                .macro-badge {
                    padding: 0.5rem 0.4rem;
                    gap: 0.2rem;
                    flex: 1 1 calc(33.333% - 0.3rem);
                    min-width: 80px;
                }

                ::ng-deep .macro-badge .macro-icon-small {
                    width: 14px;
                    height: 14px;
                }

                .macro-badge .label {
                    font-size: 0.68rem;
                }

                .macro-badge strong {
                    font-size: 1rem;
                }
            }

            @media screen and (max-width: 480px) {
                .tabla-row {
                    padding: 0.75rem 0.875rem;
                    font-size: 0.8rem;
                }

                .alimento-nombre {
                    font-size: 0.85rem;
                }

                .panel-control {
                    padding: 1rem;
                }

                .peso-ajuste {
                    gap: 0.5rem;
                }

                .peso-controls {
                    width: 100%;
                }

                ::ng-deep .peso-input-inline {
                    flex: 1;
                    max-width: 164px;
                }

                ::ng-deep .peso-input-inline input {
                    font-size: 1.1rem;
                    padding: 0.4rem 0.5rem;
                    width: 100%;
                }

                ::ng-deep .peso-controls .p-button {
                    width: 36px;
                    height: 36px;
                }

                .macros-inline {
                    gap: 0.35rem;
                    flex-wrap: wrap;
                }

                .macro-badge {
                    padding: 0.45rem 0.35rem;
                    gap: 0.2rem;
                    flex: 1 1 calc(33.333% - 0.3rem);
                    min-width: 70px;
                }

                ::ng-deep .macro-badge .macro-icon-small {
                    width: 14px;
                    height: 14px;
                }

                .macro-badge .label {
                    font-size: 0.62rem;
                }

                .macro-badge strong {
                    font-size: 0.95rem;
                }
            }

            /* Para pantallas muy pequeñas o zoom muy alto */
            @media screen and (max-width: 360px) {
                .macros-inline {
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .macro-badge {
                    flex: 1 1 100%;
                    max-width: 100%;
                    padding: 0.5rem;
                }

                .macro-badge .label {
                    font-size: 0.7rem;
                }

                .macro-badge strong {
                    font-size: 1rem;
                }
            }
        `
    ]
})
export class Equivalencias implements OnInit {
    // Iconos de Lucide
    readonly CarrotIcon = Carrot;
    readonly HamIcon = Ham;
    readonly NutIcon = Nut;
    readonly ArrowRightLeftIcon = ArrowRightLeft;
    readonly PointerIcon = Pointer;

    // Señales
    alimentosFiltrados = signal<Alimento[]>([]);
    alimentosDisponibles = signal<Alimento[]>([]); // Lista de alimentos disponibles para equivalentes
    equivalentesFiltrados = signal<Alimento[]>([]);

    // Variables
    searchTerm: string = '';
    searchTermEquiv: string = '';
    alimentoSeleccionado: Alimento | null = null;
    pesoSeleccionado: number = 100;
    equivalenteSeleccionado: AlimentoEquivalente | null = null;

    // Base de datos de alimentos
    alimentos: Alimento[] = [
        { id: '4', nombre: 'Strouhaný sýr', hidratos: 0, proteinas: 32, grasas: 26 },
        { id: '5', nombre: 'Açaí', hidratos: 52, proteinas: 8, grasas: 32 },
        { id: '6', nombre: 'Masové kuličky s hráškem', hidratos: 9.6, proteinas: 9.4, grasas: 7.8 },
        { id: '7', nombre: 'Bílá rýže', hidratos: 28, proteinas: 2.7, grasas: 0.3 },
        { id: '8', nombre: 'Celozrnná rýže', hidratos: 23, proteinas: 2.6, grasas: 0.9 },
        { id: '9', nombre: 'Tuňák ve vlastní šťávě', hidratos: 0, proteinas: 23, grasas: 0.6 },
        { id: '10', nombre: 'Ovesné vločky', hidratos: 59, proteinas: 13, grasas: 7 },
        { id: '11', nombre: 'Kuřecí prsíčka', hidratos: 0, proteinas: 23, grasas: 1.2 },
        { id: '12', nombre: 'Krůtí prsíčka', hidratos: 0, proteinas: 24, grasas: 1 },
        { id: '13', nombre: 'Celozrnné těstoviny', hidratos: 25, proteinas: 3, grasas: 0.6 },
        { id: '14', nombre: 'Batáty', hidratos: 20, proteinas: 1.6, grasas: 0.1 },
        { id: '15', nombre: 'Čočka', hidratos: 20, proteinas: 9, grasas: 0.4 },
        { id: '16', nombre: 'Cizrna', hidratos: 19, proteinas: 8.9, grasas: 2.6 },
        { id: '17', nombre: 'Banán', hidratos: 23, proteinas: 1.1, grasas: 0.3 },
        { id: '18', nombre: 'Jablko', hidratos: 14, proteinas: 0.3, grasas: 0.2 },
        { id: '19', nombre: 'Losos', hidratos: 0, proteinas: 20, grasas: 13 },
        { id: '20', nombre: 'Řecký jogurt', hidratos: 4, proteinas: 10, grasas: 5 }
    ];

    ngOnInit() {
        // Inicializar con todos los alimentos
        this.alimentosFiltrados.set(this.alimentos);
    }

    filtrarAlimentos() {
        const term = this.searchTerm.toLowerCase();
        if (!term) {
            this.alimentosFiltrados.set(this.alimentos);
        } else {
            const filtrados = this.alimentos.filter((a) => a.nombre.toLowerCase().includes(term));
            this.alimentosFiltrados.set(filtrados);
        }
    }

    filtrarEquivalentes() {
        const term = this.searchTermEquiv.toLowerCase();
        if (!term) {
            this.equivalentesFiltrados.set(this.alimentosDisponibles());
        } else {
            const filtrados = this.alimentosDisponibles().filter((a) => a.nombre.toLowerCase().includes(term));
            this.equivalentesFiltrados.set(filtrados);
        }
    }

    seleccionarAlimento(alimento: Alimento) {
        this.alimentoSeleccionado = alimento;
        this.pesoSeleccionado = 100; // Resetear a 100g
        this.equivalenteSeleccionado = null; // Resetear selección de equivalente

        // Mostrar todos los demás alimentos como opciones de equivalentes
        const alimentosDisponibles = this.alimentos.filter((a) => a.id !== alimento.id);
        this.alimentosDisponibles.set(alimentosDisponibles);
        this.equivalentesFiltrados.set(alimentosDisponibles);
        this.searchTermEquiv = ''; // Resetear búsqueda de equivalentes

        // Hacer scroll SOLO dentro del contenedor de la tabla, sin mover el scroll general
        setTimeout(() => {
            const tablaBody = document.querySelector('.tabla-body') as HTMLElement;
            const selectedRow = document.querySelector('.tabla-row.selected') as HTMLElement;

            if (tablaBody && selectedRow) {
                // Calcular la posición relativa dentro del contenedor
                const containerRect = tablaBody.getBoundingClientRect();
                const rowRect = selectedRow.getBoundingClientRect();
                const scrollOffset = rowRect.top - containerRect.top - containerRect.height / 2 + rowRect.height / 2;

                // Hacer scroll solo dentro del contenedor
                tablaBody.scrollBy({
                    top: scrollOffset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    seleccionarEquivalente(alimento: Alimento) {
        // Calcular el peso equivalente basado en los macros del alimento seleccionado
        const macrosObjetivo = {
            hidratos: this.hidratosCalculados,
            proteinas: this.proteinasCalculadas,
            grasas: this.grasasCalculadas
        };

        const pesoEquivalente = this.calcularPesoEquivalente(alimento, macrosObjetivo);

        this.equivalenteSeleccionado = {
            alimento,
            pesoEquivalente
        };

        // Hacer scroll SOLO dentro del contenedor de la tabla, sin mover el scroll general
        setTimeout(() => {
            const tablasBodies = document.querySelectorAll('.tabla-body');
            const selectedRows = document.querySelectorAll('.tabla-row.selected');

            if (tablasBodies.length > 1 && selectedRows.length > 1) {
                const tablaEquivalentes = tablasBodies[1] as HTMLElement;
                const selectedRow = selectedRows[1] as HTMLElement;

                // Calcular la posición relativa dentro del contenedor
                const containerRect = tablaEquivalentes.getBoundingClientRect();
                const rowRect = selectedRow.getBoundingClientRect();
                const scrollOffset = rowRect.top - containerRect.top - containerRect.height / 2 + rowRect.height / 2;

                // Hacer scroll solo dentro del contenedor
                tablaEquivalentes.scrollBy({
                    top: scrollOffset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    incrementarPeso() {
        this.pesoSeleccionado += 10;
        this.actualizarEquivalenteSeleccionado();
    }

    decrementarPeso() {
        if (this.pesoSeleccionado >= 10) {
            this.pesoSeleccionado -= 10;
            this.actualizarEquivalenteSeleccionado();
        }
    }

    actualizarEquivalenteSeleccionado() {
        // Si hay un equivalente seleccionado, recalcular su peso
        if (this.equivalenteSeleccionado) {
            const macrosObjetivo = {
                hidratos: this.hidratosCalculados,
                proteinas: this.proteinasCalculadas,
                grasas: this.grasasCalculadas
            };

            const pesoEquivalente = this.calcularPesoEquivalente(this.equivalenteSeleccionado.alimento, macrosObjetivo);

            this.equivalenteSeleccionado = {
                alimento: this.equivalenteSeleccionado.alimento,
                pesoEquivalente
            };
        }
    }

    get hidratosCalculados(): number {
        if (!this.alimentoSeleccionado) return 0;
        return Number(((this.alimentoSeleccionado.hidratos * this.pesoSeleccionado) / 100).toFixed(1));
    }

    get proteinasCalculadas(): number {
        if (!this.alimentoSeleccionado) return 0;
        return Number(((this.alimentoSeleccionado.proteinas * this.pesoSeleccionado) / 100).toFixed(1));
    }

    get grasasCalculadas(): number {
        if (!this.alimentoSeleccionado) return 0;
        return Number(((this.alimentoSeleccionado.grasas * this.pesoSeleccionado) / 100).toFixed(1));
    }

    private calcularPesoEquivalente(alimento: Alimento, macrosObjetivo: any): number {
        // Calcular el peso necesario para igualar las calorías totales aproximadas
        const caloriasObjetivo = macrosObjetivo.hidratos * 4 + macrosObjetivo.proteinas * 4 + macrosObjetivo.grasas * 9;

        const caloriasPor100g = alimento.hidratos * 4 + alimento.proteinas * 4 + alimento.grasas * 9;

        if (caloriasPor100g === 0) return 0;

        return Number(((caloriasObjetivo * 100) / caloriasPor100g).toFixed(0));
    }
}

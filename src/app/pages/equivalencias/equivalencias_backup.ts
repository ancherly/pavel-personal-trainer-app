import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputNumberModule } from 'primeng/inputnumber';

// Interfaces
interface Alimento {
    id: string;
    nombre: string;
    hidratos: number; // por 100g
    proteinas: number; // por 100g
    grasas: number; // por 100g
    categoria: string;
}

interface AlimentoEquivalente {
    alimento: Alimento;
    pesoEquivalente: number;
}

@Component({
    selector: 'app-equivalencias',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        InputNumberModule
    ],
    template: `
        <div class="equivalencias-container">
            <!-- Paso 1: Seleccionar Alimento -->
            <p-card class="paso-card">
                <ng-template pTemplate="header">
                    <div class="card-header-custom">
                        <div class="paso-numero">1</div>
                        <h2>Selecciona un alimento</h2>
                    </div>
                </ng-template>
                
                <ng-template pTemplate="content">
                    <!-- Buscador -->
                    <div class="search-toolbar">
                        <p-iconField iconPosition="left" class="search-field">
                            <p-inputIcon>
                                <i class="pi pi-search"></i>
                            </p-inputIcon>
                            <input 
                                pInputText 
                                type="text" 
                                [(ngModel)]="searchTerm"
                                (input)="filtrarAlimentos()"
                                placeholder="Buscar alimento..." 
                                class="search-input"
                            />
                        </p-iconField>
                    </div>

                    <!-- Tabla de Alimentos -->
                    <div class="tabla-alimentos-wrapper">
                        <div class="tabla-alimentos">
                            <!-- Header de la tabla -->
                            <div class="tabla-header">
                                <div class="col-nombre">Alimento</div>
                                <div class="col-categoria">Categoría</div>
                                <div class="col-macros">Hidratos</div>
                                <div class="col-macros">Proteínas</div>
                                <div class="col-macros">Grasas</div>
                            </div>

                            <!-- Body de la tabla -->
                            <div class="tabla-body">
                                @for (alimento of alimentosFiltrados(); track alimento.id) {
                                    <div 
                                        class="tabla-row" 
                                        [class.selected]="alimentoSeleccionado?.id === alimento.id"
                                        (click)="seleccionarAlimento(alimento)"
                                    >
                                        <div class="col-nombre">
                                            <i class="pi pi-check-circle" *ngIf="alimentoSeleccionado?.id === alimento.id"></i>
                                            {{ alimento.nombre }}
                                        </div>
                                        <div class="col-categoria">{{ alimento.categoria }}</div>
                                        <div class="col-macros">{{ alimento.hidratos }}g</div>
                                        <div class="col-macros">{{ alimento.proteinas }}g</div>
                                        <div class="col-macros">{{ alimento.grasas }}g</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-card>

            <!-- Paso 2: Ajustar Cantidad (solo visible si hay alimento seleccionado) -->
            <p-card class="paso-card" *ngIf="alimentoSeleccionado">
                <ng-template pTemplate="header">
                    <div class="card-header-custom">
                        <div class="paso-numero">2</div>
                        <h2>¿Cuántos gramos tienes de {{ alimentoSeleccionado.nombre }}?</h2>
                    </div>
                </ng-template>
                
                <ng-template pTemplate="content">
                    <div class="peso-control">
                        <p-button 
                            icon="pi pi-minus" 
                            severity="secondary"
                            [rounded]="true"
                            [outlined]="true"
                            (onClick)="decrementarPeso()"
                            [disabled]="pesoSeleccionado <= 0"
                        />
                        
                        <div class="peso-input-wrapper">
                            <p-inputNumber
                                [(ngModel)]="pesoSeleccionado"
                                [min]="0"
                                [max]="1000"
                                [step]="10"
                                suffix=" g"
                                [showButtons]="false"
                                styleClass="peso-input-large"
                            />
                        </div>

                        <p-button 
                            icon="pi pi-plus" 
                            severity="secondary"
                            [rounded]="true"
                            [outlined]="true"
                            (onClick)="incrementarPeso()"
                        />
                    </div>

                    <!-- Macros calculados -->
                    <div class="macros-resumen" *ngIf="pesoSeleccionado > 0">
                        <div class="macro-item">
                            <span class="macro-label">Hidratos:</span>
                            <span class="macro-valor">{{ hidratosCalculados }}g</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-label">Proteínas:</span>
                            <span class="macro-valor">{{ proteinasCalculadas }}g</span>
                        </div>
                        <div class="macro-item">
                            <span class="macro-label">Grasas:</span>
                            <span class="macro-valor">{{ grasasCalculadas }}g</span>
                        </div>
                    </div>
                </ng-template>
            </p-card>

            <!-- Paso 3: Ver Equivalencias (solo visible si hay peso seleccionado) -->
            <p-card class="paso-card" *ngIf="alimentoSeleccionado && pesoSeleccionado > 0">
                <ng-template pTemplate="header">
                    <div class="card-header-custom">
                        <div class="paso-numero">3</div>
                        <h2>Puedes sustituirlo por cualquiera de estos alimentos:</h2>
                    </div>
                </ng-template>
                
                <ng-template pTemplate="content">
                    <!-- Tabla de Equivalentes -->
                    <div class="tabla-equivalentes-wrapper">
                        <div class="tabla-equivalentes">
                            <!-- Header -->
                            <div class="tabla-header">
                                <div class="col-nombre-equiv">Alimento equivalente</div>
                                <div class="col-peso">Cantidad</div>
                                <div class="col-macros">Hidratos</div>
                                <div class="col-macros">Proteínas</div>
                                <div class="col-macros">Grasas</div>
                            </div>

                            <!-- Body -->
                            <div class="tabla-body">
                                @for (equiv of equivalentesCalculados(); track equiv.alimento.id) {
                                    <div class="tabla-row-equiv">
                                        <div class="col-nombre-equiv">
                                            <i class="pi pi-arrow-right-arrow-left"></i>
                                            {{ equiv.alimento.nombre }}
                                        </div>
                                        <div class="col-peso peso-destacado">
                                            {{ equiv.pesoEquivalente }}g
                                        </div>
                                        <div class="col-macros">{{ ((equiv.alimento.hidratos * equiv.pesoEquivalente) / 100).toFixed(1) }}g</div>
                                        <div class="col-macros">{{ ((equiv.alimento.proteinas * equiv.pesoEquivalente) / 100).toFixed(1) }}g</div>
                                        <div class="col-macros">{{ ((equiv.alimento.grasas * equiv.pesoEquivalente) / 100).toFixed(1) }}g</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-card>
        </div>
    `,
                    <ng-template pTemplate="header">
                        <div class="card-header-custom">
                            <h2>
                                <i class="pi pi-list"></i>
                                Raciones Disponibles
                            </h2>
                        </div>
                    </ng-template>
                    
                    <ng-template pTemplate="content">
                        <!-- Buscador -->
                        <div class="search-toolbar">
                            <p-iconField iconPosition="left" class="search-field">
                                <p-inputIcon>
                                    <i class="pi pi-search"></i>
                                </p-inputIcon>
                                <input 
                                    pInputText 
                                    type="text" 
                                    [(ngModel)]="searchTerm"
                                    (input)="filtrarAlimentos()"
                                    placeholder="Buscar ración..." 
                                    class="search-input"
                                />
                            </p-iconField>
                        </div>

                        <!-- Tabla de Alimentos -->
                        <div class="tabla-alimentos-wrapper">
                            <div class="tabla-alimentos">
                                <!-- Header de la tabla -->
                                <div class="tabla-header">
                                    <div class="col-nombre">Alimento</div>
                                    <div class="col-categoria">Categoría</div>
                                    <div class="col-macros">Hidratos</div>
                                    <div class="col-macros">Proteínas</div>
                                    <div class="col-macros">Grasas</div>
                                </div>

                                <!-- Filas de alimentos -->
                                <div class="tabla-body">
                                    <div 
                                        *ngFor="let alimento of alimentosFiltrados()"
                                        class="tabla-row"
                                        [class.selected]="alimentoSeleccionado?.id === alimento.id"
                                        (click)="seleccionarAlimento(alimento)"
                                    >
                                        <div class="col-nombre">
                                            <i class="pi pi-circle-fill status-indicator"></i>
                                            {{ alimento.nombre }}
                                        </div>
                                        <div class="col-categoria">
                                            <span class="categoria-badge">{{ alimento.categoria }}</span>
                                        </div>
                                        <div class="col-macros">{{ alimento.hidratos }}g</div>
                                        <div class="col-macros">{{ alimento.proteinas }}g</div>
                                        <div class="col-macros">{{ alimento.grasas }}g</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Panel de Alimento Seleccionado -->
                        <div class="alimento-seleccionado-panel" *ngIf="alimentoSeleccionado">
                            <div class="panel-header">
                                <h3>
                                    <i class="pi pi-check-circle"></i>
                                    {{ alimentoSeleccionado.nombre }}
                                </h3>
                            </div>
                            
                            <div class="panel-content">
                                <!-- Control de Peso -->
                                <div class="peso-section">
                                    <label class="peso-label">Ajustar Peso (gramos)</label>
                                    <div class="peso-controls">
                                        <p-button 
                                            icon="pi pi-minus" 
                                            [rounded]="true"
                                            severity="secondary"
                                            size="small"
                                            (onClick)="decrementarPeso()"
                                        />
                                        <p-inputNumber
                                            [(ngModel)]="pesoSeleccionado"
                                            [showButtons]="false"
                                            [min]="0"
                                            [max]="10000"
                                            class="peso-input"
                                            (ngModelChange)="calcularEquivalencias()"
                                        />
                                        <p-button 
                                            icon="pi pi-plus" 
                                            [rounded]="true"
                                            severity="secondary"
                                            size="small"
                                            (onClick)="incrementarPeso()"
                                        />
                                    </div>
                                </div>

                                <!-- Macros Calculados -->
                                <div class="macros-section">
                                    <div class="macro-card">
                                        <div class="macro-icon hidratos">
                                            <i class="pi pi-chart-bar"></i>
                                        </div>
                                        <div class="macro-info">
                                            <span class="macro-label">Hidratos</span>
                                            <span class="macro-value">{{ hidratosCalculados() }}g</span>
                                        </div>
                                    </div>
                                    <div class="macro-card">
                                        <div class="macro-icon proteinas">
                                            <i class="pi pi-bolt"></i>
                                        </div>
                                        <div class="macro-info">
                                            <span class="macro-label">Proteínas</span>
                                            <span class="macro-value">{{ proteinasCalculadas() }}g</span>
                                        </div>
                                    </div>
                                    <div class="macro-card">
                                        <div class="macro-icon grasas">
                                            <i class="pi pi-circle"></i>
                                        </div>
                                        <div class="macro-info">
                                            <span class="macro-label">Grasas</span>
                                            <span class="macro-value">{{ grasasCalculadas() }}g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-card>

                <!-- Card de Equivalentes (solo si hay alimento seleccionado) -->
                <p-card class="equivalentes-card" *ngIf="alimentoSeleccionado && pesoSeleccionado > 0">
                    <ng-template pTemplate="header">
                        <div class="card-header-custom">
                            <h2>
                                <i class="pi pi-arrows-h"></i>
                                Alimentos Equivalentes
                            </h2>
                        </div>
                    </ng-template>
                    
                    <ng-template pTemplate="content">
                        <!-- Buscador de Equivalentes -->
                        <div class="search-toolbar">
                            <p-iconField iconPosition="left" class="search-field">
                                <p-inputIcon>
                                    <i class="pi pi-search"></i>
                                </p-inputIcon>
                                <input 
                                    pInputText 
                                    type="text" 
                                    [(ngModel)]="searchEquivalente"
                                    (input)="filtrarEquivalentes()"
                                    placeholder="Buscar equivalente..." 
                                    class="search-input"
                                />
                            </p-iconField>
                            <div class="results-count">
                                <i class="pi pi-info-circle"></i>
                                {{ equivalentesFiltrados().length }} equivalentes encontrados
                            </div>
                        </div>

                        <!-- Tabla de Equivalentes -->
                        <div class="tabla-equivalentes-wrapper">
                            <div class="tabla-equivalentes">
                                <!-- Header -->
                                <div class="tabla-header">
                                    <div class="col-nombre-eq">Alimento Equivalente</div>
                                    <div class="col-peso">Peso (g)</div>
                                    <div class="col-macro-eq">H</div>
                                    <div class="col-macro-eq">P</div>
                                    <div class="col-macro-eq">G</div>
                                </div>

                                <!-- Body -->
                                <div class="tabla-body">
                                    <div 
                                        *ngFor="let equiv of equivalentesFiltrados()"
                                        class="tabla-row-eq"
                                    >
                                        <div class="col-nombre-eq">
                                            <i class="pi pi-arrow-right"></i>
                                            {{ equiv.alimento.nombre }}
                                        </div>
                                        <div class="col-peso peso-highlight">
                                            {{ equiv.pesoEquivalente.toFixed(0) }}g
                                        </div>
                                        <div class="col-macro-eq">
                                            {{ calcularMacro(equiv.alimento.hidratos, equiv.pesoEquivalente) }}
                                        </div>
                                        <div class="col-macro-eq">
                                            {{ calcularMacro(equiv.alimento.proteinas, equiv.pesoEquivalente) }}
                                        </div>
                                        <div class="col-macro-eq">
                                            {{ calcularMacro(equiv.alimento.grasas, equiv.pesoEquivalente) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Mensaje si no hay equivalentes -->
                        <div class="no-results" *ngIf="equivalentesFiltrados().length === 0">
                            <i class="pi pi-inbox"></i>
                            <p>No se encontraron alimentos equivalentes</p>
                        </div>
                    </ng-template>
                </p-card>
            </div>
        </div>
    `,
    styles: [
        `
            .equivalencias-container {
                min-height: calc(100vh - 9rem);
                padding: 2rem;
            }

            .equivalencias-content {
                max-width: 1800px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
                transition: all 0.5s ease;
            }

            /* Layout lado a lado en pantallas grandes cuando hay alimento seleccionado */
            @media screen and (min-width: 1200px) {
                .equivalencias-content.has-selection {
                    flex-direction: row;
                    align-items: flex-start;
                }

                .equivalencias-content.has-selection ::ng-deep .raciones-card {
                    flex: 1;
                    max-width: 50%;
                    animation: slideInLeft 0.5s ease;
                }

                .equivalencias-content.has-selection ::ng-deep .equivalentes-card {
                    flex: 1;
                    max-width: 50%;
                    animation: slideInRight 0.5s ease;
                }

                /* Cuando NO hay selección, centrar la card de raciones */
                .equivalencias-content:not(.has-selection) ::ng-deep .raciones-card {
                    max-width: 1200px;
                    margin: 0 auto;
                }
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0.5;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Cards con Glassmorphism */
            ::ng-deep .raciones-card,
            ::ng-deep .equivalentes-card {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
                border-radius: 16px !important;
            }

            /* Header personalizado */
            .card-header-custom {
                background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
                padding: 1.5rem;
                border-radius: 16px 16px 0 0;
            }

            .card-header-custom h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            /* Toolbar de búsqueda */
            .search-toolbar {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }

            .search-field {
                flex: 1;
                min-width: 250px;
            }

            .search-input {
                width: 100%;
                padding: 0.75rem 1rem 0.75rem 2.5rem !important;
                border-radius: 8px;
                border: 2px solid #e0e0e0;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                border-color: var(--brand-primary);
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.1);
            }

            .results-count {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #666;
                font-size: 0.9rem;
                padding: 0.5rem 1rem;
                background: #f0f0f0;
                border-radius: 20px;
            }

            /* Tabla de Alimentos */
            .tabla-alimentos-wrapper {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 1.5rem;
            }

            .tabla-alimentos,
            .tabla-equivalentes {
                width: 100%;
                min-width: 600px;
            }

            @media screen and (min-width: 1200px) {
                .tabla-alimentos,
                .tabla-equivalentes {
                    min-width: 100%;
                }

                .tabla-alimentos-wrapper,
                .tabla-equivalentes-wrapper {
                    overflow-x: auto;
                }
            }

            .tabla-header {
                display: grid;
                grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr;
                background: linear-gradient(135deg, #ff8c42, #ff6b35);
                color: white;
                font-weight: 600;
                padding: 0;
            }

            .tabla-header > div {
                padding: 1rem;
                border-right: 1px solid rgba(255, 255, 255, 0.3);
            }

            .tabla-header > div:last-child {
                border-right: none;
            }

            .tabla-body {
                max-height: 400px;
                overflow-y: auto;
                overflow-x: auto;
            }

            /* Ajustar altura de las tablas en vista lado a lado */
            @media screen and (min-width: 1200px) {
                .tabla-body {
                    max-height: calc(100vh - 450px);
                    min-height: 400px;
                }

                ::ng-deep .raciones-card .p-card-content,
                ::ng-deep .equivalentes-card .p-card-content {
                    min-height: calc(100vh - 250px);
                    display: flex;
                    flex-direction: column;
                }

                .tabla-alimentos-wrapper,
                .tabla-equivalentes-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .tabla-alimentos,
                .tabla-equivalentes {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .tabla-alimentos .tabla-body,
                .tabla-equivalentes .tabla-body {
                    flex: 1;
                }
            }

            .tabla-row {
                display: grid;
                grid-template-columns: 2fr 1.2fr 1fr 1fr 1fr;
                border-bottom: 1px solid #e0e0e0;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .tabla-row > div {
                padding: 1rem;
                display: flex;
                align-items: center;
            }

            .tabla-row:hover {
                background: linear-gradient(135deg, rgba(146, 235, 255, 0.05), rgba(255, 166, 0, 0.05));
            }

            .tabla-row.selected {
                background: linear-gradient(135deg, rgba(146, 235, 255, 0.2), rgba(255, 166, 0, 0.2));
                font-weight: 600;
            }

            .col-nombre {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 500;
            }

            .status-indicator {
                font-size: 0.5rem;
                color: var(--brand-primary);
            }

            .categoria-badge {
                padding: 0.25rem 0.75rem;
                background: #e3f2fd;
                color: #1976d2;
                border-radius: 12px;
                font-size: 0.875rem;
                font-weight: 500;
            }

            .col-macros {
                justify-content: center;
                font-weight: 600;
                color: #666;
            }

            /* Panel de Alimento Seleccionado */
            .alimento-seleccionado-panel {
                margin-top: 1rem;
                border: 2px solid var(--brand-primary);
                border-radius: 12px;
                overflow: hidden;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .panel-header {
                background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
                padding: 1rem 1.5rem;
            }

            .panel-header h3 {
                margin: 0;
                color: white;
                font-size: 1.25rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .panel-content {
                padding: 1.5rem;
                background: white;
            }

            /* Control de Peso */
            .peso-section {
                margin-bottom: 1.5rem;
            }

            .peso-label {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 0.75rem;
                font-size: 1rem;
            }

            .peso-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }

            ::ng-deep .peso-input {
                width: 150px;
            }

            ::ng-deep .peso-input input {
                text-align: center;
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--brand-primary);
            }

            /* Tarjetas de Macros */
            .macros-section {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
            }

            .macro-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                border: 2px solid #e0e0e0;
                transition: all 0.2s ease;
            }

            .macro-card:hover {
                border-color: var(--brand-primary);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .macro-icon {
                width: 3rem;
                height: 3rem;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
            }

            .macro-icon.hidratos {
                background: linear-gradient(135deg, #ffd54f, #ffb300);
            }

            .macro-icon.proteinas {
                background: linear-gradient(135deg, #4caf50, #388e3c);
            }

            .macro-icon.grasas {
                background: linear-gradient(135deg, #ff7043, #f4511e);
            }

            .macro-info {
                display: flex;
                flex-direction: column;
            }

            .macro-label {
                font-size: 0.875rem;
                color: #666;
                font-weight: 500;
            }

            .macro-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
            }

            /* Tabla de Equivalentes */
            .tabla-equivalentes-wrapper {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            }

            .tabla-equivalentes .tabla-header {
                grid-template-columns: 2fr 1fr 0.6fr 0.6fr 0.6fr;
            }

            .tabla-row-eq {
                display: grid;
                grid-template-columns: 2fr 1fr 0.6fr 0.6fr 0.6fr;
                border-bottom: 1px solid #e0e0e0;
                transition: all 0.2s ease;
            }

            .tabla-row-eq > div {
                padding: 1rem;
                display: flex;
                align-items: center;
            }

            .tabla-row-eq:hover {
                background: linear-gradient(135deg, rgba(146, 235, 255, 0.05), rgba(255, 166, 0, 0.05));
            }

            .col-nombre-eq {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 500;
            }

            .col-peso {
                justify-content: center;
            }

            .peso-highlight {
                font-weight: 700;
                color: var(--brand-primary);
                font-size: 1.1rem;
            }

            .col-macro-eq {
                justify-content: center;
                font-weight: 600;
                color: #666;
                font-size: 0.9rem;
            }

            /* No results */
            .no-results {
                text-align: center;
                padding: 3rem 1rem;
                color: #999;
            }

            .no-results i {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: #ccc;
            }

            /* Scrollbars */
            .tabla-body::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }

            .tabla-body::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            .tabla-body::-webkit-scrollbar-thumb {
                background: var(--brand-primary);
                border-radius: 3px;
            }

            /* Responsive */
            @media screen and (max-width: 1024px) {
                .tabla-alimentos,
                .tabla-equivalentes {
                    min-width: 500px;
                }
            }

            @media screen and (max-width: 768px) {
                .equivalencias-container {
                    padding: 1rem;
                }

                .card-header-custom h2 {
                    font-size: 1.25rem;
                }

                .tabla-body {
                    max-height: 300px;
                }

                .macros-section {
                    grid-template-columns: 1fr;
                }

                .search-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }

                .results-count {
                    justify-content: center;
                }
            }

            @media screen and (max-width: 480px) {
                .card-header-custom {
                    padding: 1rem;
                }

                .card-header-custom h2 {
                    font-size: 1.1rem;
                }

                .tabla-row > div,
                .tabla-row-eq > div {
                    padding: 0.75rem 0.5rem;
                    font-size: 0.875rem;
                }

                .macro-card {
                    flex-direction: column;
                    text-align: center;
                }

                .peso-controls {
                    gap: 0.5rem;
                }

                ::ng-deep .peso-input {
                    width: 120px;
                }

                ::ng-deep .peso-input input {
                    font-size: 1.25rem;
                }
            }
        `
    ]
})
export class Equivalencias implements OnInit {
    // Señales
    alimentosFiltrados = signal<Alimento[]>([]);
    equivalentesFiltrados = signal<AlimentoEquivalente[]>([]);
    
    // Variables
    searchTerm: string = '';
    searchEquivalente: string = '';
    alimentoSeleccionado: Alimento | null = null;
    pesoSeleccionado: number = 100;
    
    // Base de datos de alimentos
    alimentos: Alimento[] = [
        { id: '1', nombre: '1 Huevo L', hidratos: 0.6, proteinas: 6.3, grasas: 5.3, categoria: 'Proteínas' },
        { id: '2', nombre: '2 huevos M', hidratos: 1.2, proteinas: 12.6, grasas: 10.6, categoria: 'Proteínas' },
        { id: '3', nombre: '3 quinoas Vivo (Blanca, roja, negra)', hidratos: 21, proteinas: 4.4, grasas: 1.9, categoria: 'Carbohidratos' },
        { id: '4', nombre: '4 Quesos rallado Hacendado', hidratos: 0, proteinas: 32, grasas: 26, categoria: 'Proteínas' },
        { id: '5', nombre: 'Açaí', hidratos: 52, proteinas: 8, grasas: 32, categoria: 'Frutas' },
        { id: '6', nombre: 'Albondigas con guisantes La cocina', hidratos: 9.6, proteinas: 9.4, grasas: 7.8, categoria: 'Platos preparados' },
        { id: '7', nombre: 'Arroz blanco', hidratos: 28, proteinas: 2.7, grasas: 0.3, categoria: 'Carbohidratos' },
        { id: '8', nombre: 'Arroz integral', hidratos: 23, proteinas: 2.6, grasas: 0.9, categoria: 'Carbohidratos' },
        { id: '9', nombre: 'Atún al natural', hidratos: 0, proteinas: 23, grasas: 0.6, categoria: 'Proteínas' },
        { id: '10', nombre: 'Avena', hidratos: 59, proteinas: 13, grasas: 7, categoria: 'Carbohidratos' },
        { id: '11', nombre: 'Pechuga de pollo', hidratos: 0, proteinas: 23, grasas: 1.2, categoria: 'Proteínas' },
        { id: '12', nombre: 'Pechuga de pavo', hidratos: 0, proteinas: 24, grasas: 1, categoria: 'Proteínas' },
        { id: '13', nombre: 'Pasta integral', hidratos: 25, proteinas: 3, grasas: 0.6, categoria: 'Carbohidratos' },
        { id: '14', nombre: 'Batata/Boniato', hidratos: 20, proteinas: 1.6, grasas: 0.1, categoria: 'Carbohidratos' },
        { id: '15', nombre: 'Lentejas', hidratos: 20, proteinas: 9, grasas: 0.4, categoria: 'Legumbres' },
        { id: '16', nombre: 'Garbanzos', hidratos: 19, proteinas: 8.9, grasas: 2.6, categoria: 'Legumbres' },
        { id: '17', nombre: 'Plátano', hidratos: 23, proteinas: 1.1, grasas: 0.3, categoria: 'Frutas' },
        { id: '18', nombre: 'Manzana', hidratos: 14, proteinas: 0.3, grasas: 0.2, categoria: 'Frutas' },
        { id: '19', nombre: 'Salmón', hidratos: 0, proteinas: 20, grasas: 13, categoria: 'Proteínas' },
        { id: '20', nombre: 'Yogur griego natural', hidratos: 4, proteinas: 10, grasas: 5, categoria: 'Lácteos' }
    ];

    ngOnInit() {
        // Inicializar con todos los alimentos
        this.alimentosFiltrados.set(this.alimentos);
    }

    filtrarAlimentos() {
        if (!this.searchTerm.trim()) {
            this.alimentosFiltrados.set(this.alimentos);
            return;
        }
        
        const term = this.searchTerm.toLowerCase();
        const filtrados = this.alimentos.filter(a => 
            a.nombre.toLowerCase().includes(term) ||
            a.categoria.toLowerCase().includes(term)
        );
        this.alimentosFiltrados.set(filtrados);
    }

    seleccionarAlimento(alimento: Alimento) {
        this.alimentoSeleccionado = alimento;
        this.calcularEquivalencias();
    }

    incrementarPeso() {
        this.pesoSeleccionado += 10;
        this.calcularEquivalencias();
    }

    decrementarPeso() {
        if (this.pesoSeleccionado > 10) {
            this.pesoSeleccionado -= 10;
            this.calcularEquivalencias();
        }
    }

    hidratosCalculados(): number {
        if (!this.alimentoSeleccionado) return 0;
        return Number(((this.alimentoSeleccionado.hidratos * this.pesoSeleccionado) / 100).toFixed(1));
    }

    proteinasCalculadas(): number {
        if (!this.alimentoSeleccionado) return 0;
        return Number(((this.alimentoSeleccionado.proteinas * this.pesoSeleccionado) / 100).toFixed(1));
    }

    grasasCalculadas(): number {
        if (!this.alimentoSeleccionado) return 0;
        return Number(((this.alimentoSeleccionado.grasas * this.pesoSeleccionado) / 100).toFixed(1));
    }

    calcularEquivalencias() {
        if (!this.alimentoSeleccionado || this.pesoSeleccionado <= 0) {
            this.equivalentesFiltrados.set([]);
            return;
        }

        const hidratosObjetivo = this.hidratosCalculados();
        const proteinasObjetivo = this.proteinasCalculadas();
        const grasasObjetivo = this.grasasCalculadas();

        const equivalentes: AlimentoEquivalente[] = this.alimentos
            .filter(a => a.id !== this.alimentoSeleccionado!.id)
            .map(alimento => {
                const totalMacrosObjetivo = hidratosObjetivo + proteinasObjetivo + grasasObjetivo;
                const totalMacrosPor100g = alimento.hidratos + alimento.proteinas + alimento.grasas;
                
                const pesoEquivalente = totalMacrosPor100g > 0 
                    ? (totalMacrosObjetivo / totalMacrosPor100g) * 100
                    : 0;

                return {
                    alimento,
                    pesoEquivalente
                };
            })
            .filter(equiv => equiv.pesoEquivalente > 0)
            .sort((a, b) => a.pesoEquivalente - b.pesoEquivalente);

        this.equivalentesFiltrados.set(equivalentes);
    }

    filtrarEquivalentes() {
        if (!this.alimentoSeleccionado || this.pesoSeleccionado <= 0) {
            return;
        }

        const hidratosObjetivo = this.hidratosCalculados();
        const proteinasObjetivo = this.proteinasCalculadas();
        const grasasObjetivo = this.grasasCalculadas();

        let equivalentes: AlimentoEquivalente[] = this.alimentos
            .filter(a => a.id !== this.alimentoSeleccionado!.id)
            .map(alimento => {
                const totalMacrosObjetivo = hidratosObjetivo + proteinasObjetivo + grasasObjetivo;
                const totalMacrosPor100g = alimento.hidratos + alimento.proteinas + alimento.grasas;
                
                const pesoEquivalente = totalMacrosPor100g > 0 
                    ? (totalMacrosObjetivo / totalMacrosPor100g) * 100
                    : 0;

                return {
                    alimento,
                    pesoEquivalente
                };
            })
            .filter(equiv => equiv.pesoEquivalente > 0);

        if (this.searchEquivalente.trim()) {
            const term = this.searchEquivalente.toLowerCase();
            equivalentes = equivalentes.filter(equiv => 
                equiv.alimento.nombre.toLowerCase().includes(term) ||
                equiv.alimento.categoria.toLowerCase().includes(term)
            );
        }

        equivalentes.sort((a, b) => a.pesoEquivalente - b.pesoEquivalente);
        this.equivalentesFiltrados.set(equivalentes);
    }

    calcularMacro(valorPor100g: number, peso: number): string {
        return ((valorPor100g * peso) / 100).toFixed(1);
    }
}

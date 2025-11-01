import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';

// Interfaces para los datos
interface Usuario {
    id?: string;
    nombre?: string;
    email?: string;
    telefono?: string;
    edad?: number;
    peso?: number;
    altura?: number;
    objetivo?: string;
    activo?: boolean;
}

interface Racion {
    id?: string;
    nombre?: string;
    alimento?: string;
    cantidad?: number;
    unidad?: string;
    calorias?: number;
    proteinas?: number;
    carbohidratos?: number;
    grasas?: number;
    categoria?: string;
}

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        TabsModule,
        CardModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="configuracion-container">
            <p-card>
                <p-tabs [value]="activeTab">
                    <p-tablist>
                        <p-tab value="0">Správa uživatelů</p-tab>
                        <p-tab value="1">Správa porcí</p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <!-- Panel de Usuarios -->
                        <p-tabpanel value="0">
                            <div class="usuarios-section">
                                <p-toast />
                                <p-confirmDialog />

                                <p-toolbar styleClass="mb-4 gap-2">
                                    <ng-template pTemplate="left">
                                        <p-iconField iconPosition="left">
                                            <p-inputIcon>
                                                <i class="pi pi-search"></i>
                                            </p-inputIcon>
                                            <input pInputText type="text" #filterUsuarios (input)="dtUsuarios.filterGlobal($event.target.value, 'contains')" placeholder="Hledat..." />
                                        </p-iconField>
                                    </ng-template>
                                    <ng-template pTemplate="right">
                                        <p-button severity="success" label="Nový uživatel" icon="pi pi-plus" class="mr-2" (onClick)="openNewUsuario()" />
                                        <p-button severity="danger" label="Smazat" icon="pi pi-trash" (onClick)="deleteSelectedUsuarios()" [disabled]="!selectedUsuarios || !selectedUsuarios.length" />
                                    </ng-template>
                                </p-toolbar>

                                <p-table
                                    #dtUsuarios
                                    [value]="usuarios()"
                                    [rows]="10"
                                    [paginator]="true"
                                    [globalFilterFields]="['nombre', 'email', 'telefono']"
                                    [(selection)]="selectedUsuarios"
                                    [rowHover]="true"
                                    dataKey="id"
                                    currentPageReportTemplate="Zobrazeno {first} až {last} z {totalRecords} uživatelů"
                                    [showCurrentPageReport]="true"
                                    [scrollable]="true"
                                    scrollHeight="flex"
                                >
                                    <ng-template pTemplate="header">
                                        <tr>
                                            <th style="width: 3rem">
                                                <p-tableHeaderCheckbox />
                                            </th>
                                            <th pSortableColumn="nombre" style="width: 30%">Jméno <p-sortIcon field="nombre" /></th>
                                            <th pSortableColumn="email" style="width: 50%">Email <p-sortIcon field="email" /></th>
                                            <th pSortableColumn="activo" style="width: calc(20% - 3rem)">Stav <p-sortIcon field="activo" /></th>
                                        </tr>
                                    </ng-template>

                                    <ng-template pTemplate="body" let-usuario>
                                        <tr style="cursor: pointer;">
                                            <td (click)="$event.stopPropagation()">
                                                <p-tableCheckbox [value]="usuario" />
                                            </td>
                                            <td (click)="editUsuario(usuario)">
                                                {{ usuario.nombre }}
                                            </td>
                                            <td (click)="editUsuario(usuario)">
                                                {{ usuario.email }}
                                            </td>
                                            <td (click)="editUsuario(usuario)">
                                                <p-tag [value]="usuario.activo ? 'Aktivní' : 'Neaktivní'" [severity]="usuario.activo ? 'success' : 'danger'" />
                                            </td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </p-tabpanel>

                        <!-- Panel de Raciones -->
                        <p-tabpanel value="1">
                            <div class="raciones-section">
                                <p-toolbar styleClass="mb-4 gap-2">
                                    <ng-template pTemplate="left">
                                        <p-iconField iconPosition="left">
                                            <p-inputIcon>
                                                <i class="pi pi-search"></i>
                                            </p-inputIcon>
                                            <input pInputText type="text" #filterRaciones (input)="dtRaciones.filterGlobal($event.target.value, 'contains')" placeholder="Hledat..." />
                                        </p-iconField>
                                    </ng-template>
                                    <ng-template pTemplate="right">
                                        <p-button severity="success" label="Nová porce" icon="pi pi-plus" class="mr-2" (onClick)="openNewRacion()" />
                                        <p-button severity="danger" label="Smazat" icon="pi pi-trash" (onClick)="deleteSelectedRaciones()" [disabled]="!selectedRaciones || !selectedRaciones.length" />
                                    </ng-template>
                                </p-toolbar>

                                <p-table
                                    #dtRaciones
                                    [value]="raciones()"
                                    [rows]="10"
                                    [paginator]="true"
                                    [globalFilterFields]="['nombre', 'alimento', 'categoria']"
                                    [tableStyle]="{ 'min-width': '100%' }"
                                    [(selection)]="selectedRaciones"
                                    [rowHover]="true"
                                    dataKey="id"
                                    currentPageReportTemplate="Zobrazeno {first} až {last} z {totalRecords} porcí"
                                    [showCurrentPageReport]="true"
                                    [scrollable]="true"
                                    scrollHeight="flex"
                                >
                                    <ng-template pTemplate="header">
                                        <tr>
                                            <th style="width: 3rem">
                                                <p-tableHeaderCheckbox />
                                            </th>
                                            <th pSortableColumn="nombre" style="width: 18%">Název <p-sortIcon field="nombre" /></th>
                                            <th pSortableColumn="alimento" style="width: 20%">Potravina <p-sortIcon field="alimento" /></th>
                                            <th pSortableColumn="cantidad" style="width: 12%">Množství <p-sortIcon field="cantidad" /></th>
                                            <th pSortableColumn="calorias" style="width: 12%">Kalorie <p-sortIcon field="calorias" /></th>
                                            <th pSortableColumn="proteinas" style="width: 12%">Bílkoviny <p-sortIcon field="proteinas" /></th>
                                            <th pSortableColumn="categoria" style="width: calc(26% - 3rem)">Kategorie <p-sortIcon field="categoria" /></th>
                                        </tr>
                                    </ng-template>

                                    <ng-template pTemplate="body" let-racion>
                                        <tr style="cursor: pointer;">
                                            <td (click)="$event.stopPropagation()">
                                                <p-tableCheckbox [value]="racion" />
                                            </td>
                                            <td (click)="editRacion(racion)">
                                                <span class="p-column-title">Název</span>
                                                {{ racion.nombre }}
                                            </td>
                                            <td (click)="editRacion(racion)">
                                                <span class="p-column-title">Potravina</span>
                                                {{ racion.alimento }}
                                            </td>
                                            <td (click)="editRacion(racion)">
                                                <span class="p-column-title">Množství</span>
                                                {{ racion.cantidad }} {{ racion.unidad }}
                                            </td>
                                            <td (click)="editRacion(racion)">
                                                <span class="p-column-title">Kalorie</span>
                                                {{ racion.calorias }} kcal
                                            </td>
                                            <td (click)="editRacion(racion)">
                                                <span class="p-column-title">Bílkoviny</span>
                                                {{ racion.proteinas }}g
                                            </td>
                                            <td (click)="editRacion(racion)">
                                                <span class="p-column-title">Kategorie</span>
                                                <p-tag [value]="racion.categoria" [severity]="getCategoriaSeverity(racion.categoria)" />
                                            </td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </p-card>
        </div>

        <!-- Diálogo para Usuarios -->
        <p-dialog [(visible)]="usuarioDialog" [style]="{ width: '450px' }" header="Detail uživatele" [modal]="true" [draggable]="false" [resizable]="false" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <div class="field">
                    <label for="nombre">Jméno</label>
                    <input type="text" pInputText id="nombre" [(ngModel)]="usuario.nombre" required autofocus />
                    <small class="p-error" *ngIf="submitted && !usuario.nombre">Jméno je povinné.</small>
                </div>

                <div class="field">
                    <label for="email">Email</label>
                    <input type="email" pInputText id="email" [(ngModel)]="usuario.email" required />
                    <small class="p-error" *ngIf="submitted && !usuario.email">Email je povinný.</small>
                </div>

                <div class="field">
                    <label for="telefono">Telefon</label>
                    <input type="text" pInputText id="telefono" [(ngModel)]="usuario.telefono" />
                </div>

                <div class="formgrid grid">
                    <div class="field col">
                        <label for="edad">Věk</label>
                        <p-inputNumber id="edad" [(ngModel)]="usuario.edad" [showButtons]="true" [min]="0" [max]="120" />
                    </div>
                    <div class="field col">
                        <label for="peso">Váha (kg)</label>
                        <p-inputNumber id="peso" [(ngModel)]="usuario.peso" [showButtons]="true" [min]="0" [max]="300" mode="decimal" [minFractionDigits]="1" [maxFractionDigits]="2" />
                    </div>
                    <div class="field col">
                        <label for="altura">Výška (cm)</label>
                        <p-inputNumber id="altura" [(ngModel)]="usuario.altura" [showButtons]="true" [min]="0" [max]="250" />
                    </div>
                </div>

                <div class="field">
                    <label for="objetivo">Cíl</label>
                    <p-select id="objetivo" [(ngModel)]="usuario.objetivo" [options]="objetivos" optionLabel="label" optionValue="value" placeholder="Vyberte cíl" />
                </div>

                <div class="field">
                    <label for="activo">Stav</label>
                    <div class="flex align-items-center gap-3">
                        <p-radioButton name="activo" value="true" [(ngModel)]="usuario.activo" inputId="activo1" />
                        <label for="activo1">Aktivní</label>

                        <p-radioButton name="activo" value="false" [(ngModel)]="usuario.activo" inputId="activo2" />
                        <label for="activo2">Neaktivní</label>
                    </div>
                </div>
            </ng-template>

            <ng-template pTemplate="footer">
                <p-button label="Zrušit" icon="pi pi-times" [text]="true" (onClick)="hideUsuarioDialog()" />
                <p-button label="Uložit" icon="pi pi-check" (onClick)="saveUsuario()" />
            </ng-template>
        </p-dialog>

        <!-- Diálogo para Raciones -->
        <p-dialog [(visible)]="racionDialog" [style]="{ width: '550px' }" header="Detail porce" [modal]="true" [draggable]="false" [resizable]="false" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <div class="field">
                    <label for="nombreRacion">Název porce</label>
                    <input type="text" pInputText id="nombreRacion" [(ngModel)]="racion.nombre" required autofocus />
                    <small class="p-error" *ngIf="submitted && !racion.nombre">Název je povinný.</small>
                </div>

                <div class="field">
                    <label for="alimento">Potravina</label>
                    <input type="text" pInputText id="alimento" [(ngModel)]="racion.alimento" required />
                    <small class="p-error" *ngIf="submitted && !racion.alimento">Potravina je povinná.</small>
                </div>

                <div class="formgrid grid">
                    <div class="field col">
                        <label for="cantidad">Množství</label>
                        <p-inputNumber id="cantidad" [(ngModel)]="racion.cantidad" [showButtons]="true" [min]="0" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2" />
                    </div>
                    <div class="field col">
                        <label for="unidad">Jednotka</label>
                        <p-select id="unidad" [(ngModel)]="racion.unidad" [options]="unidades" optionLabel="label" optionValue="value" placeholder="Vyberte" />
                    </div>
                </div>

                <div class="formgrid grid">
                    <div class="field col">
                        <label for="calorias">Kalorie (kcal)</label>
                        <p-inputNumber id="calorias" [(ngModel)]="racion.calorias" [showButtons]="true" [min]="0" />
                    </div>
                    <div class="field col">
                        <label for="proteinas">Bílkoviny (g)</label>
                        <p-inputNumber id="proteinas" [(ngModel)]="racion.proteinas" [showButtons]="true" [min]="0" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2" />
                    </div>
                </div>

                <div class="formgrid grid">
                    <div class="field col">
                        <label for="carbohidratos">Sacharidy (g)</label>
                        <p-inputNumber id="carbohidratos" [(ngModel)]="racion.carbohidratos" [showButtons]="true" [min]="0" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2" />
                    </div>
                    <div class="field col">
                        <label for="grasas">Tuky (g)</label>
                        <p-inputNumber id="grasas" [(ngModel)]="racion.grasas" [showButtons]="true" [min]="0" mode="decimal" [minFractionDigits]="0" [maxFractionDigits]="2" />
                    </div>
                </div>

                <div class="field">
                    <label for="categoria">Kategorie</label>
                    <p-select id="categoria" [(ngModel)]="racion.categoria" [options]="categorias" optionLabel="label" optionValue="value" placeholder="Vyberte kategorii" />
                </div>
            </ng-template>

            <ng-template pTemplate="footer">
                <p-button label="Zrušit" icon="pi pi-times" [text]="true" (onClick)="hideRacionDialog()" />
                <p-button label="Uložit" icon="pi pi-check" (onClick)="saveRacion()" />
            </ng-template>
        </p-dialog>

        <!-- Diálogo de Confirmación para eliminaciones -->
        <p-confirmDialog [style]="{ width: '450px' }" />
    `,
    styles: [
        `
            .configuracion-container {
                height: calc(100vh - 6rem);
                display: flex;
                flex-direction: column;
            }

            ::ng-deep .configuracion-container .p-card {
                height: 100%;
                display: flex;
                flex-direction: column;
                backdrop-filter: unset !important;
                background: rgba(15, 23, 42, 0.7098039216) !important;
            }

            ::ng-deep .p-tablist-tab-list {
                background: rgba(15, 23, 42, 0.768627451) !important;
            }

            ::ng-deep .configuracion-container .p-card .p-card-body {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: unset;
            }

            ::ng-deep .configuracion-container .p-card .p-card-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            ::ng-deep .configuracion-container .p-tabs {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            ::ng-deep .configuracion-container .p-tabpanels {
                flex: 1;
                overflow: auto;
                background: unset;
                padding: 1rem 1rem 0.5rem 1rem !important;
            }

            ::ng-deep .p-tab-active {
                background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%) !important;
                color: var(--color-black) !important;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }

            ::ng-deep .p-tablist-tab-list {
                border-color: unset !important;
            }

            ::ng-deep .p-toolbar {
                background: transparent !important;
                border: 1px solid var(--brand-secondary) !important;
            }

            /* Input de búsqueda en toolbar con mismo estilo que login */
            ::ng-deep .p-toolbar .p-inputtext {
                background: rgba(15, 23, 42, 0.768627451) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                transition: all 0.3s ease !important;
                color: #ffffff !important;
            }

            ::ng-deep .p-toolbar .p-inputtext::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
            }

            ::ng-deep .p-toolbar .p-inputtext:hover {
                border-color: rgba(28, 169, 244, 0.5) !important;
                background: rgba(255, 255, 255, 0.2) !important;
            }

            ::ng-deep .p-toolbar .p-inputtext:focus {
                border-color: var(--brand-primary) !important;
                background: rgba(255, 255, 255, 0.25) !important;
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
            }

            /* Icono de búsqueda */
            ::ng-deep .p-toolbar .p-icon-field .p-input-icon {
                color: rgba(255, 255, 255, 0.7) !important;
            }

            .usuarios-section,
            .raciones-section {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            ::ng-deep .usuarios-section .p-table,
            ::ng-deep .raciones-section .p-table {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            ::ng-deep .p-datatable {
                display: grid;
                grid-template-rows: auto 1fr auto;
                height: 100%;
                overflow: hidden;
            }

            ::ng-deep .p-datatable .p-datatable-header {
                grid-row: 1;
            }

            ::ng-deep .p-datatable .p-datatable-wrapper {
                grid-row: 2;
                position: relative;
                min-height: 0;
                display: grid;
                grid-template-rows: 1fr;
                overflow-x: hidden;
                overflow-y: auto;
            }

            ::ng-deep .p-datatable-thead > tr > th {
                background: var(--code-background) !important;
            }

            ::ng-deep .p-datatable-tbody > tr {
                color: var(--brand-secondary);
            }
            ::ng-deep .p-datatable-tbody > tr:hover {
                color: var(--brand-secondary);
            }

            ::ng-deep .p-datatable-hoverable .p-datatable-tbody > tr:not(.p-datatable-row-selected):hover {
                color: var(--brand-primary) !important;
                background: #30303036 !important;
            }

            ::ng-deep .p-datatable-tbody > tr {
                color: var(--brand-secondary) !important;
            }

            ::ng-deep .p-datatable-thead > tr > th {
                color: var(--brand-primary) !important;
                font-weight: 600 !important;
            }

            ::ng-deep .p-datatable-tbody > tr {
                background: rgb(10 8 7 / 57%) !important;
                transition: all 0.3s ease;
            }

            ::ng-deep .p-datatable-tbody > tr:hover {
                background: rgba(0, 180, 216, 0.15) !important;
                transform: scale(1.01);
            }

            ::ng-deep .p-datatable .p-datatable-table {
                width: 99%;
                box-sizing: border-box;
            }

            ::ng-deep .p-datatable .p-datatable-thead > tr > th,
            ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
                box-sizing: border-box;
            }

            /* Scrollbar personalizada */
            .configuracion-container ::ng-deep .p-datatable-wrapper::-webkit-scrollbar {
                height: 10px !important;
                width: 10px !important;
            }

            .configuracion-container ::ng-deep .p-datatable-wrapper::-webkit-scrollbar-track {
                background: rgba(0, 180, 216, 0.2) !important;
                border-radius: 6px !important;
            }

            .configuracion-container ::ng-deep .p-datatable-wrapper::-webkit-scrollbar-thumb {
                background: #00b4d8 !important;
                border-radius: 6px !important;
            }

            .configuracion-container ::ng-deep .p-datatable-wrapper::-webkit-scrollbar-thumb:hover {
                background: #92ebff !important;
            }

            /* Alternativa más general */
            ::-webkit-scrollbar {
                height: 10px !important;
                width: 10px !important;
            }

            ::-webkit-scrollbar-track {
                background: rgba(0, 180, 216, 0.2) !important;
                border-radius: 6px !important;
            }

            ::-webkit-scrollbar-thumb {
                background: #00b4d8 !important;
                border-radius: 6px !important;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #92ebff !important;
            }

            ::ng-deep .p-datatable .p-paginator {
                margin-top: auto;
                border-top: 1px solid var(--surface-border);
                background: unset !important;
            }

            /* Estilos responsive para el paginador */
            ::ng-deep .p-paginator {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                background: transparent;
            }

            ::ng-deep .p-paginator .p-paginator-current {
                display: none !important;
            }

            ::ng-deep .p-paginator .p-paginator-left-content,
            ::ng-deep .p-paginator .p-paginator-right-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            /* Checkbox de la tabla con estilo glassmorphism */
            ::ng-deep .p-checkbox .p-checkbox-box {
                background: rgba(255, 255, 255, 0.15) !important;
                backdrop-filter: blur(10px) saturate(180%) !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;
                transition: all 0.3s ease !important;
            }

            ::ng-deep .p-checkbox .p-checkbox-box:hover {
                border-color: #92ebff !important;
                box-shadow:
                    0 0 12px rgba(146, 235, 255, 0.4),
                    inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }

            ::ng-deep .p-checkbox .p-checkbox-box.p-focus {
                border-color: #92ebff !important;
                box-shadow:
                    0 0 12px rgba(146, 235, 255, 0.6),
                    inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }

            ::ng-deep .p-checkbox .p-checkbox-box.p-highlight {
                background: rgba(146, 235, 255, 0.4) !important;
                border-color: #92ebff !important;
                box-shadow:
                    0 0 12px rgba(146, 235, 255, 0.6),
                    inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }

            ::ng-deep .p-checkbox .p-checkbox-box.p-highlight:hover {
                background: rgba(146, 235, 255, 0.5) !important;
                box-shadow:
                    0 0 15px rgba(146, 235, 255, 0.8),
                    inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }

            ::ng-deep .p-checkbox .p-checkbox-box .p-checkbox-icon {
                color: #000000 !important;
                font-weight: 700 !important;
            }

            ::ng-deep .p-checkbox .p-checkbox-box.p-highlight .p-checkbox-icon {
                color: #000000 !important;
            }

            ::ng-deep .p-checkbox-checked .p-checkbox-box {
                background: var(--brand-secondary) !important;
                border-color: var(--brand-secondary) !important;
            }

            ::ng-deep .p-checkbox-checked .p-checkbox-box:hover {
                background: var(--brand-primary) !important;
                border-color: var(--brand-primary) !important;
            }

            ::ng-deep .p-paginator .p-paginator-first,
            ::ng-deep .p-paginator .p-paginator-prev,
            ::ng-deep .p-paginator .p-paginator-next,
            ::ng-deep .p-paginator .p-paginator-last {
                width: 2.5rem;
                height: 2.5rem;
                min-width: 2.5rem;
                display: flex;
                color: var(--brand-secondary);
                align-items: center;
                justify-content: center;
            }

            ::ng-deep .p-paginator-page.p-paginator-page-selected {
                background: var(--brand-secondary) !important;
                color: black !important;
                font-weight: 600;
            }

            ::ng-deep .p-paginator .p-paginator-pages {
                display: flex;
                gap: 0.25rem;
                align-items: center;
            }

            ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
                width: 2.5rem;
                height: 2.5rem;
                min-width: 2.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media screen and (max-width: 768px) {
                /* Ocultar texto de botones en toolbar, mostrar solo iconos */
                ::ng-deep .p-toolbar .p-button .p-button-label {
                    display: none !important;
                }

                ::ng-deep .p-toolbar .p-button {
                    padding: 0.75rem !important;
                    min-width: auto !important;
                }

                ::ng-deep .p-paginator {
                    padding: 0.75rem 0.5rem;
                    gap: 0.5rem;
                }

                ::ng-deep .p-paginator .p-paginator-first,
                ::ng-deep .p-paginator .p-paginator-prev,
                ::ng-deep .p-paginator .p-paginator-next,
                ::ng-deep .p-paginator .p-paginator-last {
                    width: 2.25rem !important;
                    height: 2.25rem !important;
                    min-width: 2.25rem !important;
                }

                ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
                    width: 2.25rem !important;
                    height: 2.25rem !important;
                    min-width: 2.25rem !important;
                    font-size: 0.875rem;
                }

                ::ng-deep .p-paginator .p-dropdown {
                    display: none !important;
                }
            }

            @media screen and (max-width: 480px) {
                ::ng-deep .p-paginator {
                    padding: 0.6rem 0.4rem;
                    gap: 0.4rem;
                }

                ::ng-deep .p-paginator .p-paginator-first,
                ::ng-deep .p-paginator .p-paginator-last {
                    display: none !important;
                }

                ::ng-deep .p-paginator .p-paginator-prev,
                ::ng-deep .p-paginator .p-paginator-next {
                    width: 2rem !important;
                    height: 2rem !important;
                    min-width: 2rem !important;
                }

                ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
                    width: 2rem !important;
                    height: 2rem !important;
                    min-width: 2rem !important;
                    font-size: 0.8rem;
                }
            }

            @media screen and (max-width: 375px) {
                ::ng-deep .p-paginator {
                    padding: 0.5rem 0.25rem;
                    gap: 0.3rem;
                }

                ::ng-deep .p-paginator .p-paginator-prev,
                ::ng-deep .p-paginator .p-paginator-next {
                    width: 1.75rem !important;
                    height: 1.75rem !important;
                    min-width: 1.75rem !important;
                }

                ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
                    width: 1.75rem !important;
                    height: 1.75rem !important;
                    min-width: 1.75rem !important;
                    font-size: 0.75rem;
                }
            }

            /* Personalizar las pestañas con colores de marca */
            ::ng-deep .p-tabs .p-tablist .p-tab[data-pc-state='active'] {
                background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%) !important;
                border-color: var(--brand-primary) !important;
                color: white !important;
            }

            ::ng-deep .p-tab:not(.p-tab-active):not(.p-disabled):hover {
                background: #44444475 !important;
                color: var(--brand-primary) !important;
            }

            /* Botones con colores de marca */
            ::ng-deep .p-button.p-button-success {
                background: var(--brand-success) !important;
                border: none !important;
            }

            ::ng-deep .p-button.p-button-success:hover {
                background: var(--brand-success) !important;
                filter: brightness(1.1);
            }

            /* Diálogos - Estilo glassmorphism oscuro como equivalencias */
            ::ng-deep .p-dialog {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                margin: 0 !important;
                max-height: 90vh;
                overflow: hidden;
                border-radius: 16px;
                background: rgba(15, 23, 42, 0.85) !important;
                backdrop-filter: blur(20px) !important;
                border: 2px solid var(--brand-primary);
                box-shadow:
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 0 60px rgba(146, 235, 255, 0.2);
            }

            ::ng-deep .p-dialog .p-dialog-header {
                cursor: default !important;
                padding: 1.5rem;
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(146, 235, 255, 0.3);
                color: var(--brand-primary);
                border-top-left-radius: 14px;
                border-top-right-radius: 14px;
            }

            ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--brand-primary);
                text-shadow: 0 0 20px rgba(146, 235, 255, 0.3);
            }

            ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon {
                color: var(--brand-primary) !important;
                width: 2rem;
                height: 2rem;
                transition: all 0.2s;
            }

            ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon:hover {
                background: rgba(146, 235, 255, 0.2) !important;
                color: var(--brand-secondary) !important;
            }

            ::ng-deep .p-dialog .p-dialog-content {
                max-height: calc(90vh - 180px);
                overflow-y: auto;
                padding: 1.5rem;
                background: rgba(15, 23, 42, 0.4);
                backdrop-filter: blur(10px);
            }

            /* Estilos de campos del formulario - Glassmorphism */
            ::ng-deep .p-dialog .field {
                margin-bottom: 1.5rem;
            }

            ::ng-deep .p-dialog .field label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--brand-primary);
                font-size: 0.875rem;
                text-shadow: 0 0 10px rgba(146, 235, 255, 0.2);
            }

            ::ng-deep .p-dialog .field input,
            ::ng-deep .p-dialog .field .p-inputtext,
            ::ng-deep .p-dialog .field .p-inputnumber-input {
                width: 100%;
                padding: 0.75rem;
                font-size: 1rem;
                background: rgba(15, 23, 42, 0.6) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(146, 235, 255, 0.3) !important;
                border-radius: 8px;
                color: #ffffff !important;
                transition: all 0.3s ease;
            }

            ::ng-deep .p-dialog .field input::placeholder,
            ::ng-deep .p-dialog .field .p-inputtext::placeholder {
                color: rgba(255, 255, 255, 0.5) !important;
            }

            ::ng-deep .p-dialog .field input:hover,
            ::ng-deep .p-dialog .field .p-inputtext:hover,
            ::ng-deep .p-dialog .field .p-inputnumber-input:hover {
                border-color: rgba(146, 235, 255, 0.5) !important;
                background: rgba(255, 255, 255, 0.15) !important;
            }

            ::ng-deep .p-dialog .field input:focus,
            ::ng-deep .p-dialog .field .p-inputtext:focus,
            ::ng-deep .p-dialog .field .p-inputnumber-input:focus {
                outline: 0;
                border-color: var(--brand-primary) !important;
                background: rgba(255, 255, 255, 0.2) !important;
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
            }

            ::ng-deep .p-dialog .field .p-inputnumber {
                width: 100%;
            }

            ::ng-deep .p-dialog .field .p-select {
                width: 100%;
            }

            ::ng-deep .p-dialog .field .p-select .p-select-label {
                padding: 0.75rem;
                background: rgba(15, 23, 42, 0.6) !important;
                border: 1px solid rgba(146, 235, 255, 0.3) !important;
                color: #ffffff !important;
            }

            ::ng-deep .p-dialog .field .p-select:hover .p-select-label {
                border-color: rgba(146, 235, 255, 0.5) !important;
                background: rgba(255, 255, 255, 0.15) !important;
            }

            ::ng-deep .p-dialog .field .p-select-open .p-select-label {
                border-color: var(--brand-primary) !important;
                background: rgba(255, 255, 255, 0.2) !important;
            }

            ::ng-deep .p-dialog .field small.p-error {
                display: block;
                margin-top: 0.25rem;
                color: #ff6b6b;
                font-size: 0.75rem;
                text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
            }

            /* InputNumber buttons - Glassmorphism */
            ::ng-deep .p-dialog .p-inputnumber-button {
                width: 2.5rem;
                background: rgba(146, 235, 255, 0.2) !important;
                border: 1px solid rgba(146, 235, 255, 0.4) !important;
                color: var(--brand-primary) !important;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            ::ng-deep .p-dialog .p-inputnumber-button:hover {
                background: rgba(146, 235, 255, 0.3) !important;
                border-color: var(--brand-primary) !important;
                box-shadow: 0 0 10px rgba(146, 235, 255, 0.3);
            }

            ::ng-deep .p-dialog .p-inputnumber-button .p-icon {
                color: var(--brand-primary) !important;
            }

            /* Radio buttons - Glassmorphism */
            ::ng-deep .p-dialog .p-radiobutton {
                width: 1.25rem;
                height: 1.25rem;
            }

            ::ng-deep .p-dialog .p-radiobutton .p-radiobutton-box {
                width: 1.25rem;
                height: 1.25rem;
                background: rgba(15, 23, 42, 0.6) !important;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(146, 235, 255, 0.4);
                transition: all 0.3s ease;
            }

            ::ng-deep .p-dialog .p-radiobutton .p-radiobutton-box.p-highlight {
                border-color: var(--brand-primary);
                background: rgba(146, 235, 255, 0.3) !important;
                box-shadow: 0 0 10px rgba(146, 235, 255, 0.4);
            }

            ::ng-deep .p-dialog .p-radiobutton .p-radiobutton-box.p-highlight .p-radiobutton-icon {
                background: var(--brand-primary);
                box-shadow: 0 0 10px rgba(146, 235, 255, 0.6);
            }

            ::ng-deep .p-dialog .p-radiobutton:not(.p-radiobutton-disabled):has(.p-radiobutton-input:hover) .p-radiobutton-box {
                border-color: var(--brand-primary);
                box-shadow: 0 0 8px rgba(146, 235, 255, 0.3);
            }

            /* Footer del diálogo - Glassmorphism */
            ::ng-deep .p-dialog .p-dialog-footer {
                padding: 1rem 1.5rem;
                background: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(10px);
                border-top: 1px solid rgba(146, 235, 255, 0.3);
                border-bottom-left-radius: 14px;
                border-bottom-right-radius: 14px;
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }

            ::ng-deep .p-dialog .p-dialog-footer .p-button {
                padding: 0.75rem 1.5rem;
                font-weight: 600;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            ::ng-deep .p-dialog .p-dialog-footer .p-button:not(.p-button-text) {
                background: rgba(146, 235, 255, 0.25) !important;
                backdrop-filter: blur(10px);
                border: 1px solid var(--brand-primary) !important;
                color: var(--brand-primary) !important;
                box-shadow: 0 0 10px rgba(146, 235, 255, 0.2);
            }

            ::ng-deep .p-dialog .p-dialog-footer .p-button:not(.p-button-text):hover {
                background: rgba(146, 235, 255, 0.4) !important;
                border-color: var(--brand-secondary) !important;
                color: var(--brand-secondary) !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(146, 235, 255, 0.4);
            }

            ::ng-deep .p-dialog .p-dialog-footer .p-button.p-button-text {
                color: rgba(255, 255, 255, 0.7);
                background: transparent !important;
            }

            ::ng-deep .p-dialog .p-dialog-footer .p-button.p-button-text:hover {
                background: rgba(146, 235, 255, 0.15) !important;
                color: var(--brand-primary);
            }

            /* Grid de campos */
            ::ng-deep .p-dialog .formgrid.grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            ::ng-deep .p-dialog .formgrid.grid .field {
                margin-bottom: 0;
            }

            /* Scrollbar del contenido del diálogo - Glassmorphism */
            ::ng-deep .p-dialog .p-dialog-content::-webkit-scrollbar {
                width: 8px;
            }

            ::ng-deep .p-dialog .p-dialog-content::-webkit-scrollbar-track {
                background: rgba(0, 180, 216, 0.15);
                border-radius: 4px;
            }

            ::ng-deep .p-dialog .p-dialog-content::-webkit-scrollbar-thumb {
                background: var(--brand-primary);
                border-radius: 4px;
                box-shadow: 0 0 6px rgba(146, 235, 255, 0.5);
            }

            ::ng-deep .p-dialog .p-dialog-content::-webkit-scrollbar-thumb:hover {
                background: var(--brand-secondary);
                box-shadow: 0 0 10px rgba(146, 235, 255, 0.8);
            }

            /* Dropdown del select - Glassmorphism */
            ::ng-deep .p-select-overlay {
                background: rgba(15, 23, 42, 0.95) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(146, 235, 255, 0.3) !important;
                border-radius: 8px !important;
                box-shadow:
                    0 8px 32px rgba(0, 0, 0, 0.4),
                    0 0 30px rgba(146, 235, 255, 0.2) !important;
            }

            ::ng-deep .p-select-overlay .p-select-option {
                color: rgba(255, 255, 255, 0.9) !important;
                background: transparent !important;
                padding: 0.75rem 1rem;
                transition: all 0.2s ease;
            }

            ::ng-deep .p-select-overlay .p-select-option:hover {
                background: rgba(146, 235, 255, 0.2) !important;
                color: var(--brand-primary) !important;
            }

            ::ng-deep .p-select-overlay .p-select-option.p-select-option-selected {
                background: rgba(146, 235, 255, 0.3) !important;
                color: var(--brand-primary) !important;
                font-weight: 600;
            }

            ::ng-deep .p-select-overlay .p-select-option.p-focus {
                background: rgba(146, 235, 255, 0.25) !important;
                color: var(--brand-primary) !important;
            }

            /* Responsive para diálogos */
            @media screen and (max-width: 768px) {
                ::ng-deep .p-dialog {
                    width: 95vw !important;
                    max-width: 95vw !important;
                }

                ::ng-deep .p-dialog .p-dialog-header {
                    padding: 1.25rem;
                }

                ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
                    font-size: 1.1rem;
                }

                ::ng-deep .p-dialog .p-dialog-content {
                    padding: 1.25rem;
                }

                ::ng-deep .p-dialog .formgrid.grid {
                    grid-template-columns: 1fr;
                }
            }

            @media screen and (max-width: 480px) {
                ::ng-deep .p-dialog .p-dialog-header {
                    padding: 1rem;
                }

                ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
                    font-size: 1rem;
                }

                ::ng-deep .p-dialog .p-dialog-content {
                    padding: 1rem;
                }

                ::ng-deep .p-dialog .p-dialog-footer {
                    padding: 0.75rem 1rem;
                    flex-direction: column-reverse;
                }

                ::ng-deep .p-dialog .p-dialog-footer .p-button {
                    width: 100%;
                }
            }
        `
    ]
})
export class Configuracion implements OnInit {
    // Señales para los datos
    usuarios = signal<Usuario[]>([]);
    raciones = signal<Racion[]>([]);

    // Variables para selecciones
    selectedUsuarios: Usuario[] = [];
    selectedRaciones: Racion[] = [];

    // Variables para diálogos
    usuarioDialog: boolean = false;
    racionDialog: boolean = false;

    // Variables para los formularios
    usuario: Usuario = {};
    racion: Racion = {};

    // Variables para el estado
    submitted: boolean = false;

    // Opciones para los selects
    objetivos = [
        { label: 'Hubnutí', value: 'Hubnutí' },
        { label: 'Nárůst svalové hmoty', value: 'Nárůst svalové hmoty' },
        { label: 'Udržení', value: 'Udržení' },
        { label: 'Definice', value: 'Definice' }
    ];

    categorias = [
        { label: 'Snídaně', value: 'Snídaně' },
        { label: 'Oběd', value: 'Oběd' },
        { label: 'Večeře', value: 'Večeře' },
        { label: 'Svačina', value: 'Svačina' },
        { label: 'Před tréninkem', value: 'Před tréninkem' },
        { label: 'Po tréninku', value: 'Po tréninku' }
    ];

    unidades = [
        { label: 'gramy (g)', value: 'g' },
        { label: 'mililitry (ml)', value: 'ml' },
        { label: 'kus', value: 'kus' },
        { label: 'šálek', value: 'šálek' },
        { label: 'lžíce', value: 'lžíce' }
    ];

    activeTab: string | number = '0';

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.initializeData();

        // Escuchar query params para seleccionar la pestaña en la configuración
        this.route.queryParams.subscribe((params: any) => {
            const tab: string = params['tab'];
            if (tab === 'alimentos' || tab === 'raciones' || tab === 'raciones') {
                this.activeTab = '1';
            } else if (tab === 'usuarios' || tab === 'users') {
                this.activeTab = '0';
            } else {
                // Default
                this.activeTab = '0';
            }
        });
    }

    initializeData() {
        // Datos de ejemplo para usuarios checos
        this.usuarios.set([
            {
                id: '1',
                nombre: 'Petr Novák',
                email: 'petr.novak@seznam.cz',
                telefono: '+420 604 123 456',
                edad: 28,
                peso: 82,
                altura: 183,
                objetivo: 'Pérdida de peso',
                activo: true
            },
            {
                id: '2',
                nombre: 'Jana Svobodová',
                email: 'jana.svobodova@gmail.com',
                telefono: '+420 775 234 567',
                edad: 32,
                peso: 62,
                altura: 168,
                objetivo: 'Ganancia muscular',
                activo: true
            },
            {
                id: '3',
                nombre: 'Tomáš Dvořák',
                email: 'tomas.dvorak@email.cz',
                telefono: '+420 608 345 678',
                edad: 25,
                peso: 75,
                altura: 178,
                objetivo: 'Mantenimiento',
                activo: false
            },
            {
                id: '4',
                nombre: 'Kateřina Nováková',
                email: 'katerina.n@centrum.cz',
                telefono: '+420 721 456 789',
                edad: 35,
                peso: 68,
                altura: 172,
                objetivo: 'Pérdida de peso',
                activo: true
            },
            {
                id: '5',
                nombre: 'Lukáš Černý',
                email: 'lukas.cerny@seznam.cz',
                telefono: '+420 603 567 890',
                edad: 22,
                peso: 70,
                altura: 180,
                objetivo: 'Ganancia muscular',
                activo: true
            },
            {
                id: '6',
                nombre: 'Martina Procházková',
                email: 'martina.p@gmail.com',
                telefono: '+420 776 678 901',
                edad: 29,
                peso: 58,
                altura: 165,
                objetivo: 'Definición',
                activo: false
            },
            {
                id: '7',
                nombre: 'Jan Malý',
                email: 'jan.maly@email.cz',
                telefono: '+420 607 789 012',
                edad: 31,
                peso: 88,
                altura: 185,
                objetivo: 'Pérdida de peso',
                activo: true
            },
            {
                id: '8',
                nombre: 'Barbora Jelínková',
                email: 'barbora.j@centrum.cz',
                telefono: '+420 732 890 123',
                edad: 26,
                peso: 56,
                altura: 167,
                objetivo: 'Ganancia muscular',
                activo: true
            },
            {
                id: '9',
                nombre: 'Jakub Veselý',
                email: 'jakub.vesely@seznam.cz',
                telefono: '+420 605 901 234',
                edad: 27,
                peso: 79,
                altura: 176,
                objetivo: 'Mantenimiento',
                activo: false
            },
            {
                id: '10',
                nombre: 'Tereza Horáková',
                email: 'tereza.horakova@gmail.com',
                telefono: '+420 774 012 345',
                edad: 24,
                peso: 63,
                altura: 170,
                objetivo: 'Definición',
                activo: true
            }
        ]);

        // Datos de ejemplo para raciones
        this.raciones.set([
            {
                id: '1',
                nombre: 'Energetická snídaně',
                alimento: 'Ovesné vločky s ovocem',
                cantidad: 100,
                unidad: 'g',
                calorias: 350,
                proteinas: 12,
                carbohidratos: 55,
                grasas: 8,
                categoria: 'Snídaně'
            },
            {
                id: '2',
                nombre: 'Proteinová svačina',
                alimento: 'Řecký jogurt',
                cantidad: 150,
                unidad: 'g',
                calorias: 180,
                proteinas: 15,
                carbohidratos: 12,
                grasas: 6,
                categoria: 'Svačina'
            }
        ]);
    }

    // Métodos para usuarios
    openNewUsuario() {
        this.usuario = {};
        this.submitted = false;
        this.usuarioDialog = true;
    }

    editUsuario(usuario: Usuario) {
        this.usuario = { ...usuario };
        this.usuarioDialog = true;
    }

    deleteUsuario(usuario: Usuario) {
        this.confirmationService.confirm({
            message: 'Opravdu chcete smazat uživatele ' + usuario.nombre + '?',
            header: 'Potvrdit',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usuarios.update((users) => users.filter((u) => u.id !== usuario.id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Uživatel byl smazán',
                    life: 3000
                });
            }
        });
    }

    deleteSelectedUsuarios() {
        this.confirmationService.confirm({
            message: 'Opravdu chcete smazat vybrané uživatele?',
            header: 'Potvrdit',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const selectedIds = this.selectedUsuarios.map((u) => u.id);
                this.usuarios.update((users) => users.filter((u) => !selectedIds.includes(u.id)));
                this.selectedUsuarios = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Uživatelé byli smazáni',
                    life: 3000
                });
            }
        });
    }

    hideUsuarioDialog() {
        this.usuarioDialog = false;
        this.submitted = false;
    }

    saveUsuario() {
        this.submitted = true;

        if (this.usuario.nombre?.trim() && this.usuario.email?.trim()) {
            if (this.usuario.id) {
                // Actualizar usuario existente
                this.usuarios.update((users) => users.map((u) => (u.id === this.usuario.id ? { ...this.usuario } : u)));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Uživatel byl aktualizován',
                    life: 3000
                });
            } else {
                // Crear nuevo usuario
                this.usuario.id = this.createId();
                this.usuario.activo = this.usuario.activo ?? true;
                this.usuarios.update((users) => [...users, { ...this.usuario }]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Uživatel byl vytvořen',
                    life: 3000
                });
            }

            this.usuarioDialog = false;
            this.usuario = {};
        }
    }

    // Métodos para raciones
    openNewRacion() {
        this.racion = {};
        this.submitted = false;
        this.racionDialog = true;
    }

    editRacion(racion: Racion) {
        this.racion = { ...racion };
        this.racionDialog = true;
    }

    deleteRacion(racion: Racion) {
        this.confirmationService.confirm({
            message: 'Opravdu chcete smazat ' + racion.nombre + '?',
            header: 'Potvrdit',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.raciones.update((racs) => racs.filter((r) => r.id !== racion.id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Porce byla smazána',
                    life: 3000
                });
            }
        });
    }

    deleteSelectedRaciones() {
        this.confirmationService.confirm({
            message: 'Opravdu chcete smazat vybrané porce?',
            header: 'Potvrdit',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const selectedIds = this.selectedRaciones.map((r) => r.id);
                this.raciones.update((racs) => racs.filter((r) => !selectedIds.includes(r.id)));
                this.selectedRaciones = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Porce byly smazány',
                    life: 3000
                });
            }
        });
    }

    hideRacionDialog() {
        this.racionDialog = false;
        this.submitted = false;
    }

    saveRacion() {
        this.submitted = true;

        if (this.racion.nombre?.trim() && this.racion.alimento?.trim()) {
            if (this.racion.id) {
                // Actualizar ración existente
                this.raciones.update((racs) => racs.map((r) => (r.id === this.racion.id ? { ...this.racion } : r)));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Porce byla aktualizována',
                    life: 3000
                });
            } else {
                // Crear nueva ración
                this.racion.id = this.createId();
                this.raciones.update((racs) => [...racs, { ...this.racion }]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Úspěch',
                    detail: 'Porce byla vytvořena',
                    life: 3000
                });
            }

            this.racionDialog = false;
            this.racion = {};
        }
    }

    // Métodos de utilidad
    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    getObjetivoSeverity(objetivo: string): string {
        switch (objetivo) {
            case 'Pérdida de peso':
                return 'warning';
            case 'Ganancia muscular':
                return 'success';
            case 'Mantenimiento':
                return 'info';
            default:
                return 'secondary';
        }
    }

    getCategoriaSeverity(categoria: string): string {
        switch (categoria) {
            case 'Desayuno':
                return 'success';
            case 'Almuerzo':
                return 'info';
            case 'Cena':
                return 'warning';
            case 'Snack':
                return 'secondary';
            default:
                return 'primary';
        }
    }
}

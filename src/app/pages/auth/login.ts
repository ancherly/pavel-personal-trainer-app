import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
    template: `
        <div class="login-container">
            <div class="login-wrapper">
                <div class="login-card-outer">
                    <div class="login-card-inner">
                        <div class="login-header">
                            <img src="logo/Logo-Pavel-Personal-Trainer-266x300.png" alt="Logo Pavel Personal Trainer" class="login-logo" />
                            <div class="login-title">Vítejte!</div>
                            <span class="login-subtitle">Přihlaste se pro pokračování</span>
                        </div>

                        <div class="login-form">
                            <label for="email1" class="form-label">Uživatel</label>
                            <input pInputText id="email1" type="text" placeholder="Uživatelské jméno" class="form-input" [(ngModel)]="email" />

                            <label for="password1" class="form-label">Heslo</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Heslo" [toggleMask]="true" styleClass="password-input" [fluid]="true" [feedback]="false"></p-password>

                            <div class="form-footer">
                                <div class="remember-me">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="checkbox"></p-checkbox>
                                    <label for="rememberme1" class="checkbox-label">Zapamatuj si mě</label>
                                </div>
                            </div>
                            <p-button label="Přihlásit se" styleClass="login-button" routerLink="/home"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .login-container {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100svh; /* Small viewport height - evita scroll cuando desaparece URL bar */
                min-height: -webkit-fill-available; /* Safari iOS */
                width: 100vw;
                overflow: hidden;
                font-family: var(--font-family-primary);
                padding: 1rem;
                box-sizing: border-box;
                position: fixed; /* Fija el contenedor */
                top: 0;
                left: 0;
                touch-action: none; /* Previene gestos que ocultan la barra de URL */
                overscroll-behavior: none; /* Previene scroll del navegador */

                @supports not (height: 100svh) {
                    height: 100vh; /* Fallback para navegadores que no soportan svh */
                }

                @media (max-width: 576px) {
                    padding: 0.5rem; /* Menos padding en móviles para más espacio */
                }
            }

            .login-container::before {
                display: none; /* Ya no necesitamos el overlay local */
            }

            .login-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
            }

            .login-card-outer {
                width: 100%;
                max-width: 480px;

                @media (max-width: 576px) {
                    max-width: 92%; /* Ocupa el 92% del ancho en móviles */
                    margin: 0 auto;
                }
            }

            .login-card-inner {
                width: 100%;
                background: #0f172a94;
                backdrop-filter: blur(16px) saturate(180%);
                border: 1px solid rgba(28, 169, 244, 0.3);
                box-shadow:
                    0 8px 32px rgba(0, 180, 216, 0.12),
                    0 2px 8px rgba(0, 0, 0, 0.04),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
                padding: 3rem 2rem;
                border-radius: 24px;
                transition: all 0.3s ease;

                @media (max-width: 576px) {
                    padding: 2.5rem 2rem; /* Padding más generoso */
                    border-radius: 20px;
                }

                @media (min-width: 576px) {
                    padding: 1.5rem;
                }

                &:hover {
                    background: rgb(15 23 42 / 77%);
                    border-color: rgba(28, 169, 244, 0.5);
                    box-shadow:
                        0 12px 40px rgba(0, 180, 216, 0.18),
                        0 4px 12px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }
            }

            .login-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .login-logo {
                margin-bottom: 2rem;
                max-height: 80px;
                width: auto;
                margin-left: auto;
                margin-right: auto;
                flex-shrink: 0;
                transition: transform 0.3s ease;

                @media (max-width: 576px) {
                    max-height: 60px;
                    margin-bottom: 1.5rem;
                }
            }

            .login-logo:hover {
                transform: scale(1.05);
            }

            .login-title {
                color: #ffffff;
                font-size: 2rem;
                font-weight: 700;
                font-family: var(--font-family-secondary);
                margin-bottom: 1rem;
                line-height: 1.3;

                @media (max-width: 576px) {
                    font-size: 1.75rem;
                }
            }

            .login-subtitle {
                color: #ffffff;
                font-weight: 500;
                font-size: 1rem;
            }

            .login-form {
                margin-top: 1rem;
            }

            .form-label {
                display: block;
                color: #ffffff;
                font-size: 1.125rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                font-family: var(--font-family-secondary);

                @media (max-width: 576px) {
                    font-size: 1rem;
                }
            }

            .form-input {
                width: 100%;
                margin-bottom: 2rem;
                min-width: 20rem;

                @media (max-width: 576px) {
                    min-width: 100%;
                }
            }

            .password-input {
                margin-bottom: 2rem;
                width: 100%;
            }

            .form-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 0.5rem;
                margin-bottom: 2rem;
                gap: 2rem;

                @media (max-width: 576px) {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
            }

            .remember-me {
                display: flex;
                align-items: center;
            }

            .checkbox {
                margin-right: 0.5rem;
            }

            .checkbox-label {
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
                cursor: pointer;
            }

            ::ng-deep .p-button {
                background: var(--brand-secondary) !important;
                border-color: var(--brand-secondary) !important;
            }

            ::ng-deep .login-button {
                width: 100%;
                margin-top: 1.5rem;
            }

            ::ng-deep .login-button.p-button {
                background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%) !important;
                border: none !important;
                color: #000000 !important;
                font-weight: 700 !important;
                font-family: var(--font-family-secondary) !important;
                padding: 1rem 2rem !important;
                border-radius: 50px !important;
                font-size: 1.1rem !important;
                letter-spacing: 0.5px;
                transition: all 0.3s ease !important;
                box-shadow: none !important;
                width: 100% !important;
                position: relative !important;
                overflow: hidden !important;
            }

            ::ng-deep .login-button.p-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.5s ease;
                pointer-events: none;
            }

            ::ng-deep .login-button.p-button:hover {
                transform: translateY(-4px) scale(1.02) !important;
                box-shadow: none !important;
                background: linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%) !important;
                letter-spacing: 1px !important;
            }

            ::ng-deep .login-button.p-button:hover::before {
                left: 100%;
            }

            ::ng-deep .login-button.p-button:active {
                transform: translateY(-1px) scale(0.98) !important;
            }

            ::ng-deep .form-input {
                .p-inputtext {
                    background: rgba(255, 255, 255, 0.15) !important;
                    backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.25) !important;
                    border-radius: 12px !important;
                    padding: 1rem 1.25rem !important;
                    font-size: 1rem !important;
                    transition: all 0.3s ease !important;
                    color: #ffffff !important;

                    &::placeholder {
                        color: rgba(255, 255, 255, 0.6) !important;
                    }

                    &:hover {
                        border-color: rgba(28, 169, 244, 0.5) !important;
                        background: rgba(255, 255, 255, 0.2) !important;
                    }

                    &:focus {
                        border-color: var(--brand-primary) !important;
                        background: rgba(255, 255, 255, 0.25) !important;
                        box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
                    }
                }
            }

            ::ng-deep .password-input {
                .p-password {
                    .p-password-input {
                        width: 100% !important;
                    }

                    .p-inputtext {
                        background: rgba(255, 255, 255, 0.15) !important;
                        backdrop-filter: blur(10px) !important;
                        border: 1px solid rgba(255, 255, 255, 0.25) !important;
                        border-radius: 12px !important;
                        padding: 1rem 1.25rem !important;
                        font-size: 1rem !important;
                        transition: all 0.3s ease !important;
                        width: 100% !important;
                        color: #ffffff !important;

                        &::placeholder {
                            color: rgba(255, 255, 255, 0.6) !important;
                        }

                        &:hover {
                            border-color: rgba(28, 169, 244, 0.5) !important;
                            background: rgba(255, 255, 255, 0.2) !important;
                        }

                        &:focus {
                            border-color: var(--brand-primary) !important;
                            background: rgba(255, 255, 255, 0.25) !important;
                            box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
                        }
                    }

                    .p-password-toggle-icon {
                        color: rgba(255, 255, 255, 0.7) !important;
                    }
                }
            }

            ::ng-deep .p-password-fluid .p-password-input {
                width: 100%;
                background: rgba(255, 255, 255, 0.15) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                color: #ffffff !important;
            }

            ::ng-deep .p-checkbox-box {
                background: rgba(255, 255, 255, 0.15) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                border-radius: 6px !important;
                width: 20px !important;
                height: 20px !important;
                transition: all 0.3s ease !important;
            }

            ::ng-deep .p-checkbox-box:hover {
                border-color: rgba(28, 169, 244, 0.5) !important;
                background: rgba(255, 255, 255, 0.2) !important;
            }

            ::ng-deep .p-checkbox-box .p-checkbox-icon {
                color: #000000 !important;
                font-weight: 700 !important;
                font-size: 14px !important;
            }

            ::ng-deep .p-checkbox.p-checkbox-checked .p-checkbox-box {
                border-color: var(--brand-primary) !important;
                background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)) !important;
            }

            ::ng-deep .p-checkbox.p-checkbox-checked .p-checkbox-box:hover {
                border-color: var(--brand-primary) !important;
                background: linear-gradient(135deg, var(--brand-secondary), var(--brand-primary)) !important;
            }

            ::ng-deep .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus) .p-checkbox-box {
                border-color: var(--brand-primary) !important;
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
            }

            .p-inputtext {
                background: rgba(255, 255, 255, 0.15) !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                color: #ffffff !important;
            }

            ::ng-deep .p-inputtext:enabled:focus {
                border-color: var(--brand-primary) !important;
                background: rgba(255, 255, 255, 0.25) !important;
                box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.15) !important;
            }

            ::ng-deep .p-inputtext:enabled:hover {
                border-color: rgba(28, 169, 244, 0.5) !important;
                background: rgba(255, 255, 255, 0.2) !important;
            }
        `
    ]
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
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
                            <p-button label="Přihlásit se" styleClass="login-button" routerLink="/"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .login-container {
            background-color: rgba(0, 0, 0, 0.6);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-blend-mode: darken;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            min-width: 100vw;
            overflow: hidden;
            font-family: var(--font-family-primary);
            padding: 1rem;
            box-sizing: border-box;
            position: relative;
        }
        
        .login-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url(/background/background.webp);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: blur(0.5px);
            opacity: 0.6;
            z-index: -1;
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
            border-radius: 56px;
            padding: 0.3rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 480px;
            
            @media (max-width: 576px) {
                border-radius: 32px;
                margin: 0 0.5rem;
            }
        }

        .login-card-inner {
            width: 100%;
            background: #ffffffc4;
            padding: 3rem 2rem;
            
            border-radius: 53px;
            
            @media (max-width: 576px) {
                padding: 2rem 1.5rem;
                border-radius: 29px;
            }
            
            @media (min-width: 576px) {
                padding: 5rem 5rem;
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
            filter: drop-shadow(0 4px 8px rgba(146, 235, 255, 0.3));
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
            color: var(--text-color);
            font-size: 2rem;
            font-weight: 600;
            font-family: var(--font-family-secondary);
            margin-bottom: 1rem;
            line-height: 1.3;
            
            @media (max-width: 576px) {
                font-size: 1.75rem;
            }
        }

        .login-subtitle {
            color: var(--text-color-secondary);
            font-weight: 500;
            font-size: 1rem;
        }

        .login-form {
            margin-top: 1rem;
        }

        .form-label {
            display: block;
            color: var(--text-color);
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
            margin-bottom: 1rem;
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
            color: var(--text-color-secondary);
            font-weight: 500;
            cursor: pointer;
        }

      
        ::ng-deep .p-button {
             background: var(--brand-secondary) !important;
             border-color: var(--brand-secondary) !important;
        }

        ::ng-deep .login-button {
            width: 100% !important;
            
            .p-button {
                background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%) !important;
                border: none !important;
                color: white !important;
                font-weight: 600 !important;
                font-family: var(--font-family-secondary) !important;
                padding: 1rem 2rem !important;
                border-radius: 50px !important;
                font-size: 1.1rem !important;
                letter-spacing: 0.5px !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 4px 15px rgba(146, 235, 255, 0.4) !important;
                width: 100% !important;
                
                &:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 25px rgba(146, 235, 255, 0.5) !important;
                    background: linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%) !important;
                }
                
                &:focus {
                    box-shadow: 0 0 0 2px rgba(146, 235, 255, 0.5) !important;
                }
            }
        }

        ::ng-deep .form-input {
            .p-inputtext {
                border: 2px solid var(--neutral-200) !important;
                border-radius: 12px !important;
                padding: 1rem 1.25rem !important;
                font-size: 1rem !important;
                transition: all 0.3s ease !important;
                
                &:focus {
                    border-color: var(--brand-primary) !important;
                    box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.1) !important;
                }
            }
        }

        ::ng-deep .password-input {
            .p-password {
                width: 100% !important;
                
                .p-inputtext {
                    border: 2px solid var(--neutral-200) !important;
                    border-radius: 12px !important;
                    padding: 1rem 1.25rem !important;
                    font-size: 1rem !important;
                    transition: all 0.3s ease !important;
                    width: 100% !important;
                    
                    &:focus {
                        border-color: var(--brand-primary) !important;
                        box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.1) !important;
                    }
                }
            }
        }

        ::ng-deep .checkbox {
            .p-checkbox {
                .p-checkbox-box {
                    border: 2px solid var(--neutral-300) !important;
                    border-radius: 6px !important;
                    
                    &:hover {
                        border-color: var(--brand-primary) !important;
                    }
                    
                    &.p-highlight {
                        background: var(--brand-primary) !important;
                        border-color: var(--brand-primary) !important;
                    }
                }
            }
        }

        .p-inputtext {
            border: 2px solid var(--neutral-200) !important;
            
        }

        ::ng-deep .p-inputtext:enabled:focus {
            border-color: var(--brand-secondary) !important;
            box-shadow: 0 0 0 3px rgba(146, 235, 255, 0.1) !important;
        }
    `]
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;
}

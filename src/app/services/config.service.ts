import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BIRTHDAY_CONFIG } from '../config/birthday.config';

export interface BirthdayConfig {
  personName: string;
  mainMessage: string;
  subMessage: string;
  themeColor: string;
  backgroundGradient: string[];
  fontFamily: string;
  personImages: string[];
  backgroundMusic: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<BirthdayConfig>(BIRTHDAY_CONFIG);
  
  constructor() {
    console.log('ConfigService initialized with config:', BIRTHDAY_CONFIG);
    this.applyTheme();
  }

  getConfig(): Observable<BirthdayConfig> {
    return this.configSubject.asObservable();
  }

  getCurrentConfig(): BirthdayConfig {
    return this.configSubject.value;
  }

  private applyTheme(): void {
    const config = this.getCurrentConfig();
    
    // Apply CSS variables
    document.documentElement.style.setProperty('--theme-color', config.themeColor);
    document.documentElement.style.setProperty('--gradient-start', config.backgroundGradient[0]);
    document.documentElement.style.setProperty('--gradient-end', config.backgroundGradient[1]);
    document.documentElement.style.setProperty('--font-family', config.fontFamily);
    
    // Apply font family to body
    document.body.style.fontFamily = config.fontFamily;
  }
}

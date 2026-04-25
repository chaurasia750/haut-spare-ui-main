import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ShellConfig {
  sidebarVisible: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  timestamp: string;
}

/**
 * Service to manage Shell application layout state and configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ShellConfigService {
  private configSubject = new BehaviorSubject<ShellConfig>({
    sidebarVisible: true,
    theme: 'light',
    notifications: [],
  });

  public config$ = this.configSubject.asObservable();

  constructor() {
    this.loadConfigFromStorage();
  }

  /**
   * Get current configuration
   */
  getConfig(): ShellConfig {
    return this.configSubject.value;
  }

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar(): void {
    const config = this.configSubject.value;
    config.sidebarVisible = !config.sidebarVisible;
    this.configSubject.next(config);
    this.saveConfigToStorage(config);
  }

  /**
   * Set sidebar visibility
   */
  setSidebarVisible(visible: boolean): void {
    const config = this.configSubject.value;
    config.sidebarVisible = visible;
    this.configSubject.next(config);
    this.saveConfigToStorage(config);
  }

  /**
   * Get sidebar visibility state
   */
  isSidebarVisible(): Observable<boolean> {
    return new Observable((subscriber) => {
      subscriber.next(this.configSubject.value.sidebarVisible);
      this.config$.subscribe((config) => subscriber.next(config.sidebarVisible));
    });
  }

  /**
   * Set theme
   */
  setTheme(theme: 'light' | 'dark'): void {
    const config = this.configSubject.value;
    config.theme = theme;
    this.configSubject.next(config);
    this.saveConfigToStorage(config);
    this.applyTheme(theme);
  }

  /**
   * Get current theme
   */
  getTheme(): 'light' | 'dark' {
    return this.configSubject.value.theme;
  }

  /**
   * Add notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const config = this.configSubject.value;
    const id = `notif-${Date.now()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
    };

    config.notifications = [...config.notifications, newNotification];
    this.configSubject.next(config);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }
  }

  /**
   * Remove notification
   */
  removeNotification(id: string): void {
    const config = this.configSubject.value;
    config.notifications = config.notifications.filter((n) => n.id !== id);
    this.configSubject.next(config);
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    const config = this.configSubject.value;
    config.notifications = [];
    this.configSubject.next(config);
  }

  /**
   * Show success notification
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.addNotification({
      type: 'success',
      message,
      duration,
    });
  }

  /**
   * Show error notification
   */
  showError(message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'error',
      message,
      duration,
    });
  }

  /**
   * Show warning notification
   */
  showWarning(message: string, duration: number = 4000): void {
    this.addNotification({
      type: 'warning',
      message,
      duration,
    });
  }

  /**
   * Show info notification
   */
  showInfo(message: string, duration: number = 3000): void {
    this.addNotification({
      type: 'info',
      message,
      duration,
    });
  }

  /**
   * Save config to localStorage
   */
  private saveConfigToStorage(config: ShellConfig): void {
    try {
      localStorage.setItem('shell-config', JSON.stringify(config));
    } catch {
      console.warn('Failed to save shell config to localStorage');
    }
  }

  /**
   * Load config from localStorage
   */
  private loadConfigFromStorage(): void {
    try {
      const stored = localStorage.getItem('shell-config');
      if (stored) {
        const config = JSON.parse(stored);
        // Reset notifications on load (don't persist)
        config.notifications = [];
        this.configSubject.next(config);
        this.applyTheme(config.theme);
      }
    } catch {
      console.warn('Failed to load shell config from localStorage');
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark-theme');
      html.classList.remove('light-theme');
    } else {
      html.classList.add('light-theme');
      html.classList.remove('dark-theme');
    }
  }
}

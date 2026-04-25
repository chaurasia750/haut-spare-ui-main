import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

/**
 * Breadcrumb component for showing current route and navigation context
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="breadcrumb-container" *ngIf="breadcrumbs$ | async as breadcrumbs">
      <ol class="breadcrumb-list">
        <li *ngFor="let breadcrumb of breadcrumbs; let last = last" class="breadcrumb-item">
          <a
            *ngIf="!last"
            [href]="breadcrumb.url"
            class="breadcrumb-link"
            (click)="navigate($event, breadcrumb.url)"
          >
            {{ breadcrumb.label }}
          </a>
          <span *ngIf="last" class="breadcrumb-current">
            {{ breadcrumb.label }}
          </span>
          <span *ngIf="!last" class="breadcrumb-separator">/</span>
        </li>
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumb-container {
        padding: 12px 24px;
        background: white;
        border-bottom: 1px solid #e2e8f0;
      }

      .breadcrumb-list {
        display: flex;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;
      }

      .breadcrumb-item {
        display: flex;
        align-items: center;
        font-size: 14px;
      }

      .breadcrumb-link {
        color: #3182ce;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
          color: #2c5aa0;
          text-decoration: underline;
        }
      }

      .breadcrumb-current {
        color: #2d3748;
        font-weight: 500;
      }

      .breadcrumb-separator {
        color: #cbd5e0;
        margin: 0 8px;
      }

      @media (max-width: 768px) {
        .breadcrumb-container {
          padding: 8px 16px;
        }

        .breadcrumb-list {
          font-size: 12px;
        }

        .breadcrumb-separator {
          margin: 0 4px;
        }
      }
    `,
  ],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.breadcrumbs$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getBreadcrumbs(this.activatedRoute.root))
    );
  }

  ngOnInit(): void {
    // Trigger initial breadcrumb update
    this.breadcrumbs$ = this.breadcrumbs$;
  }

  navigate(event: MouseEvent, url: string): void {
    event.preventDefault();
    this.router.navigateByUrl(url);
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet !== 'primary') {
        continue;
      }

      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Add breadcrumb
      const label = child.snapshot.data[ROUTE_DATA_BREADCRUMB];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}

import { Pipe, PipeTransform, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { ElectronService } from '@ever-co/electron-data-access';

export interface LinkParseOptions {
  maxLength?: number;
  target?: string;
  rel?: string;
  truncateMode?: 'middle' | 'end' | 'start';
  cssClass?: string;
  titleAttribute?: boolean;
  protocolIcons?: boolean;
  openExternally?: boolean; // New option to control external opening
}

@Pipe({
  name: 'parseLinks',
  pure: true
})
export class ParseLinksPipe implements PipeTransform {
  private defaultOptions: LinkParseOptions = {
    maxLength: 50,
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
    truncateMode: 'middle',
    cssClass: 'external-link',
    titleAttribute: true,
    protocolIcons: false,
    openExternally: true // Default to opening externally
  };

  private protocolIcons: { [key: string]: string } = {
    'http:': '🌐',
    'https:': '🔒',
    'mailto:': '📧',
    'tel:': '📞',
    'ftp:': '📁',
    'ssh:': '💻'
  };

  private isBrowser: boolean;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: any,
    private electronService: ElectronService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  public transform(
    value: string | null | undefined,
    maxLength?: number,
    options?: LinkParseOptions
  ): SafeHtml | string {
    if (!value) {
      return value || '';
    }

    const mergedOptions: LinkParseOptions = {
      ...this.defaultOptions,
      ...(maxLength !== undefined ? { maxLength } : {}),
      ...options
    };

    const urlRegex = /(https?:\/\/[^\s<]+|ftp:\/\/[^\s<]+|mailto:[^\s<]+|tel:[^\s<]+|ssh:\/\/[^\s<]+)(?=[\s<]|$)/gi;

    const processedText = value.replace(urlRegex, (url: string) => {
      try {
        return this.createLinkElement(url, mergedOptions);
      } catch (error) {
        console.warn('Failed to parse URL:', url, error);
        return url;
      }
    });

    // Add click handler for external links if in browser
    if (this.isBrowser && mergedOptions.openExternally) {
      setTimeout(() => this.attachClickHandlers(), 0);
    }

    return this.sanitizer.bypassSecurityTrustHtml(processedText);
  }

  private createLinkElement(url: string, options: LinkParseOptions): string {
    const parsedUrl = this.parseAndValidateUrl(url);
    if (!parsedUrl) {
      return url;
    }

    const displayText = this.getDisplayText(parsedUrl, options);
    const icon = options.protocolIcons ? this.getProtocolIcon(parsedUrl.protocol) : '';
    const titleAttr = options.titleAttribute ? `title="${parsedUrl.href}"` : '';

    // Add data attributes for external link handling
    const dataAttrs = options.openExternally ?
      `data-external-link="true" data-original-url="${this.escapeHtml(parsedUrl.href)}"` : '';

    return `
      <a href="${parsedUrl.href}"
         target="${options.target}"
         rel="${options.rel}"
         class="${options.cssClass}"
         ${titleAttr}
         ${dataAttrs}>
        ${icon}${displayText}
      </a>
    `.trim();
  }

  private attachClickHandlers(): void {
    const externalLinks = document.querySelectorAll('a[data-external-link="true"]');

    externalLinks.forEach(link => {
      link.addEventListener('click', this.handleExternalLinkClick.bind(this));
    });
  }

  private async handleExternalLinkClick(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const link = event.currentTarget as HTMLAnchorElement;
    const url = link.href || link.getAttribute('data-original-url');

    if (!url) return;

    // Use Electron service to open externally
    if (this.electronService.isElectron) {
      try {
        await this.electronService.openExternal(url);
      } catch (error) {
        this.openInNewWindow(url);
      }
    } else {
      // Regular browser environment
      this.openInNewWindow(url);
    }
  }

  private openInNewWindow(url: string): void {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null; // Security measure
    }
  }

  // ... (keep the existing helper methods from previous version)
  private parseAndValidateUrl(url: string): URL | null {
    try {
      const parsedUrl = new URL(url);
      if (this.isPotentiallyDangerousProtocol(parsedUrl.protocol)) {
        console.warn('Potentially dangerous protocol detected:', parsedUrl.protocol);
        return null;
      }
      return parsedUrl;
    } catch (error) {
      const fixedUrl = this.tryFixUrl(url);
      if (fixedUrl) {
        try {
          return new URL(fixedUrl);
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  private isPotentiallyDangerousProtocol(protocol: string): boolean {
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    return dangerousProtocols.includes(protocol.toLowerCase());
  }

  private tryFixUrl(url: string): string | null {
    if (!/^[a-z][a-z0-9+\-.]*:/i.test(url)) {
      return 'https://' + url;
    }
    return null;
  }

  private getDisplayText(parsedUrl: URL, options: LinkParseOptions): string {
    let displayText = parsedUrl.href;
    if (parsedUrl.protocol === 'mailto:') {
      displayText = parsedUrl.pathname;
    } else if (parsedUrl.protocol === 'tel:') {
      displayText = parsedUrl.pathname;
    }
    if (displayText.length > options.maxLength!) {
      displayText = this.truncateText(displayText, options.maxLength!, options.truncateMode!);
    }
    return this.escapeHtml(displayText);
  }

  private truncateText(text: string, maxLength: number, mode: 'middle' | 'end' | 'start'): string {
    if (text.length <= maxLength) return text;
    switch (mode) {
      case 'middle':
        const half = Math.floor(maxLength / 2);
        return text.slice(0, half - 1) + '…' + text.slice(-half);
      case 'end':
        return text.slice(0, maxLength - 1) + '…';
      case 'start':
        return '…' + text.slice(-(maxLength - 1));
      default:
        return text.slice(0, maxLength - 1) + '…';
    }
  }

  private getProtocolIcon(protocol: string): string {
    return this.protocolIcons[protocol] || '🔗';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public extractUrls(text: string): string[] {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s<]+|ftp:\/\/[^\s<]+|mailto:[^\s<]+|tel:[^\s<]+|ssh:\/\/[^\s<]+)(?=[\s<]|$)/gi;
    const matches = text.match(urlRegex) || [];
    return matches.filter((url, index, self) => self.indexOf(url) === index);
  }
}

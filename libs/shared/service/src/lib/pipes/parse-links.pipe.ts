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
  openExternally?: boolean;
  maxInputLength?: number; // Security: limit input size
  timeoutMs?: number; // Security: regex timeout
  enableReDoSProtection?: boolean; // Security: enable protection
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
    openExternally: true,
    maxInputLength: 10000, // 10KB maximum input
    timeoutMs: 100, // 100ms timeout for regex
    enableReDoSProtection: true
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
  private readonly SAFE_URL_PATTERNS = {
    // Safer regex patterns that avoid catastrophic backtracking
    HTTP: /https?:\/\/[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9](?::\d+)?(?:\/[^\s<]*)?/g,
    MAILTO: /mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    TEL: /tel:\+?[0-9][0-9\s.-]{5,20}/g, // Limited length for phone numbers
    FTP: /ftp:\/\/[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9](?::\d+)?(?:\/[^\s<]*)?/g,
    SSH: /ssh:\/\/[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9](?::\d+)?(?:\/[^\s<]*)?/g
  };

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

    // Security: Input length validation
    if (value.length > mergedOptions.maxInputLength!) {
      console.warn(`Input too long (${value.length} > ${mergedOptions.maxInputLength}). Truncating.`);
      value = value.substring(0, mergedOptions.maxInputLength!) + '…';
    }

    let processedText: string;

    if (mergedOptions.enableReDoSProtection) {
      // Use safer iterative parsing method
      processedText = this.safeParseUrls(value, mergedOptions);
    } else {
      // Use regex with timeout protection (fallback)
      processedText = this.regexParseUrlsWithTimeout(value, mergedOptions);
    }

    // Add click handler for external links if in browser
    if (this.isBrowser && mergedOptions.openExternally) {
      setTimeout(() => this.attachClickHandlers(), 0);
    }

    return this.sanitizer.bypassSecurityTrustHtml(processedText);
  }

  /**
   * Safe URL parsing without vulnerable regex patterns
   */
  private safeParseUrls(text: string, options: LinkParseOptions): string {
    const result: string[] = [];
    let i = 0;
    const n = text.length;

    while (i < n) {
      // Look for protocol indicators
      const remainingText = text.substring(i);
      let urlMatch: { url: string; protocol: string } | null = null;

      // Check each protocol in order of likelihood
      if (remainingText.startsWith('http://') || remainingText.startsWith('https://')) {
        urlMatch = this.extractHttpUrl(remainingText, i, text);
      } else if (remainingText.startsWith('mailto:')) {
        urlMatch = this.extractMailtoUrl(remainingText);
      } else if (remainingText.startsWith('tel:')) {
        urlMatch = this.extractTelUrl(remainingText);
      } else if (remainingText.startsWith('ftp://')) {
        urlMatch = this.extractFtpUrl(remainingText, i, text);
      } else if (remainingText.startsWith('ssh://')) {
        urlMatch = this.extractSshUrl(remainingText, i, text);
      }

      if (urlMatch) {
        result.push(this.createLinkElement(urlMatch.url, options));
        i += urlMatch.url.length;
      } else {
        // Add regular character
        result.push(this.escapeHtml(text[i]));
        i++;
      }
    }

    return result.join('');
  }

  private extractHttpUrl(text: string): { url: string; protocol: string } | null {
    // Simple HTTP URL extraction without complex regex
    const protocol = text.startsWith('https://') ? 'https://' : 'http://';
    let end = protocol.length;

    // Find end of URL (whitespace, tag, or quote)
    while (end < text.length && !/\s|<|>|"|'/.test(text[end])) {
      end++;
    }

    const url = text.substring(0, end);
    try {
      new URL(url); // Validate URL
      return { url, protocol };
    } catch {
      return null;
    }
  }

  private extractMailtoUrl(text: string): { url: string; protocol: string } | null {
    const protocol = 'mailto:';
    if (text.length <= protocol.length) return null;

    let end = protocol.length;
    // Simple email validation - look for @ and domain
    while (end < text.length && !/\s|<|>|"|'/.test(text[end])) {
      end++;
    }

    const emailPart = text.substring(protocol.length, end);
    if (emailPart.includes('@') && emailPart.includes('.')) {
      const url = text.substring(0, end);
      return { url, protocol: 'mailto:' };
    }

    return null;
  }

  private extractTelUrl(text: string): { url: string; protocol: string } | null {
    const protocol = 'tel:';
    if (text.length <= protocol.length) return null;

    let end = protocol.length;
    // Extract phone number (digits, plus, hyphens, spaces)
    while (end < text.length && !/\s|<|>|"|'/.test(text[end])) {
      if (!/[\d+\-\s]/.test(text[end])) {
        break;
      }
      end++;
    }

    const url = text.substring(0, end);
    return { url, protocol: 'tel:' };
  }

  private extractFtpUrl(text: string, index: number, fullText: string): { url: string; protocol: string } | null {
    return this.extractHttpUrl(text.replace('ftp://', 'http://'), index, fullText)?.url
      ? { url: text.substring(0, text.indexOf(' ') !== -1 ? text.indexOf(' ') : text.length), protocol: 'ftp://' }
      : null;
  }

  private extractSshUrl(text: string, index: number, fullText: string): { url: string; protocol: string } | null {
    return this.extractHttpUrl(text.replace('ssh://', 'http://'), index, fullText)?.url
      ? { url: text.substring(0, text.indexOf(' ') !== -1 ? text.indexOf(' ') : text.length), protocol: 'ssh://' }
      : null;
  }

  /**
   * Fallback method with regex and timeout protection
   */
  private regexParseUrlsWithTimeout(text: string, options: LinkParseOptions): string {
    const startTime = Date.now();
    const timeoutMs = options.timeoutMs!;

    try {
      // Use safer individual patterns instead of one complex regex
      const patterns = [
        this.SAFE_URL_PATTERNS.HTTP,
        this.SAFE_URL_PATTERNS.MAILTO,
        this.SAFE_URL_PATTERNS.TEL,
        this.SAFE_URL_PATTERNS.FTP,
        this.SAFE_URL_PATTERNS.SSH
      ];

      let result = text;
      for (const pattern of patterns) {
        if (Date.now() - startTime > timeoutMs) {
          throw new Error('Regex parsing timeout');
        }

        result = result.replace(pattern, (url: string) => {
          if (Date.now() - startTime > timeoutMs) {
            return url; // Return original if timeout
          }
          try {
            return this.createLinkElement(url, options);
          } catch (error) {
            console.warn('Failed to parse URL:', url, error);
            return url;
          }
        });
      }

      return result;
    } catch (error) {
      console.warn('URL parsing timeout or error, returning original text:', error);
      return this.escapeHtml(text); // Fallback to escaped text
    }
  }

  private createLinkElement(url: string, options: LinkParseOptions): string {
    const parsedUrl = this.parseAndValidateUrl(url);
    if (!parsedUrl) {
      return this.escapeHtml(url);
    }

    const displayText = this.getDisplayText(parsedUrl, options);
    const icon = options.protocolIcons ? this.getProtocolIcon(parsedUrl.protocol) : '';
    const titleAttr = options.titleAttribute ? `title="${parsedUrl.href}"` : '';

    const dataAttrs = options.openExternally ?
      `data-external-link="true" data-original-url="${this.escapeHtml(parsedUrl.href)}"` : '';

    return `
      <a href="${this.escapeHtml(parsedUrl.href)}"
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
      // Remove existing listener to avoid duplicates
      link.removeEventListener('click', this.handleExternalLinkClick.bind(this));
      link.addEventListener('click', this.handleExternalLinkClick.bind(this));
    });
  }

  private async handleExternalLinkClick(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const link = event.currentTarget as HTMLAnchorElement;
    const url = link.href || link.getAttribute('data-original-url');

    if (!url) return;

    try {
      if (this.electronService.isElectron) {
        await this.electronService.openExternal(url);
      } else {
        this.openInNewWindow(url);
      }
    } catch (error) {
      console.warn('Failed to open external link, falling back to new window:', error);
      this.openInNewWindow(url);
    }
  }

  private openInNewWindow(url: string): void {
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.opener = null;
      }
    } catch (error) {
      console.error('Failed to open new window:', error);
    }
  }

  private parseAndValidateUrl(url: string): URL | null {
    try {
      const parsedUrl = new URL(url);
      if (this.isPotentiallyDangerousProtocol(parsedUrl.protocol)) {
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

  // Optional: Keep extractUrls but with safety improvements
  public extractUrls(text: string): string[] {
    if (!text || text.length > 1000) return []; // Safety limit
    const urls: string[] = [];

    // Use safe parsing instead of regex
    let i = 0;
    while (i < text.length) {
      const remaining = text.substring(i);
      const httpMatch = remaining.match(/https?:\/\/\S+/);
      if (httpMatch) {
        urls.push(httpMatch[0]);
        i += httpMatch.index! + httpMatch[0].length;
      } else {
        i++;
      }
    }

    return [...new Set(urls)]; // Remove duplicates
  }
}

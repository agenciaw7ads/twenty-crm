import { localizeHref } from './localize-href';
import { stripLocale } from './strip-locale';

describe('localizeHref', () => {
  it('leaves source-locale hrefs unprefixed', () => {
    expect(localizeHref('pt', '/pricing')).toBe('/pricing');
  });

  it('leaves root path unprefixed for source locale', () => {
    expect(localizeHref('pt', '/')).toBe('/');
  });

  it('strips an existing pt prefix when re-localizing', () => {
    expect(localizeHref('pt', '/pt/pricing')).toBe('/pricing');
    expect(localizeHref('pt', '/pt')).toBe('/');
  });

  it('preserves query strings and hashes', () => {
    expect(localizeHref('pt', '/pricing?seat=5#faq')).toBe(
      '/pricing?seat=5#faq',
    );
  });

  it('passes through external and protocol-relative urls', () => {
    expect(localizeHref('pt', 'https://example.com/a')).toBe(
      'https://example.com/a',
    );
    expect(localizeHref('pt', '//cdn.example.com/x')).toBe(
      '//cdn.example.com/x',
    );
  });
});

describe('stripLocale', () => {
  it('removes a known locale prefix', () => {
    expect(stripLocale('/pt/pricing')).toBe('/pricing');
    expect(stripLocale('/pt')).toBe('/');
  });

  it('leaves unprefixed paths alone', () => {
    expect(stripLocale('/pricing')).toBe('/pricing');
  });
});

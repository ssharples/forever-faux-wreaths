const DEFAULT_SITE_URL = "https://foreverfauxwreaths.co.uk";

export function getSiteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL
  );
}

export function getSiteUrlObject() {
  return new URL(getSiteUrl());
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

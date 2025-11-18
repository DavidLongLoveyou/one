/**
 * Skip to main content link
 * Allows keyboard users to skip navigation
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white focus:rounded-md focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}


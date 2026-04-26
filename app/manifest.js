export default function manifest() {
  return {
    name: 'Do Something',
    short_name: 'Do Something',
    description: 'Do Something App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
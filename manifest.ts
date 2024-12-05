import type { ManifestOptions } from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
  name: "Contacto Personal",
  short_name: "ContactoP",
  display: "standalone",
  scope: "/",
  start_url: "/",
  theme_color: "#f48a17",
  background_color: "#62401c",
  description: "Aplicación de Agenda de Contactos con muchas funciones, uso sin conexión como PWA. Hecho por github.com/hugofriasmtz",
  icons: [
    {
      src: "/logo96.png",
      sizes: "72x72",
      type: "image/png",
    },
    {
      src: "/logo192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/logo256.png",
      sizes: "256x256",
      type: "image/png",
    },
    {
      src: "/logo384.png",
      sizes: "384x384",
      type: "image/png",
    },
    {
      src: "/logo512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "pwa/logoMaskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
export default manifest;

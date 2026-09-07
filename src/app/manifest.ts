import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FitMe — Tu gimnasio, tu app",
    short_name: "FitMe",
    description: "Registra tus entrenamientos personalizados según el equipamiento de tu gimnasio.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf8ff",
    theme_color: "#4648d4",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
      { src: "/icons/maskable-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}

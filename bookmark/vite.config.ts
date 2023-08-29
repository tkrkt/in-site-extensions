import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "In-Site Bookmark",
  version: "1.3.0",
  permissions: [
    "activeTab",
    "storage",
    "unlimitedStorage",
    "tabs",
    "bookmarks",
    "downloads",
  ],
  action: {
    default_popup: "popup.html",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  icons: {
    128: "icon-128.png",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});

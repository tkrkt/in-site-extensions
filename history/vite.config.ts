import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "In-Site History",
  version: "1.3.0",
  permissions: ["activeTab", "history"],
  action: {
    default_popup: "popup.html",
  },
  icons: {
    128: "icon-128.png",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});

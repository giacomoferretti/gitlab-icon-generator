import "./styles.css";
import "@fontsource/geist-sans/latin.css";

import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "~/app";
import { ThemeProvider } from "~/components/theme-provider.tsx";
import { ThemeToggle } from "~/components/theme-toggle";

// biome-ignore lint/style/noNonNullAssertion: this is fine here
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <NuqsAdapter>
        <App />
        <div className="fixed right-4 bottom-4">
          <ThemeToggle />
        </div>
      </NuqsAdapter>
    </ThemeProvider>
  </StrictMode>,
);

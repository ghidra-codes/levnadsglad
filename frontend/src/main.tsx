import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/scss/main.scss";
import App from "@/app/App";
import { queryClient } from "./lib/react-query/queryClient";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Root element #root was not found");

createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>,
);

import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Transaction } from "./pages/Transaction";
import { NetworkInfo } from "./pages/NetworkInfo";
import { ContractExplorer } from "./pages/ContractExplorer";

const rootRoute = createRootRoute({
  component: App,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

const transactionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transaction",
  component: Transaction,
});

const networkInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/network-info",
  component: NetworkInfo,
});

const contractExplorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contract-explorer",
  component: ContractExplorer,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  transactionRoute,
  networkInfoRoute,
  contractExplorerRoute,
]);

export const router = createRouter({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

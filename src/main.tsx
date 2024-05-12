import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux";
import { PersistGate } from "redux-persist/integration/react";
import "@/styles/index.less";
// import "antd/dist/reset.css";
import "virtual:svg-icons-register";
// import VConsole from 'vconsole';
// new VConsole();

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi.config";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <WagmiProvider config={config}>
  //   <QueryClientProvider client={queryClient}>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </PersistGate>
  </Provider>
  //   </QueryClientProvider>
  // </WagmiProvider>
);

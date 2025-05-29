import { Provider } from "react-redux";
import Routes from "./routes";
import { persistor, store } from "./store";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import './assets/scss/main.scss';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Routes />
        <ToastContainer/>
      </PersistGate>
    </Provider>
  );
}

export default App;

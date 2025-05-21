import { Provider } from "react-redux";
import Routes from "./routes";
import { store } from "./store";
import './assets/scss/main.scss';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <Routes />
      <ToastContainer/>
    </Provider>
  );
}

export default App;

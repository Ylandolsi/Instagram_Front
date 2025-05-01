import { AuthProvider } from "./contexts/authContext";
import { NotificationProvider } from "./contexts/notificationContext";
import AppRoutes from "./Routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
          theme="light"
        />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

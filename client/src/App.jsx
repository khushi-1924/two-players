import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div>
      <Toaster />
      <AppRoutes />
    </div>
  )
}

export default App

import PlayerDisconnectHandler from "./components/PlayerDisconnectHandler"
import useRoomReconnection from "./hooks/useRoomReconnection"
import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "react-hot-toast"

function App() {

  useRoomReconnection();
  
  return (
    <div>
      <Toaster />
      <AppRoutes />
      <PlayerDisconnectHandler />
    </div>
  )
}

export default App

import { setupIonicReact } from '@ionic/react';
import Main from './Main';
import { AuthProvider } from './util/authentication';
setupIonicReact();

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

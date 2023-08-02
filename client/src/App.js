import { useEffect, useState } from 'react';
import './App.css'
import { Autorization } from "./components/Autorization";
import { List } from './components/List';
import { AppContext } from './AppContext';

function App() {
  const [login, setLogin] = useState(undefined)
  useEffect(() => {
    setLogin(localStorage.getItem('login'))
  }, [])
  if (login || localStorage.getItem('login')) {
    return <AppContext.Provider value={{ login, setLogin }}>
      <List />
    </AppContext.Provider>
  } else {
    return <AppContext.Provider value={{ login, setLogin }}>
      <div className='w-[100vw] h-[100vh]'>
        <Autorization />
      </div>
    </AppContext.Provider >
  }
}

export default App;

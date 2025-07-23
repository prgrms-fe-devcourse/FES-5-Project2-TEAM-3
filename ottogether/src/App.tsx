import './App.css'
import { RouterProvider } from 'react-router-dom'
import {router} from './router'


function App() {
  return (
    <div className='App'>
			{/* <Header/> */}
			<RouterProvider router={router}/>
      {/* <Footer/> */}
    </div>
  )
}

export default App

import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './page/Home'
import About from './page/About'
import SignIn from './page/SignIn'
import SignUp from './page/SignUp'
import Projects from './page/Projects'
import Dashboard from './page/Dashboard'
import Header  from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/sign-in' element={<SignIn />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Route>
        <Route path='/projects' element={<Projects />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
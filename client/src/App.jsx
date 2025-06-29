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
import OnlyAdminPrivateRoute, { OnlyAuthorPrivateRoute } from './components/OnlyAdminPrivateRoute'
import CreatePost from './page/CreatePost'
import UpdatePost from './page/UpdatePost'
import PostPage from './page/PostPage'
import ScrollToTop from './components/ScrollToTop'
import Search from './page/Search'
import NewHome from './page/NewHome'
import NewHeader from './components/NewHeader'
import NewFooter from './components/NewFooter'
import Category from './page/Category'
import NewPostPage from './page/NewPostPage'
import AuthorPosts from './page/AuthorPosts'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/newhome' element={<NewHome />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/sign-in' element={<SignIn />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/search' element={<Search />}></Route>
        <Route path='/category' element={<Category />}></Route>
        <Route path='/newpostpage' element={<NewPostPage />}></Route>
        <Route path='/author' element={<AuthorPosts />}></Route>
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Route>
        <Route element={<OnlyAuthorPrivateRoute/>}>
          <Route path='/create-post' element={<CreatePost />}></Route>
          <Route path='/update-post/:postId' element={<UpdatePost />}></Route>
        </Route>
        <Route path='/projects' element={<Projects />}></Route>
        <Route path='/post/:postSlug' element={<NewPostPage />}></Route>
      </Routes>
      <NewFooter />
    </BrowserRouter>
  )
}
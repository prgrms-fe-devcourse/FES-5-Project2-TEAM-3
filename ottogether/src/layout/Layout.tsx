import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import ScrollManager from "./ScrollManager"

function Layout() {
  return (
    <>
      <Header />
      <ScrollManager />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
export default Layout
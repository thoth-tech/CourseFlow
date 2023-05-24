import './App.css';
import Header from './components/header'
import Footer from './components/footer'
import Chart from './components/chart'
import Sidebar from './components/sidebar'

const App = () => {
  return (
    <>
      <Header />
      <main>
        <div className="app">
        <Sidebar />
        <Chart />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default App;

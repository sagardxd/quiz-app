import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage';
import StartExamPage from './pages/StartExamPage ';
import AddQuestionPage from './pages/AddQuestionsPage ';
import UpdateQuestionPage from './pages/UpdateQuestionPage';
import AddExcelQuestion from "./pages/AddExcelQuestion";
import Instructions from "./pages/Instructions";


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/add-questions" element={<AddQuestionPage/>}/>
      <Route path="/update-question/:id" element={<UpdateQuestionPage/>} />
      <Route path="/start-exam" element={<StartExamPage/>}/>
      <Route path="/add-questions-excel" element={<AddExcelQuestion/>}/>
      <Route path="/instructions" element={<Instructions/>}/>


    </Routes>
  </BrowserRouter>
  )
}

export default App

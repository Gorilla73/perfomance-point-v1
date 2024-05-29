import Header from "./components/Header/Header";
import ContainerMainPage from "./components/ContainerMainPage/Container/ContainerMainPage";

import "./App.css"
import ContainerUpcomingMatch from "./components/ContainerUpcomingMatch/Container/ContainerUpcomingMatch";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ContainerChampionshipPage from "./components/ContainerChampionshipPage/ContainerChampionshipPage";
import ContainerTeamPage from "./components/ContainerTeamPage/ContainerTeamPage";
import RegistrationPage from "./components/ContainerRegistrationPage/RegistrationPage";
import AuthorizationPage from "./components/ContainerAuthorizationPage/AuthorizationPage";
import axios from "axios";
import {useEffect, useState} from "react";
import Footer from "./components/Footer/Footer";
import ProfilePage from "./components/ContainerProfilePage/ProfilePage";

import setCookie from "./utils/setCookie";
import getCookie from "./utils/getCookie";
import ConfirmEmail from "./components/ContainerProfilePage/ContainerConfirmEmail/ConfirmEmail";


function App() {
    // setCookie('exampleCookie', 'exampleValue', 7);
    // const cookieValue = getCookie('exampleCookie');


    const [currentUser, setCurrentUser] = useState();

    const handleCurrentUser = (value) => {
        setCurrentUser(value)
    }


    useEffect(() => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            setCurrentUser(true);
        }
    }, []);

    return (
        <div className="App">

            <Router>
                <Header currentUser={currentUser} onCurrentUser={handleCurrentUser}/>
                <div className='main-content'>
                    <Routes>
                        <Route path='/' element={<ContainerMainPage currentUser={currentUser}/>}/>
                        <Route path='/login' element={<AuthorizationPage onCurrentUser={handleCurrentUser}/>}/>
                        <Route path='/profile' element={<ProfilePage currentUser={currentUser} onCurrentUser={handleCurrentUser}/>}/>
                        <Route path='/registration' element={<RegistrationPage onCurrentUser={handleCurrentUser}/>}/>
                        <Route path='/confirm-email/:key' element={<ConfirmEmail onCurrentUser={handleCurrentUser}/>}/>
                        <Route path='upcoming_match/:id' element={<ContainerUpcomingMatch/>}/>
                        <Route path='championship/:id' element={<ContainerChampionshipPage/>}/>
                        <Route path='team/:id' element={<ContainerTeamPage/>}/>
                    </Routes>
                </div>
                <Footer/>
            </Router>

        </div>
    );
}

export default App;


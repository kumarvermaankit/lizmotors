import React from "react"
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import GPS from "./gps";


function App() {

    return (
        <div>

            <Router>
                <Routes>
                    <Route exact path="/" element={<GPS />}>

                    </Route>

                </Routes>

            </Router>


        </div>
    )
}

export default App;

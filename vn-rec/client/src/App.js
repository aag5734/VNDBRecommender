import rena from './assets/rena.jpg';
import React, {useState} from "react";
import {useFormik} from "formik"
import './App.css';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getUser } from './components/Connection';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';                                  

function App() {
  const [showVNS, setShowVNS] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formSubmit = (e) => {
    if (formik.values.username.length !== 0) {
      getUser(formik.values.username, function(data) {
        if (data === null) {
          setErrorMsg("That user doesn't exist.")
          setShowError(true);
          setShowVNS(false);
        } else {
          setShowError(false);
          setShowVNS(true);
        }
      });
    } else {
      setErrorMsg("Please enter your VNDB username");
      setShowError(true);
      setShowVNS(false);
    }
  }

  const githubRedirect = (e) => {
    window.location.href = "https://github.com/aag5734/VNDBRecommender";
  }

  const formik = useFormik({
    initialValues: {
      username:''
    },
    onSubmit: formSubmit
  });

  const SuggestedVNS = () => (
    <div className='suggested'>
      Testing!
    </div>
  )

  const InputError = () => (
    <div className='input-error'>
      {errorMsg}
    </div>
  )

  return (
    <div className="vndb">
      <header className="vndbHeader">
        <img src={rena} className="funnyRena" alt="logo"/>
        <h1>
          Visual Novel Recommender
        </h1>
        <i className='pi pi-github' style={{ fontSize: '2.0rem' }} onClick={()=>{githubRedirect()}}></i>
        <form onSubmit={formik.handleSubmit}>
          <br/>
          <label htmlFor='username'>username</label>
          <span className="p-float-label">
            <InputText
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
          </span>
          <Button type="submit">Submit</Button>
        </form>
        <br/>
        {showError ? <InputError/> : null}
        {showVNS ? <SuggestedVNS/> : null}
      </header>
    </div>
  );
}

export default App;

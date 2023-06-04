import rena from './assets/rena.jpg';
import React, {useRef, useState} from "react";
import {useFormik} from "formik"
import './App.css';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { getUserList } from './components/Connection';
import "primereact/resources/themes/lara-dark-purple/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';                                  

function App() {
  const [showVNS, setShowVNS] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userList, setUserList] = useState(null);
  const toast = useRef(null);

  const getTopTags = (e) => {
    console.log(userList);
  }


  const formSubmit = (e) => {
    if (formik.values.username.length !== 0) {
      getUserList(formik.values.username, function(data) {
        if (data === null) {
          toast.current.show({
             severity: 'error',
             summary: 'Error',
             detail: "User doesn't exist"
          });
          setShowError(true);
          setShowVNS(false);
        } else {
          setUserList(data);
          setShowError(false);
          setShowVNS(true);
          getTopTags();
        }
      });
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter your VNDB username'
     });
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
      Because you're a fan of TOPVNSHERE:
      <ul>
        <li>Thing 1</li>
        <li>Thing 2</li>
        <li>Thing 3</li>
      </ul>
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
          <Toast ref={toast} />
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

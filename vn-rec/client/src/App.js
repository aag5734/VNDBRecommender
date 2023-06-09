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
  const [userList, setUserList] = useState(null);
  const tagDict = {};
  const toast = useRef(null);

  const formSubmit = (e) => {
    if (formik.values.username.length !== 0) {
      getUserList(formik.values.username, function(data) {
        if (data === null) {
          toast.current.show({
             severity: 'error',
             summary: 'Error',
             detail: "User doesn't exist"
          });
          setShowVNS(false);
        } else {
          setUserList(data);
          setShowVNS(true);
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].vn.tags.length; j++) {
              if (!tagDict.hasOwnProperty(data[i].vn.tags[j].name)) {
                tagDict[data[i].vn.tags[j].name] = "1";
              } else {
                let newVal = (parseInt(tagDict[data[i].vn.tags[j].name]) + 1).toString();
                tagDict[data[i].vn.tags[j].name] = newVal;
              }
            }
          }
          let sortedTags = [];
          for (var tag in tagDict) {
              if (sortedTags.length === 50) {
                break;
              }
              sortedTags.push([tag, tagDict[tag]]);
          }
          sortedTags.sort(function(a, b) {
              return b[1] - a[1];
          });
          console.log(sortedTags);
        }
      });
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter your VNDB username'
     });
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
        {showVNS ? <SuggestedVNS/> : null}
      </header>
    </div>
  );
}

export default App;

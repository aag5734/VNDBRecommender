import rena from './assets/rena.jpg';
import React, {useRef, useState} from "react";
import {useFormik} from "formik"
import './App.css';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { getUserList, getSuggestedVNS } from './components/Connection';
import "primereact/resources/themes/lara-dark-purple/theme.css";     
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';       
import 'primeflex/primeflex.css';                           

function App() {
  const [showVNS, setShowVNS] = useState(false);
  const [userList, setUserList] = useState(null);
  const topFiftyTags = [];
  const [recommendedVNS, setVNS] = useState([]);
  const tagDict = {};
  const toast = useRef(null);

  // Handles form submission and makes calls to Kana API to get a list of
  // recomended visual novels
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
          // goes through each tag in the user's visual novel list and places
          // them into a dictionary, with the key being the tag id and the value
          // being the number of times the tag appears
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].vn.tags.length; j++) {
              if (!tagDict.hasOwnProperty(data[i].vn.tags[j].id)) {
                tagDict[data[i].vn.tags[j].id] = "1";
              } else {
                let newVal = (parseInt(tagDict[data[i].vn.tags[j].id]) + 1).toString();
                tagDict[data[i].vn.tags[j].id] = newVal;
              }
            }
          }
          // using the tag dictionary to get the user's top 50 tags
          for (var tag in tagDict) {
              if (topFiftyTags.length === 50) {
                break;
              }
              topFiftyTags.push([tag, tagDict[tag]]);
          }
          topFiftyTags.sort(function(a, b) {
              return b[1] - a[1];
          });
          // using the top ten tags to create a curated list of suggested visual novels
          let tags = []
          while (tags.length !== 10) {
            tags.push(topFiftyTags[Math.floor(Math.random() * topFiftyTags.length)]);
          }
          getSuggestedVNS(tags, function(data) {
            setVNS(data.results);
          })
          setShowVNS(true);
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
      username: '',
    },
    onSubmit: formSubmit
  });

  // visual novel block element
  const itemTemplate = (vn) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={vn.image.url} alt={vn.title} />
            <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                    <div className="text-2xl font-bold text-900">{vn.title}</div>
                </div>
            </div>
        </div>
        </div>
    );
  }

  const SuggestedVNS = () => (
    <div className="suggested">
      <DataView value={recommendedVNS} itemTemplate={itemTemplate} />
    </div>
  )

  return (
    <div className="vndb">
      <header className="vndbHeader">
        <img src={rena} className="funnyRena" alt="logo"/>
        <h1>
          Visual Novel Recommender
        </h1>
        {/* Link to github repo */}
        <i className='pi pi-github' style={{ fontSize: '2.0rem' }} onClick={()=>{githubRedirect()}}></i>
        <br/>
        {/* Username form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Username text box */}
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
          {/* Toggle on/off NSFW suggestions */}
          <label>
            <input
              type="checkbox"
              name="allowNSFW"
              onChange={formik.handleChange}
              checked={formik.values.agreeToTerms}
            />
            NSFW
          </label>
          <br/>
          <br/>

          <Toast ref={toast} />
          <Button type="submit">Submit</Button>
        </form>
        <br/>
        {/* Displays a list of visual novels upon completion */}
        {showVNS ? <SuggestedVNS/> : null}
      </header>
    </div>
  );
}

export default App;

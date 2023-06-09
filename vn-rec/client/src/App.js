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
          for (var tag in tagDict) {
              if (topFiftyTags.length === 50) {
                break;
              }
              topFiftyTags.push([tag, tagDict[tag]]);
          }
          topFiftyTags.sort(function(a, b) {
              return b[1] - a[1];
          });
          console.log(topFiftyTags);
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
      username:''
    },
    onSubmit: formSubmit
  });

  const itemTemplate = (vn) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={vn.image.url} alt={vn.title} />
            <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                    <div className="text-2xl font-bold text-900">{vn.title}</div>
                    {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
                    {/* <div className="flex align-items-center gap-3">
                        <span className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.category}</span>
                        </span>
                        <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>
                    </div> */}
                </div>
                {/* <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                    <span className="text-2xl font-semibold">${product.price}</span>
                    <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                </div> */}
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

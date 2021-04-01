import axios from 'axios';
import {useState} from 'react';
import {
  IonApp,
  IonAlert,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonTextarea,
  IonInput,
  IonItem,
  IonButton
} from '@ionic/react';

import config from './config/config.js';

import './App.scss';

const translateEndpoint = "https://api.cognitive.microsofttranslator.com";
const location = 'eastus';
const headers = {
  'Ocp-Apim-Subscription-Key': config.translateKey,
  'Ocp-Apim-Subscription-Region': location,
  'Content-type': 'application/json',
}
const talking = 
<svg width="62" height="58" viewBox="0 0 62 58" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect x="62" y="58" width="62" height="58" rx="29" transform="rotate(-180 62 58)" fill="#EF6806"/>
<rect width="52" height="48" transform="matrix(-1 0 0 1 60 5)" fill="url(#pattern0)"/>
<defs>
<pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0" transform="translate(0 -0.0416667) scale(0.00390625 0.00423177)"/>
</pattern>
<image id="image0" width="256" height="256" xlinkHref="data:image/png;base64,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"/>
</defs>
</svg>
const thumbsUp =<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.04163 21.875H5.20829V9.37501H1.04163V21.875ZM23.9583 10.4167C23.9583 9.27084 23.0208 8.33334 21.875 8.33334H15.302L16.2916 3.57292L16.3229 3.23959C16.3229 2.81251 16.1458 2.41667 15.8645 2.13542L14.7604 1.04167L7.90621 7.90626C7.52079 8.28126 7.29163 8.80209 7.29163 9.37501V19.7917C7.29163 20.9375 8.22913 21.875 9.37496 21.875H18.75C19.6145 21.875 20.3541 21.3542 20.6666 20.6042L23.8125 13.2604C23.9062 13.0208 23.9583 12.7708 23.9583 12.5V10.4167Z" fill="white"/>
</svg>
const thumbsDown=<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.625 3.125H6.24996C5.38538 3.125 4.64579 3.64583 4.33329 4.39583L1.18746 11.7396C1.09371 11.9792 1.04163 12.2292 1.04163 12.5V14.5833C1.04163 15.7292 1.97913 16.6667 3.12496 16.6667H9.69788L8.70829 21.4271L8.67704 21.7604C8.67704 22.1875 8.85413 22.5833 9.13538 22.8646L10.2395 23.9583L17.1041 17.0937C17.4791 16.7187 17.7083 16.1979 17.7083 15.625V5.20833C17.7083 4.0625 16.7708 3.125 15.625 3.125ZM19.7916 3.125V15.625H23.9583V3.125H19.7916Z" fill="white"/>
</svg>






const App = () => {
  
  const [lostInput, setLostInput] = useState('');
  const [lostTranslated, setLostTranslated] = useState('Awaiting translation...');
  const [helperInput, setHelperInput] = useState('');
  const [helperTranslated, setHelperTranslated] = useState('Esperando traducción...');
  const [lostAlert, setLostAlert] = useState(false);
  const [lostRateReceived, setLostRateReceived] = useState('Awaiting rating...');
  const [helperAlert, setHelperAlert] = useState(false);
  const [helperRateReceived, setHelperRateReceived] = useState('Esperando calificación...');

  const translateText = (props) => {
    console.log(props.text, props.sourceLang, props.targetLang);
    let dictionary = {
      'Spanish': 'es',
      'English': 'en'
    };
    let msg = JSON.stringify([{text: props.text}]);
    let source = dictionary[props.sourceLang];
    let target = dictionary[props.targetLang];
  
    return axios.post(`${translateEndpoint}/translate`, msg, {
      headers: headers,
      params: {
          'api-version': '3.0',
          'from': source,
          'to': target
      },
      responseType: 'json'
    })
    .then((response) => {
      console.log(response.data);
      let translation = response.data[0].translations[0].text;
      return translation;
    })
  }
  const lostTranslate = (text) => {
    let props = {
      text:text,
      sourceLang:"Spanish",
      targetLang:"English"
      }
    console.log(text);
    translateText(props).then((translated) => {
      setLostTranslated(translated);
    })
  }
  const helpTranslate = (text) => {
    let props = {
      text:text,
      sourceLang:"English",
      targetLang:"Spanish"
      }

    translateText(props).then((translated) => {
      setHelperTranslated(translated);
    })
  }

  return (
    <IonApp>
    <div className="App-container">
      <div className="lost-user-container">
        <Header />
        {lostAlert && (
          <div>AHHHHHH</div>
        )}
        <div className="outlined-container-dark">
          <LanguagePicker sourceLang="Español" targetLang="Inglés" headerSource="Usted" headerTarget="Él"/>
          <TextEntryBlock receivedd={helperRateReceived} state={lostInput} translate={lostTranslate} setState={setLostInput}headerText="¿DÓNDE TIENE QUE IR?" defaultText={<div>Hello! I need directions to <span className="translated">{lostTranslated}</span>. If you are able to provide directions, please respond!</div>}/>
        </div>
        <div className="alt-container">
        <ReceiveBlock howWas="Como era el traduccion?" setNoReceiveText="Try rephrasing your text!" setReceived={setLostRateReceived} setAlert={setHelperAlert} setReceivedText="They understood!" headerText="ÉL DIJO:" defaultText={<div>Tengo direcciones para usted. <p className="translated">{helperTranslated}</p></div>}/>
        </div>
      </div>
      <a href="https://ufl.qualtrics.com/jfe/form/SV_cvHPHdmjbks9YVg" target="_blank"><IonButton className='external2'>Take survey!</IonButton></a>
      <div className='helper-user-container'>
        <Header />
        {helperAlert && (
          <div>AHHHHHH</div>
        )}
        <div className="outlined-container-light">
          <LanguagePicker sourceLang="English" targetLang="Spanish" headerSource="You" headerTarget="Them"/>
          <ReceiveBlock howWas="How was the translation?" setNoReceiveText="Intenta reformular usted texto." setReceived={setHelperRateReceived} setAlert={setLostAlert} setReceivedText="¡Él entendió!" headerText="WHERE DO THEY WANT TO GO?" defaultText={<div>Hello! I need directions to <span className="translated">{lostTranslated}</span>. If you are able to provide directions, please respond!</div>}/>
        </div>
        <div className="alt-container">
        <TextEntryBlock receivedd={lostRateReceived} state={helperInput} translate={helpTranslate} setState={setHelperInput} headerText="TYPE YOUR DIRECTIONS!" defaultText={<div>Tengo direcciones para usted. <p className="translated">{helperTranslated}</p></div>}/>
        </div>
      </div>

    </div>
    </IonApp>
  );
}

const Header = () => {
  return (
    <header className="header-container">
          <img src='https://i.imgur.com/Ro3G3Tl.png'/>
          <h1>TRANS-NAV</h1>
    </header>
  )
}

const LanguagePicker = ({sourceLang, targetLang, headerSource, headerTarget}) => {
  return (
    <div className="language-container">
      <div className="translate-from">
        <h5>{headerSource}</h5>
        <div className="lang">{sourceLang}</div>
      </div>
      <img className="swap"/>
      <div className="translate-to">
        <h5>{headerTarget}</h5>
        <div className="lang">{targetLang}</div>
      </div>
    </div>
  )
}

const TextEntryBlock = ({headerText, defaultText, state, setState, translate, receivedd}) => {
  return (
    <div className="text-entry-container">
      <h4>{headerText}</h4>
      <IonItem className="text-entry">
        <IonTextarea value={state} onIonChange={e => setState(e.detail.value)} rows="1" required={true}/>
      </IonItem>
      <IconAndBubble iconType translate={translate} input={state} defaultText={defaultText}/>
      <RaterAwait received={receivedd}/>
    </div>
  )
}

const ReceiveBlock = ({headerText, defaultText, howWas, setReceived, setNoReceiveText, setAlert, setReceivedText}) => {
  console.log("RECEIVE", setReceivedText);
  let text=setReceivedText;
  return (
    <div className="receive-container">
      <h4>{headerText}</h4>
      <IconAndBubble defaultText={defaultText}/>
      <Rater howWas={howWas} setNoReceiveText={setNoReceiveText} setReceived={setReceived} setAlert={setAlert} setReceivedText={text}/>
    </div>
  )
}

const Rater = ({setReceived, setReceivedText, setNoReceiveText, howWas, setAlert}) => {
  console.log("AHH", setReceivedText);
  return(
    <div className="rater-container">
        <p>{howWas}</p>
        <div className="rate-buttons">
          <div className="rate" onClick={() => setReceived(setReceivedText)}>{thumbsUp}</div>
          <div className="rate" onClick={() => setReceived(setNoReceiveText)}>{thumbsDown}</div>
        </div>
    </div>
  )
}

const RaterAwait = ({received}) => {
  console.log("received", received);
  if(received.includes("reformular") || received.includes("rephras")) {
    return (
      <div className="rater-container">
        <p>{`${received}`}</p>
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTUwMS4zNjIsMzgzLjk1TDMyMC40OTcsNTEuNDc0Yy0yOS4wNTktNDguOTIxLTk5Ljg5Ni00OC45ODYtMTI4Ljk5NCwwTDEwLjY0NywzODMuOTUgICAgYy0yOS43MDYsNDkuOTg5LDYuMjU5LDExMy4yOTEsNjQuNDgyLDExMy4yOTFoMzYxLjczNkM0OTUuMDM5LDQ5Ny4yNDEsNTMxLjA2OCw0MzMuOTksNTAxLjM2MiwzODMuOTV6IE0yNTYsNDM3LjI0MSAgICBjLTE2LjUzOCwwLTMwLTEzLjQ2Mi0zMC0zMGMwLTE2LjUzOCwxMy40NjItMzAsMzAtMzBjMTYuNTM4LDAsMzAsMTMuNDYyLDMwLDMwQzI4Niw0MjMuNzc5LDI3Mi41MzgsNDM3LjI0MSwyNTYsNDM3LjI0MXogICAgIE0yODYsMzE3LjI0MWMwLDE2LjUzOC0xMy40NjIsMzAtMzAsMzBjLTE2LjUzOCwwLTMwLTEzLjQ2Mi0zMC0zMHYtMTUwYzAtMTYuNTM4LDEzLjQ2Mi0zMCwzMC0zMGMxNi41MzgsMCwzMCwxMy40NjIsMzAsMzAgICAgVjMxNy4yNDF6IiBmaWxsPSIjZmZhYjZkIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" />      </div>
    )
  }
  return(
    <div className="rater-container">
      <p>{`${received}`}</p>
    </div>
  )
}

const IconAndBubble = ({iconType, translate, input, defaultText, text}) => {
  return (
  <div className="talk-block">
        {iconType ? (<div className="icon" onClick={() => translate(input)}>{talking}<p>Press to send</p></div>) : null}
        <div className="speech-bubble">
          <p>{defaultText} {text}</p>
        </div>
  </div>
  )
}


export default App;

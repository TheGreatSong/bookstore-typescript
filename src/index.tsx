import 'semantic-ui-css/semantic.min.css';

import * as serviceWorker from './serviceWorker';

import Amplify from 'aws-amplify';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import config from './aws-exports';

Amplify.configure(config); // amplify 서비스 사용 설정. 이 scope 안에서 쓰겠다.
// 앱이 실행 직후에 바로 설정해야 되니까.
// 설정을 켰어. 

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

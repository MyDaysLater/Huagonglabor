import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { configure } from 'mobx';
// import DevTools from 'mobx-react-devtools';

import moment from 'moment';
import 'moment/locale/zh-cn';

import './index.less';
import './anxin_iconfont.css';
// import '../public/iconfont_anxin.less'
import App from './App';
import * as serviceWorker from './serviceWorker';
import stores from './stores';

moment.locale('zh-cn');

configure({ enforceActions: 'always' }); // 开启严格模式
ReactDOM.render(
	<Provider {...stores}>
		<BrowserRouter>
			<App />
			{/* <DevTools /> */}
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

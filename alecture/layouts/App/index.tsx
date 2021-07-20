import React,{FC} from 'react';
import loadable from '@loadable/component';
import {Switch,Route,Redirect} from 'react-router-dom';


const LogIn = loadable(()=>import('@pages/LogIn'));
const SignUp = loadable(()=>import('@pages/SignUp'));
const Workspace = loadable(()=>import('@layouts/Workspace'));

const App:FC = () => {
  return (
  <Switch>
    <Redirect exact path="/" to="/login"/>
    <Route path="/login" component={LogIn}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="/workspace/:workspace" component={Workspace}/>
  </Switch>
  );
};

// 주소/:asdfsadf
//asdfasdf는 라우트 파라미터로 값을 사용자가 바꿀 수 있따.
export default App;

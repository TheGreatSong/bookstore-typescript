import { Auth, Hub } from 'aws-amplify';
import React, { FC, memo, useEffect, useState } from 'react'
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import BookDetail from './pages/bookDetail'
import BookShelf from './pages/bookShelf'
import Cart from './pages/cart'
import { Container } from 'semantic-ui-react'
import HeadPart from './components/headPart'
import SignIn from './pages/signIn' // 로그인 컴포넌트

export type TAuthState = {
  authState: string;
  authData?: any;
  authError?: any;
}

type TPrivateRouteProps = {
  component: FC<any>;
  authState: string;
  [s: string]: any;
}

// history, location, match
const PrivateRoute: FC<TPrivateRouteProps> = ({ component: Component, authState, ...rest }) => (
  <Route
    {...rest}
    render={(props: any) =>
      authState === 'signedIn' ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signIn',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

export default memo(() => {
  const [{ authState }, setSignIn] = useState<TAuthState>({
    authState: 'loading',
    authData: null,
    authError: null
  });
  // Hub : 리스너
  Hub.listen('auth', (data) => {
    switch(data.payload.event) {
      case 'signIn':
        // prevState : 나머지값들을 대응시키기 위해서
        // prevState를 안 쓰면 authError 같은 값이 날아감. 아예 없어짐.
        setSignIn(prevState => ({ ...prevState, authState: 'signedIn', authData: data.payload.data }));
        break;
      case 'signIn_failure':
        setSignIn(prevState => ({ ...prevState, authState: 'signIn', authData: null, authError: data.payload.data }));
        break;
      default:
        break;
    }
  })
  useEffect(() => { // componentDidMount 역할
    Auth.currentAuthenticatedUser().then(user => {
      console.log({ user })
      setSignIn({ authState: 'signedIn' })
    }).catch(e => {
      console.log({ e })
      setSignIn({ authState: 'signIn' })
    })
  }, [])
  return (
    <Router>
      <Container fluid>
        <HeadPart setSignIn={setSignIn} />
        <Switch>
          <PrivateRoute exact path='/' component={BookShelf} authState={authState} />
          <Route path='/signIn' render={(props) => <SignIn {...props} authState={authState} />} />          
          <PrivateRoute path='/detail/:isbn' component={BookDetail} authState={authState} />
          <PrivateRoute path='/cart' component={Cart} authState={authState} />
        </Switch>
      </Container>
    </Router>
  )
})

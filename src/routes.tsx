import React, { memo } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import BookDetail from './pages/bookDetail'
import BookShelf from './pages/bookShelf'
import Cart from './pages/cart'
import { Container } from 'semantic-ui-react'
import HeadPart from './components/headPart'
// 외부 주석 남기는 법.
export default memo(() => {
  return (
    <Router>{/* inline 주석 남기는 법 
     Router가 동작 가능한 Props를 넘겨줌.*/}
      <Container fluid>
        <HeadPart />
        <Switch>{/* 하나만 걸려라. 원래는 순서를 잘 지켜야 함. */}
          <Route exact path='/' component={BookShelf} />
          <Route path='/detail/:isbn' component={BookDetail} />
          <Route path='/detail' component={BookDetail} /> {/* param 있는게 위로 */}
          <Route path='/cart' component={Cart} />
        </Switch>
      </Container>
    </Router>
  )
})

import { Button, Header, Icon, Label, Segment } from 'semantic-ui-react'
import React, { Dispatch, memo, useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { Auth } from 'aws-amplify';
import { TAuthState } from '../routes';
import toWon from '../utils/formatCurrency'
import { useStateValue } from '../contexts/bookReducer'

type THeadPartProps = {
  setSignIn: Dispatch<TAuthState>
}

// TODO: length에 number도 돌려서 계산해야함

export default memo<THeadPartProps>(({ setSignIn }) => {
  const { push } = useHistory()
  const { pathname } = useLocation()
  const [isPathCart, setPath] = useState(false)
  const [{ account, cartProducts: { length: cartLength } }] = useStateValue()
  useEffect(() => {
    if (pathname === '/cart') {
      setPath(true)
    } else {
      setPath(false)
    }
  }, [pathname])
  const navigateToCart = useCallback(() => {
    if (!isPathCart) {
      push('/cart')
    }
  }, [push, isPathCart])
  const signOut = useCallback(() => {
    Auth.signOut().then(() => {
      setSignIn({ authState: 'signIn'})
    }).catch((e: any) => {
      console.log({ e })
    })
  }, [setSignIn])
  return (
    <Segment textAlign='center' raised>
      <Header as='h1'>React Book Store</Header>      
      <Label size='large' image attached='top right'>
        <Icon name='money' />
        <Label.Detail>{toWon(account)}</Label.Detail>
      </Label>
      <Button.Group floated='right'>
        <Button
          as="span"
          color='teal'
          compact
        >
          <Icon name='user circle' />
          송조현
        </Button>    
        <Button
          disabled={isPathCart}
          onClick={navigateToCart}
        >
          <Icon name='cart' />
          {!!cartLength && (
            <Button
              as="span"
              size="tiny"
              circular
              color="red"
              compact
              content={cartLength}
            />
          )}
        </Button>          
        <Button
          negative
          onClick={signOut}
        >
          <Icon name='sign-out' />
        </Button>
      </Button.Group> 
    </Segment>
  )
})

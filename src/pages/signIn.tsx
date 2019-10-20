import { Button, Container } from 'semantic-ui-react';
import React, { useEffect } from 'react'

import { useHistory } from 'react-router-dom';
import { withOAuth } from 'aws-amplify-react';

export default withOAuth(({ OAuthSignIn, authState }: any) => {
  const { replace } = useHistory();
  useEffect(() => {
    if (authState === 'signedIn') {
      replace('/')
    }
  }, [replace, authState])
  return (
    <Container textAlign='center'>
      <Button 
        icon="google" 
        content="Google Sign In" 
        labelPosition="left"
        onClick={OAuthSignIn}
      />
    </Container>
  )
})

import {
  Button,
  Container,
  Grid,
  Header,
  Image,
  Label,
  Rail,
  Segment,
} from 'semantic-ui-react'
import React, { memo, useCallback, useMemo } from 'react'
import bookList, { TBook } from '../assets/data/books'
import { useHistory, useParams } from 'react-router-dom'

import toWon from '../utils/formatCurrency'
import { useStateValue } from '../contexts/bookReducer'

type TISBN = Pick<TBook, 'isbn'> // typescript 문법 : 하나 뽑아서 별도의 타입을 하나 만든다.

const BookDetail = memo<TISBN>(({ isbn }) => {
  const [, dispatch] = useStateValue()
  const {
    img,
    title,
    author,
    publisher,
    release,
    price,
    description,
  } = useMemo(
    () => (bookList.find(({ isbn: bid }) => bid === isbn) as TBook) || {},
    [isbn],
  )
  const formattedDesc = useMemo(
    () =>
      description
        ? description.split('\r\n').map((desc, i) => <p key={i}>{desc}</p>)
        : null,
    [description],
  )
  return (
    <Container>
      <Grid centered padded columns='two'>
        <Grid.Row>
          <Grid.Column>
            <Image src={img} fluid />
          </Grid.Column>
          <Grid.Column>
            <Segment.Group>
              <Segment>
                <Header as='h2' textAlign='center'>
                  {title}
                </Header>
                <Segment.Inline>
                  <Label ribbon='right'>{`Release Date: ${release}`}</Label>
                </Segment.Inline>
              </Segment>
              <Segment>{`Author: ${author}`}</Segment>
              <Segment>{`Publisher: ${publisher}`}</Segment>
              <Segment>{formattedDesc}</Segment>
            </Segment.Group>
            <Button
              content={toWon(price)}
              floated='right'
              icon='cart plus'
              labelPosition='left'
              onClick={useCallback(() => {
                dispatch({
                  type: 'add-item',
                  isbn,
                  price,
                  title,
                })
              }, [dispatch, isbn, price, title])}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
})

export default memo(() => {
    const { goBack } = useHistory()
    const { isbn } = useParams() // props를 받아서 뽑는다. 이름 틀리면 undefind
    return (
      <Segment raised>
        <Grid centered padded>
          <Grid.Column>
            <Header as='h1' content='Purchased Items' textAlign='center' />
            <Rail attached internal position='right'>
              <Button.Group>
                <Button
                  content='Go back'
                  icon='step backward'
                  labelPosition='left'
                  onClick={useCallback(() => {
                    goBack()
                  }, [goBack])}
                />
                <Button.Or />
                <Button
                  content='Reset'
                  icon='undo'
                  negative
                  labelPosition='right'
                />
              </Button.Group>
            </Rail>
            <BookDetail isbn={isbn} />
          </Grid.Column>
        </Grid>
      </Segment>
    )
  },
)
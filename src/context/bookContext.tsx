import React, { FC, ReactNode, useReducer, createContext, useContext, Dispatch } from 'react';
import uuidV1 from 'uuid/v1';
import bookList, { TBook } from '../assets/data/books';

/**
 * 리듀서 관련 데이터는 여기.
 */

export type TCartProduct = TBook & {
  pid: string,
  number: number
}

// 장바구니 상태
type TState = {
  account: number,
  cartProducts: TCartProduct[]
}

type TAddItemAction = {
  type: 'add-item',
  price: number,
  bid: number
}

type TRemoveAction = {
  type: 'remove-item',
  price: number,
  pid: string
}

type TResetAction = {
  type: 'reset-cart'
}

// 액션들을 설정함.
export type TAction = TAddItemAction | TRemoveAction | TResetAction

// 넣어줄 Context
// Dispatch : react-redux에서 hooks 사용하기
type TContext = [TState, Dispatch<TAction>]

const initialState: TState = {
  account: 40000,
  cartProducts: []
}

// 내부 상태 관리 reducer.
const reducer = (state: TState, action: TAction) => {
  const cartProducts = [...state.cartProducts] // 책 리스트를 가지고 오는구먼.
  switch (action.type) {
    case 'add-item': {
      const { bid, price } = action
      // cartProducts가 list임.
      // TCart.bookId를 기준으로 머시기 함.
      const productIndex = cartProducts.findIndex(({ bookId }) => bookId === bid)
      if (productIndex > -1) {
        // 못 찾음.
        // 이건 왜 한겨.
        cartProducts[productIndex].number += 1
      } else {
        // 찾음.
        const book = bookList.find(({ bookId }) => bookId === bid) // book 객체를 불러옴.
        if (book) {
          // 객체 있으면~
          const newProduct = {
            ...book,
            number: 1,
            pid: uuidV1() // uuid를 생성
          }
          // 그래서 넣어.
          cartProducts.push(newProduct)
        }
      }
      return {
        account: state.account - price,
        cartProducts
      }
    }
    case 'remove-item': {
      const { pid, price } = action
      const productIndex = cartProducts.findIndex(({ pid: productId }) => productId === pid) // 무조건 존재함
      const productNumInCart = cartProducts[productIndex].number
      if (productNumInCart > 1) {
        cartProducts[productIndex].number -= 1
      } else {
        cartProducts.splice(productIndex, 1)
      }
      return {
        account: state.account + price,
        cartProducts
      }
    }
    case 'reset-cart':
      return initialState
    default:
      return state
  }
}

// createContext로 만들면 Provider가 생김. 그걸로 내부 children에 전달.
const StateContext = createContext<TContext>([initialState, () => null]);

// reducer의 머시기를 거시기한테 날림
/**
 * StateContext : 
 * StateContext.Provider : 
 * useReducer : 
 */
export const StateProvider: FC<ReactNode> = ({ children }) => (
  // context로 children 컴포넌트를 감쌈.
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useStateValue = () => useContext(StateContext)

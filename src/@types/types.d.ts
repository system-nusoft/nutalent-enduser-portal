/**
 * Defined some of the common types
 */
type ReactNode = import('react').ReactNode
type ReactChild = import('react').ReactChild
type ReactChildren = import('react').ReactChildren
type Component = import('react').Component
type TFunction = () => void
type TObject = Record<string, number, string, undefined, boolean, TFunction>
type TArrayOfObjects = Array<string, TObject>
type TNumberOrString = number | string
type TFunctionOrObject = TFunction | TObject

/**
 * Redux Store types
 */
type TDispatch = import('../store/index').AppDispatch
type TReduxState = import('../store/index').ReduxState

/**
 * Defined an interfce example
 */
interface ILoginDataProps {
  username: string,
  password: string,
}

interface IHttpRequestOptions {
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
}

interface IActionOptions {
  dispatch?: TDispatch;
  state: TReduxState;
}

interface IActionButton {
  dataCy?: string;
  onClick: TFunction;
  text?: string;
}

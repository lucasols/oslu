import { css } from 'goober'

export const globalStyle = css`
  line-height: 1.5;

  &,
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    flex-shrink: 0;
  }

  button {
    border: 0;
    font-family: inherit;
    font-size: inherit;
    background: transparent;
    cursor: pointer;
  }
`

import './Button.css';

const Button = ({text, move='', disabled=false, onclick}) => {
  return (
    <button className={`btn ${move}`} disabled={disabled} onClick={onclick}>{text}</button>
  )
}

export default Button

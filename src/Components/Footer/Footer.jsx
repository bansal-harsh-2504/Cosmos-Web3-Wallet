import './Footer.css';

const Footer = ({position}) => {
  return (
    <div className={`footer ${position}`}>
      Designed and Developed by{" "}
      <a href="https://github.com/bansal-harsh-2504/">Harsh</a>
    </div>
  );
};

export default Footer;

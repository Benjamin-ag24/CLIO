import { cardBaseStyles } from "./Card.styles";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`${cardBaseStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
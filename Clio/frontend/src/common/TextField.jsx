import { labelStyles, inputStyles } from "./TextField.styles";

const TextField = ({ label, ...props }) => {
  return (
    <div>
      <label className={labelStyles}>
        {label}
      </label>
      <input
        {...props}
        className={inputStyles}
      />
    </div>
  );
};

export default TextField;
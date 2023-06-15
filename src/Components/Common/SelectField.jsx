import { Field } from "formik";
import { FormFeedback } from "reactstrap";
const SelectField = ({
  id,
  name,
  value,
  options,
  onChange,
  touched,
  errors,
  label,
  fieldName,
}) => (
  <div>
    <Field
      as="select"
      className={`form-select mb-3 ${
        touched[name] && errors[name] ? "is-invalid" : touched[name] && !errors[name] ? "is-valid" : ""
      }`}
      id={id}
      name={name}
      onChange={onChange}
      value={value}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option[fieldName] }
        </option>
      ))}
    </Field>
    {touched[name] && errors[name] && (
      <FormFeedback type="invalid">{errors[name]}</FormFeedback>
    )}
  </div>
);

export default SelectField;
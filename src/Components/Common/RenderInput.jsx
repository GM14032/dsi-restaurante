import {
  Input,
  FormFeedback,
} from "reactstrap";
export function RenderInput({validation, fieldName, placeholder, handleChange,type}) {
    const isInvalid = validation.touched[fieldName] && validation.errors[fieldName];
  
    return (
      <>
        <Input
          type={type}
          className="form-control"
          name={fieldName}
          id={fieldName}
          value={validation.values && validation.values[fieldName] ? validation.values[fieldName] : ''}
          onChange={handleChange}
          placeholder={placeholder}
          onBlur={validation.handleBlur}
          invalid={isInvalid}
          valid={validation.touched[fieldName] && !validation.errors[fieldName]}
        />
        {isInvalid && (
          <FormFeedback type="invalid">
            {validation.errors[fieldName]}
          </FormFeedback>
        )}
      </>
    );
  }
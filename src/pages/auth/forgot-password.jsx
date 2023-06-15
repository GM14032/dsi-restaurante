import React, { useEffect,useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";

import Link from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../../Components/AuthenticationInner/ParticlesAuth";

const ForgetPasswordPage = (props) => {
  const [forgetError, setError] = useState("");
  const [forgetSuccessMsg, setSuccessMsg] = useState("");
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
		handleSubmit(values.email);
      console.log(values, props.history);
    },
  });
  const handleSubmit = async (email ) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify({email})
	  }).catch(error => console.error(error));
	if(response){
	  if (response.ok) {	
		setSuccessMsg("Email de restablecimiento de contraseña enviado.")	
		
	  } else {
		   console.log("Login failed.");
		  setError("El correo no corresponde a ningun usuario");
	}}else{
		  console.log("Invalid server");
		  setError("Invalid server");
	}	  
  };
  useEffect(() => {
    localStorage.removeItem('token'); 
  }, []);
  return (
    <ParticlesAuth title="Forget password">
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link href="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="20" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">
                  DSI RESTAURANTE
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">
                      ¿Has olvidado tu contraseña?
                    </h5>
                    <p className="text-muted">Restablecer contraseña</p>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    ></lord-icon>
                  </div>

                  <Alert
                    className="alert-borderless alert-warning text-center mb-2 mx-2"
                    role="alert"
                  >
                    ¡Ingrese su correo electrónico y se le enviarán las
                    instrucciones!
                  </Alert>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            <div>{validation.errors.email}</div>
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">
                          Enviar Link
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Espera, Recuerdo mi contraseña...{" "}
                  <Link
                    href="/auth/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Click aqui{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default ForgetPasswordPage;

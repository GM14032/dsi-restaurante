import React, { useState } from "react";
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
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../../public/logo-light.png";
import ParticlesAuth from "../../Components/AuthenticationInner/ParticlesAuth";
import {postRequest} from "@/api";
export async function getServerSideProps(context) {
  const { query } = context;
  var isValidToken= false;
  
  if (query && query.token) {    
    const { token } = query;
  
    const tokenValidate = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/reset-password/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  token }),
      }
    ).catch((error) => console.error(error));
    if (tokenValidate.ok) {
      isValidToken = true;
      console.log(isValidToken)
    }
  }

  return {
    props: {
      isValidToken,
    },
  };
}
const ResetPasswordPage = (isValidToken) => {
  const router = useRouter();
  const [forgetError, setError] = useState("");
  const [forgetSuccessMsg, setSuccessMsg] = useState("");
  const token = router.query.token;
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Ingrese una contraseña"),
    }),
    onSubmit: (values) => {
      handleSubmit(values.password);
    },
  });
  const handleSubmit = async (password) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      }
    ).catch((error) => console.error(error));
    if (response) {
      if (response.ok) {
        setSuccessMsg("Se restablecio la contraseña.");
        router.push("/auth/login");
      } else {
        console.log("Login failed.");
        setError("Error");
      }
    } else {
      console.log("Invalid server");
      setError("Invalid server");
    }
  };
  
  return (
    <ParticlesAuth title="Reset password">
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
                <p className="mt-3 fs-15 fw-medium">DSI RESTAURANTE</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
           
              <Card className="mt-4">
                {isValidToken.isValidToken ? (                  
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Restablecer contraseña</h5>
                      <p className="text-muted">Ingrese una nueva contraseña</p>

                      <lord-icon
                        src="https://cdn.lordicon.com/rhvddzym.json"
                        trigger="loop"
                        colors="primary:#0ab39c"
                        className="avatar-xl"
                        style={{ width: "120px", height: "120px" }}
                      ></lord-icon>
                    </div>
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
                          <Label className="form-label">Nueva contraseña</Label>
                          <Input
                            name="password"
                            className="form-control"
                            placeholder="Ingrese una nueva contraseña"
                            type="password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              <div>{validation.errors.password}</div>
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="text-center mt-4">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            Reestablecer contraseña
                          </button>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                ) : (
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Enlace Invalido</h5>
                      <p className="text-muted">
                        Parece que puede haber hecho clic en un enlace no
                        válido. Por favor cierra esta ventana y vuelva a
                        intentarlo.
                      </p>

                      <lord-icon
                        src="https://cdn.lordicon.com/rhvddzym.json"
                        trigger="loop"
                        colors="primary:#0ab39c"
                        className="avatar-xl"
                        style={{ width: "120px", height: "120px" }}
                      ></lord-icon>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        <Link
                          href="/auth/login"
                          className="fw-semibold text-primary text-decoration-underline"
                        >
                          {" "}
                          Regresar al login{" "}
                        </Link>{" "}
                      </p>
                    </div>
                  </CardBody>
                )}
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  <Link
                    href="/auth/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Regresar al login{" "}
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

export default ResetPasswordPage;

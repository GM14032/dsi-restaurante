import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../../Components/AuthenticationInner/ParticlesAuth";
import Link from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../assets/images/logo-light.png";

export default function login() {
  const router = useRouter();
  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Validar si tengo una sesion activa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // Redirigir al dashboard si ya hay un token guardado
    }
  }, [router]);
  //Validacion del formulario del login
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userLogin.email || "admin" || "",
      password: userLogin.password || "root" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your usrename"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      handleSubmit(values.email, values.password);
    },
  });

  const handleSubmit = async (username, password) => {
    console.log(process.env.NEXT_PUBLIC_LOGIN_URL)
    const response = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).catch((error) => console.error(error));
    if (response) {
      if (response.ok) {
        const { accessToken } = await response.json();
        localStorage.setItem("token", accessToken);
        router.push("/");
      } else {
        console.log("Login failed.");
        setError("Incorrect username or password");
      }
    } else {
      console.log("Invalid server");
      setError("Invalid server");
    }
  };

  return (
    <ParticlesAuth title="SignIn">
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
                <p className="mt-3 fs-15 fw-medium">DSI - Restaurante</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p className="text-muted">
                      Inicia sesión para continuar...{" "}
                    </p>
                  </div>
                  {error && error ? (
                    <Alert color="danger"> {error} </Alert>
                  ) : null}
                  <div className="p-2 mt-4">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return;
                      }}
                      action="#"
                    >
                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">
                          Username
                        </Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter username"
                          type="text"
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
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <div className="float-end">
                          <Link
                            href="/auth/forgot-password"
                            className="text-muted"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Label className="form-label" htmlFor="password-input">
                          Password
                        </Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
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
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            id="password-addon"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>

                      <div className="form-check">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="auth-remember-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="auth-remember-check"
                        >
                          Remember me
                        </Label>
                      </div>

                      <div className="mt-4">
                        <Button
                          color="secondary"
                          disabled={error ? null : loading ? true : false}
                          className="w-100"
                          type="submit"
                        >
                          {loading ? (
                            <Spinner size="sm" className="me-2">
                              {" "}
                              Loading...{" "}
                            </Spinner>
                          ) : null}
                          Sign In
                        </Button>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="signin-other-title">
                          <h5 className="fs-13 mb-4 title">Sign In with</h5>
                        </div>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
}

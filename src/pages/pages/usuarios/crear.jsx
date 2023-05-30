import React, { useState,useEffect } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";

import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardHeader,
  Label,
  Input,
  Form,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "@/Layouts";
import * as Yup from "yup";
import { Formik, useFormik, Field } from "formik";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export async function getServerSideProps() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/roles/");
    const data = await response.json();
    console.log(data);
    return {
      props: { data },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { error: "Ocurrió un error al obtener los roles." },
    };
  }
}
const CrearUsuarios = ({ data, error }) => {
  const router = useRouter();
  const [name, setNombre] = useState("");
  const [lastname, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setTelefono] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRole] = useState("");
  const [errorCreate, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const handleSubmit = async () => {
    const valid = await validation.validateForm();
    if (Object.keys(valid).length > 0) {
      return;
    }
  
    const role = data.filter((item) => item.id === parseInt(rol))[0];
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastname,
          email,
          phone,
          username,
          password,
          role,
        }),
      }
    );
    if (response.ok) {
      router.push({
        pathname: '/pages/usuarios',
        query: { mensaje: 'Usuario creado con éxito!!!' }
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
      setMensaje("Error al crear el usuario: " + errorBody.message);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      rol: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Por favor ingrese el nombre"),
      lastname: Yup.string().required("Por favor ingrese el apellido"),
      email: Yup.string().email("Por favor ingrese un correo electrónico válido").required("Por favor ingrese el email"),
      phone: Yup.string().required("Por favor ingrese el telefono"),
      username: Yup.string().required("Por favor ingrese el usuario"),
      password: Yup.string().required("Por favor ingrese la contraseña"),
      rol: Yup.string()
        .required("Por favor seleccione un rol")
        .min(1, "Por favor seleccione un rol"),
    }),
  });
  useEffect(() => {
    if (submitClicked) {
      if (errorCreate) {
        toast(mensaje, {
          position: "top-right",
          hideProgressBar: false,
          className: `bg-warning text-white`,
          progress: undefined,
          toastId: "",

        });
      }   
      setSubmitClicked(false);
    }
  }, [errorCreate, mensaje, submitClicked]);
  return (
    <Layout title="Crear usuario">
      <Container fluid>
        <BreadCrumb title="Usuarios" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Agregar Usuarios</h4>
              </CardHeader>
              <CardBody className="card-body">
                <Card>
                  <CardBody>
                    <div className="live-preview">
                    {error ? (
                        <>
                          {toast(error, {
                            position: "top-right",
                            hideProgressBar: false,
                            className: "bg-danger text-white",
                            progress: undefined,
                            toastId: "",
                          })}
                          <ToastContainer autoClose={2000} limit={1} />
                        </>
                      ) : null}
                      
                      <Formik>
                        <Form
                          className="needs-validation"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit(handleSubmit());
                            return false;
                          }}
                        >
                            <>
                              <ToastContainer autoClose={2000} limit={1} />
                            </>
                        
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="name"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Nombre
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                type="text"
                                className="form-control"
                                id="name"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setNombre(event.target.value);
                                }}
                                placeholder="Ingrese el nombre"
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                  validation.errors.name
                                    ? true
                                    : false
                                }
                                valid={
                                  validation.touched.name &&
                                  !validation.errors.name
                                }
                              />
                              {validation.touched.name &&
                              validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="lastname"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Apellido
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                name="lastname"
                                placeholder="Ingrese el apellido"
                                type="text"
                                className="form-control"
                                id="lastname"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setApellido(event.target.value);
                                }}
                                onBlur={validation.handleBlur}
                                value={validation.values.lastname || ""}
                                invalid={
                                  validation.touched.lastname &&
                                  validation.errors.lastname
                                    ? true
                                    : false
                                }
                                valid={
                                  validation.touched.lastname &&
                                  !validation.errors.lastname
                                }
                              />
                              {validation.touched.lastname &&
                              validation.errors.lastname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.lastname}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="email"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Email
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                type="email"
                                className="form-control"
                                id="email"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setEmail(event.target.value);
                                }}
                                placeholder="Ingrese el email"
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                                valid={
                                  validation.touched.email &&
                                  !validation.errors.email
                                }
                              />
                              {validation.touched.email &&
                              validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="phone"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Telefono
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <InputMask
                                mask="(999) 9999-9999"
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || ""}
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setTelefono(event.target.value);
                                }}
                              >
                                {(inputProps) => (
                                  <Input
                                    {...inputProps}
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    placeholder="(503) 7456-7890"
                                    invalid={
                                      validation.touched.phone &&
                                      !!validation.errors.phone
                                    }
                                    valid={
                                      validation.touched.phone &&
                                      !validation.errors.phone
                                    }
                                  />
                                )}
                              </InputMask>
                              {validation.touched.phone &&
                            validation.errors.phone ? (
                              <FormFeedback type="invalid">
                                {validation.errors.phone}
                              </FormFeedback>
                            ) : null}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="username"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                username
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                type="text"
                                className="form-control"
                                id="username"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setUsername(event.target.value);
                                }}
                                placeholder="Ingrese el username"
                                onBlur={validation.handleBlur}
                                value={validation.values.username || ""}
                                invalid={
                                  validation.touched.username &&
                                  validation.errors.username
                                    ? true
                                    : false
                                }
                                valid={
                                  validation.touched.username &&
                                  !validation.errors.username
                                }
                              />
                              {validation.touched.username &&
                              validation.errors.username ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.username}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="password"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                password
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                type="password"
                                className="form-control"
                                id="password"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setPassword(event.target.value);
                                }}
                                placeholder="Ingrese la contraseña"
                                onBlur={validation.handleBlur}
                                value={validation.values.password || ""}
                                invalid={
                                  validation.touched.password &&
                                  validation.errors.password
                                    ? true
                                    : false
                                }
                                valid={
                                  validation.touched.password &&
                                  !validation.errors.password
                                }
                              />
                              {validation.touched.password &&
                              validation.errors.password ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.password}
                                </FormFeedback>
                              ) : null}
                             
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="Role"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Rol
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Field
                                as="select"
                                className={`form-select mb-3 ${
                                  validation.touched.rol &&
                                  validation.errors.rol
                                    ? "is-invalid"
                                    : validation.touched.rol &&
                                      !validation.errors.rol
                                    ? "is-valid"
                                    : ""
                                }`}
                                id="rol"
                                name="rol"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setRole(event.target.value);
                                }}
                                value={rol}
                              >
                                <option value="">Select your Status </option>
                                {data?.map((role) => (
                                  <option key={role.id} value={role.id}>
                                    {role.name}
                                  </option>
                                ))}
                              </Field>
                              {validation.touched.rol &&
                              validation.errors.rol ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.rol}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>

                          <Col lg={11}>
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-light btn-lg"
                                onClick={() =>
                                  (window.location.href = "/pages/usuarios")
                                }
                              >
                                Cancelar
                              </button>{" "}
                              <button
                                type="submit"
                                className="btn btn-primary btn-lg "
                              >
                                Guardar
                              </button>
                            </div>
                          </Col>
                        </Form>
                      </Formik>
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CrearUsuarios), { ssr: false });

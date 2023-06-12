import React, { useState } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import { ValidationUser } from "../../../constant/validations";
import { RenderInput } from "../../../Components/Common/RenderInput";
import { ToastEffect } from "../../../Components/Common/ToastEffect";
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
import { Formik, useFormik, Field } from "formik";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import { postRequest,getAll } from "@/api";
export async function getServerSideProps() {
  try {
    const response = await getAll("roles");
  const data = await response.json();
  
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
  const initialState = {
    name: "",
    lastname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    rol: "",
  };
  const [formState, setFormState] = useState(initialState);
  const [errorCreate, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const handleSubmit = async () => {
    const valid = await validation.validateForm();
    if (Object.keys(valid).length > 0) {
      return;
    }
    const role = data.filter((item) => item.id === parseInt(formState.rol))[0];
    const response = await postRequest( {
      name: formState.name,
      lastname: formState.lastname,
      email: formState.email,
      phone: formState.phone,
      username: formState.username,
      password: formState.password,
      role,
    },"users");
    if (response.ok) {
      router.push({
        pathname: "/pages/usuarios",
        query: { mensaje: "Usuario creado con éxito!!!" },
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
      setMensaje("Error al crear el usuario: " + errorBody.message);
    }
  };
  const handleChange = (event) => {
    validation.handleChange(event);
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialState,
    validationSchema: ValidationUser,
  });

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
                    <ToastEffect
                            submitClicked={true}
                            errorCreate={error}
                            mensaje={error}
                            setSubmitClicked={setSubmitClicked}
                            className="danger"
                          />

                      <Formik>
                        <Form
                          className="needs-validation"
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit(handleSubmit());
                            return false;
                          }}
                        >
                          <ToastEffect
                            submitClicked={submitClicked}
                            errorCreate={errorCreate}
                            mensaje={mensaje}
                            setSubmitClicked={setSubmitClicked}
                            className="warning"
                          />

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
                              <RenderInput
                                type="text"
                                validation={validation}
                                fieldName="name"
                                placeholder="Ingrese el nombre"
                                handleChange={handleChange}
                              />
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
                              <RenderInput
                                type="text"
                                validation={validation}
                                fieldName="lastname"
                                placeholder="Ingrese el apellido"
                                handleChange={handleChange}
                              />
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
                              <RenderInput
                                type="email"
                                validation={validation}
                                fieldName="email"
                                placeholder="Ingrese el email"
                                handleChange={handleChange}
                              />
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
                                onChange={handleChange}
                              >
                                {(inputProps) => (
                                  <Input
                                    {...inputProps}
                                    type="text"
                                    name="phone"
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
                              <RenderInput
                                type="text"
                                validation={validation}
                                fieldName="username"
                                placeholder="Ingrese el username"
                                handleChange={handleChange}
                              />
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
                              <RenderInput
                                type="password"
                                validation={validation}
                                fieldName="password"
                                placeholder="Ingrese la contraseña"
                                handleChange={handleChange}
                              />
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
                                onChange={handleChange}
                                value={formState.rol}
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

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/Layouts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
export async function getServerSideProps({ params }) {
  const { id } = params;

  const responseRoles = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/roles/"
  ).catch((error) => console.error(error));
  const roles = await responseRoles.json();

  const responseUsuario = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/find/${id}`
  ).catch((error) => console.error(error));

  let usuario = null;
  let errors = {};

  if (responseUsuario.ok) {
    usuario = await responseUsuario.json();
  } else if (responseUsuario.status === 404) {
    errors.usuario = "Usuario no encontrado";
  } else {
    errors.usuario = "Error al cargar el usuario";
  }

  if (!roles) {
    errors.roles = "Error al cargar los roles";
  }

  return {
    props: { roles, usuario, id, errors },
  };
}
import * as Yup from "yup";
import { Formik, useFormik, Field } from "formik";
import dynamic from "next/dynamic";
const Actualizar = ({ roles, usuario, id ,errors }) => {
  const [isChecked, setIsChecked] = useState(usuario?.enable ? true : false);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [values, setValues] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });
  const [rol, setSelectedRole] = useState(usuario?.role?.id);
  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }
  const handleSubmit = async () => {
    const valid = await validation.validateForm();
    console.log(valid);
    if (Object.keys(valid).length > 0) {
      return;
    }
    const role = roles.filter((item) => item.id === parseInt(rol))[0];

    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          phone: values.phone,
          username: values.username,
          password: values.password,
          role,
        }),
      }
    );
    if (response.ok) {
      router.push({
        pathname: '/pages/usuarios',
        query: { mensaje: 'Usuario actualizado con éxito!!!' }
      });
      const res = await response.json();
      console.log(res);
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
     setMensaje("Error al actualizar el usuario: " + errorBody.message);
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
      rol: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Por favor ingrese el nombre"),
      lastname: Yup.string().required("Por favor ingrese el apellido"),
      email: Yup.string().email("Por favor ingrese un correo electrónico válido").required("Por favor ingrese el email"),
      phone: Yup.string().required("Por favor ingrese el telefono"),
      username: Yup.string().required("Por favor ingrese el usuario"),
      rol: Yup.string()
        .required("Por favor seleccione un rol")
        .min(1, "Por favor seleccione un rol"),
    }),
  });
 

  useEffect(() => {
    const initialValues = {
      name: usuario?.name,
      lastname: usuario?.lastname,
      email: usuario?.email,
      phone: usuario?.phone,
      username: usuario?.username,
      rol: usuario?.role.name,
    };
    setValues(initialValues);
    validation.setValues(initialValues);
  }, []);
  const handleChange = (fieldName) => (event) => {
    validation.handleChange(event);
    setValues({
      ...values,
      [fieldName]: event.target.value,
    });
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join(", ");
      setMensaje(errorMessage);
      setTimeout(() => {
        router.push("/pages/usuarios");
      }, 2000);
    }
  }, [errors]);
  return (
    <Layout title="Actualizar usuarios">
      <Container fluid>
        <BreadCrumb title="Actualizar" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Actualizar Usuarios</h4>
              </CardHeader>
              <CardBody className="card-body">
                <Card>
                  <CardBody>
                    <div className="live-preview">
                    {mensaje ? (
                        <>
                          {toast(mensaje, {
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
                                onChange={handleChange("name")}
                                placeholder="Ingrese el nombre"
                                onBlur={validation.handleBlur}
                                value={values.name}
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
                                placeholder="Ingrese el apellido"
                                type="text"
                                className="form-control"
                                id="lastname"
                                onChange={handleChange("lastname")}
                                onBlur={validation.handleBlur}
                                value={values.lastname}
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
                                onChange={handleChange("email")}
                                placeholder="Ingrese el email"
                                onBlur={validation.handleBlur}
                                value={values.email}
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
                                value={values.phone}
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
                                onChange={handleChange("username")}
                                placeholder="Ingrese el username"
                                onBlur={validation.handleBlur}
                                value={values.username}
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
                                onChange={handleChange("password")}
                                placeholder="Ingrese la contraseña"
                                value={values.password}
                               
                              />
                             
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="enable"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Estado
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <div className="form-check form-check-success mb-3">
                                <Input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="enable"
                                  defaultChecked={isChecked}
                                  onChange={handleCheckboxChange}
                                />
                                <Label
                                  className="form-check-label"
                                  htmlFor="enable"
                                >
                                  {isChecked ? "Activo" : "Inactivo"}
                                </Label>
                              </div>
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
                                  setSelectedRole(event.target.value);
                                }}
                                value={rol}
                              >
                                {roles.map((role) => (
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
export default dynamic(() => Promise.resolve(Actualizar), { ssr: false });

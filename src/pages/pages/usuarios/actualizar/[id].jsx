import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/Layouts";
import { ToastEffect } from "../../../../Components/Common/ToastEffect";
import "react-toastify/dist/ReactToastify.css";
import InputMask from "react-input-mask";
import { ValidationUser } from "../../../../constant/validations";
import { RenderInput } from "../../../../Components/Common/RenderInput";
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
import { putRequest,getById,getAll } from "@/api";
import { Formik, useFormik, Field } from "formik";
import dynamic from "next/dynamic";

export async function getServerSideProps({ params }) {
  const { id } = params;
  let usuario = null;
  let errors = {};

  const responseUsuario = await getById(id,"users");
  if (!responseUsuario.ok) {
	return {
		props: {},
		notFound: true,
	  };		
  }  
  const responseRoles = await getAll("roles");
  const roles = await responseRoles.json();
 
  if (responseUsuario.ok) {
    usuario = await responseUsuario.json("roles");
  }  else {
    errors.usuario = "Error al cargar el usuario";
  }

  if (!roles) {
    errors.roles = "Error al cargar los roles";
  }

  return {
    props: { roles, usuario, id, errors },
  };
}

const Actualizar = ({ roles, usuario, id ,errors }) => {
  const [isChecked, setIsChecked] = useState(usuario?.enable ? true : false);
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const initialState = {
    name: "",
    lastname: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    isUpdate: true,
  };
  const [values, setValues] = useState(initialState);
  const [rol, setSelectedRole] = useState(usuario?.role?.id);
  const [errorCreate, setError] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

  const handleSubmit = async () => {
    if (!validation.isValid) return;
    const role = roles.filter((item) => item.id === parseInt(rol))[0];

    const response = await putRequest(id, {
      name: values.name,
          lastname: values.lastname,
          email: values.email,
          phone: values.phone,
          username: values.username,
          password: values.password,
          enable:isChecked,
          role,
    },"users");
    if (response.ok) {
      router.push({
        pathname: '/pages/usuarios',
        query: { mensaje: 'Usuario actualizado con éxito!!!' }
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
     setMensaje("Error al actualizar el usuario: " + errorBody.message);
    }
  };
  useEffect(() => {
    const initialValues = {
      name: usuario?.name,
      lastname: usuario?.lastname,
      email: usuario?.email,
      phone: usuario?.phone,
      username: usuario?.username,
      rol: usuario?.role?.name,
      isUpdate: true,
    };
    setValues(initialValues);
    
  }, []);
  const validation = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationUser,
    initialValues: values,
  });
 
 
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;
    validation.handleChange(event);
    setValues({
      ...values,
      [fieldName]: value,
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
                                value={validation.values?.phone || ""}
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
                              <Input
                                type="password"
                                className="form-control"
                                id="password"
                                onChange={handleChange}
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

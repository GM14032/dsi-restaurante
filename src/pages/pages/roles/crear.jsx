import React, { useState,useEffect } from "react";
import Layout from "@/Layouts";
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
import DualListBox from "react-dual-listbox";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export async function getServerSideProps() {
  try {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/permissions/").catch(
    (error) => console.error(error)
  );

  const permisosJson = await response.json();
  const permisos = permisosJson.reduce((acc, item) => {
    const { table, name } = item;
    const tableIndex = acc.findIndex((el) => el.label === table);
    if (tableIndex === -1) {
      acc.push({
        label: table,
        options: [{ label: name, value: name }],
      });
    } else {
      acc[tableIndex].options.push({ label: name, value: name });
    }

    return acc;
  }, []);
  return {
    props: { permisos, permisosJson },
  };
} catch (error) {
  console.error(error);
  return {
    props: { error: "Ocurrió un error al obtener los permisos." },
  };
}
}
const CrearRoles = ({ permisos, permisosJson,error }) => {
  const router = useRouter();
  const [name, setNombre] = useState("");
  const [description, setDescripcion] = useState("");
  const [errorCreate, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");  
  const [submitClicked, setSubmitClicked] = useState(false);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
    
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Por favor ingrese el nombre"),
      description: Yup.string().required("Por favor ingrese la descripcion"),
      
    }),
  });
  const [selectedFilter, setSelectedFilter] = useState([]);

  const handleSubmit = async () => {
    const valid = await validation.validateForm();
    const permissions = permisosJson.filter((obj) =>
      selectedFilter.includes(obj.name)
    );

    console.log(permissions);
    if (Object.keys(valid).length > 0) {
      return;
    }
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/roles/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        permissions,
      }),
    });
    if (response.ok) {
      router.push({
        pathname: '/pages/roles',
        query: { mensaje: 'Rol creado con éxito!!!' }
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
      setMensaje("Error al crear el rol: " + errorBody.message);
    }
  };
 
  const onFilterChange = (selectedFilter) => {
    setSelectedFilter(selectedFilter);
  };
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
    <Layout title="Roles">
      <Container fluid>
        <BreadCrumb title="Roles" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Agregar Roles</h4>
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
                                htmlFor="description"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Descripcion
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                placeholder="Ingrese la descripcion"
                                type="text"
                                className="form-control"
                                id="description"
                                onChange={(event) => {
                                  validation.handleChange(event);
                                  setDescripcion(event.target.value);
                                }}
                                onBlur={validation.handleBlur}
                                value={validation.values.description || ""}
                                invalid={
                                  validation.touched.description &&
                                  validation.errors.description
                                    ? true
                                    : false
                                }
                                valid={
                                  validation.touched.description &&
                                  !validation.errors.description
                                }
                              />
                              {validation.touched.description &&
                              validation.errors.description ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.description}
                                </FormFeedback>
                              ) : null}
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col lg={2}>
                              <Label
                                htmlFor="permiso"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Permisos
                              </Label>
                            </Col>
                            <Col lg={9} md={6}>
                              <div className="mb-3">
                                <DualListBox
                                  canFilter
                                  filterCallback={(permisos, filterInput) => {
                                    if (filterInput === "") {
                                      return true;
                                    }
                                    return new RegExp(filterInput, "i").test(
                                      permisos.label
                                    );
                                  }}
                                  filterPlaceholder="Search..."
                                  options={permisos}
                                  groupBy="label"
                                  selected={selectedFilter}
                                  onChange={onFilterChange}
                                  icons={{
                                    moveLeft: (
                                      <span
                                        className="mdi mdi-chevron-left"
                                        key="key"
                                      />
                                    ),
                                    moveAllLeft: [
                                      <span
                                        className="mdi mdi-chevron-double-left"
                                        key="key"
                                      />,
                                    ],
                                    moveRight: (
                                      <span
                                        className="mdi mdi-chevron-right"
                                        key="key"
                                      />
                                    ),
                                    moveAllRight: [
                                      <span
                                        className="mdi mdi-chevron-double-right"
                                        key="key"
                                      />,
                                    ],
                                    moveDown: (
                                      <span
                                        className="mdi mdi-chevron-down"
                                        key="key"
                                      />
                                    ),
                                    moveUp: (
                                      <span
                                        className="mdi mdi-chevron-up"
                                        key="key"
                                      />
                                    ),
                                    moveTop: (
                                      <span
                                        className="mdi mdi-chevron-double-up"
                                        key="key"
                                      />
                                    ),
                                    moveBottom: (
                                      <span
                                        className="mdi mdi-chevron-double-down"
                                        key="key"
                                      />
                                    ),
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>

                          <Col lg={11}>
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-light btn-lg"
                                onClick={() =>
                                  (window.location.href = "/pages/roles")
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
export default dynamic(() => Promise.resolve(CrearRoles), { ssr: false });


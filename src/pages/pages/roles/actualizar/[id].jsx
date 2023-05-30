import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import dynamic from "next/dynamic";

export async function getServerSideProps({ params }) {
  const { id } = params;
  const responsePermisos = await fetch(
    process.env.NEXT_PUBLIC_API_URL+"/permissions/"
  ).catch((error) => console.error(error));
  const permissionJson = await responsePermisos.json();
  
  const responseRole = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`
  ).catch((error) => console.error(error));
  const roles = await responseRole.json();

  const permisos = permissionJson.reduce((acc, item) => {
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

  const permisosRoles = roles.permissions.map((permiso) => permiso.name);
  return {
    props: { roles, permisos, id, permisosRoles, permissionJson},
  };
}

const Actualizar = ({ roles, permisos,  permisosRoles, id,permissionJson }) => {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", description: "",});
  const [selectedFilter, setSelectedFilter] = useState(permisosRoles);
  const [isChecked, setIsChecked] = useState(roles.enable ? true : false);
  const onFilterChange = (selectedFilter) => {setSelectedFilter(selectedFilter);};

 
  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }
  const handleSubmit = async () => {
    const permissions = permissionJson.filter((obj) =>
    selectedFilter.includes(obj.name)
  );
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        enable:values.enable,
        permissions,
      }),
    });
    if (response.ok) {
      router.push("/pages/roles");
      const res = await response.json();
      console.log(res);
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
    }
  };
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Por favor ingrese el nombre"),
      descrition: Yup.string().required("Por favor ingrese la descripcion"),
    }),
  });
  useEffect(() => {
    const initialValues = {
      name: roles.name,
      description: roles.description,
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
  return (
    <Layout title="Actualizar rol">
      <Container fluid>
        <BreadCrumb title="Actualizar" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Actualizar Roles</h4>
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
                                Descripcion
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <Input
                                placeholder="Ingrese la descripcion"
                                type="text"
                                className="form-control"
                                id="description"
                                onChange={handleChange("description")}
                                onBlur={validation.handleBlur}
                                value={values.description}
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
export default dynamic(() => Promise.resolve(Actualizar), { ssr: false });

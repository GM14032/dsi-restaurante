import React, { useState } from "react";
import Layout from "@/Layouts";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  CardHeader,
  Label,
  Form,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import { ValidationRole } from "../../../constant/validations";
import { ToastEffect } from "../../../Components/Common/ToastEffect";
import { RenderInput } from "../../../Components/Common/RenderInput";
export async function getServerSideProps() {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/permissions/"
    ).catch((error) => console.error(error));
    const permisosJson = await response.json();

    const permission = permisosJson.reduce((acc, permission) => {
      if (!acc.includes(permission.table)) {
        acc.push(permission.table);
      }
      return acc;
    }, []);

    const permisos = permission.map((table) => ({ table }));
    console.log(permisos);
    console.log(permisosJson);
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
const CrearRoles = ({ permisos, permisosJson, error }) => {
  const router = useRouter();
  const [errorCreate, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const initialState= { name: "", description: "",};
  const [formState, setFormState] = useState(initialState);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialState,
    validationSchema: ValidationRole,
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (event, row) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedRows([...selectedRows, { row, column: event.target.name }]);
    } else {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.row !== row)
      );
    }
  };
  const handleSubmit = async () => {
    const valid = await validation.validateForm();

    const permissions = permisosJson.filter((permission) => {
      return selectedRows.some(
        (selectedRow) =>
          selectedRow.row.table === permission.table &&
          permission.name.startsWith(selectedRow.column)
      );
    });
    if (Object.keys(valid).length > 0) {
      return;
    }
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/roles/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:formState.name,
          description:formState.description,
          permissions,
        }),
      }
    );
    if (response.ok) {
      router.push({
        pathname: "/pages/roles",
        query: { mensaje: "Rol creado con éxito!!!" },
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
      setMensaje("Error al crear el rol: " + errorBody.message);
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

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nombre</span>,
      selector: (row) => row.table,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Leer</span>,
      cell: (row) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          name="READ"
          value="option1"
          onChange={(event) => handleCheckboxChange(event, row)}
        />
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Crear/actualizar</span>,
      cell: (row) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          name="WRITE"
          value="option1"
          onChange={(event) => handleCheckboxChange(event, row)}
        />
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Inactivar</span>,
      cell: (row) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          name="DELETE"
          value="option1"
          onChange={(event) => handleCheckboxChange(event, row)}
        />
      ),
    },
  ];
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
                                htmlFor="description"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Descripcion
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <RenderInput
                                type="text"
                                validation={validation}
                                fieldName="description"
                                placeholder="Ingrese la descripcion"
                                handleChange={handleChange}
                              />
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
                              <DataTable
                                columns={columns}
                                data={permisos}
                                pagination
                              />
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

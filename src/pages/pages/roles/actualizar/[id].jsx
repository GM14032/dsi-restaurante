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
  Form,
  Input,
} from "reactstrap";
import BreadCrumb from "@/Components/Common/BreadCrumb";
import { Formik, useFormik } from "formik";
import dynamic from "next/dynamic";
import { ValidationRole } from "@/constant/validations";
import { RenderInput } from "@/Components/Common/RenderInput";
import DataTable from "react-data-table-component";
import { ToastEffect } from "../../../../Components/Common/ToastEffect";
import { putRequest,getById, getAll } from "@/api";
export async function getServerSideProps({ params }) {
  const { id } = params; 
  let allPermissions = null;
  let permission = null;
  let error=null
  const responseRole = await getById(id,"roles");
  if (!responseRole.ok) {
	return {
		props: {},
		notFound: true,
	  };		
  }  
  const roles = await responseRole.json();
  const responsePermissions = await getAll("permissions");
 
  if (responsePermissions.ok) {
     allPermissions = await responsePermissions.json();
     permission = {};
    allPermissions.forEach((permissions) => {
      const { table } = permissions;
      if (!permission[table]) {
        permission[table] = [];
      }
      permission[table].push(permissions);
    });
  }else{
    const errorBody = await response.json();
error="Error al obtener permisos: " + errorBody.message;
  }
 
  return {
    props: { roles, permission, id, allPermissions },
  };
}
const Actualizar = ({
  roles,
  permission,
  error,
  id,
  allPermissions,
}) => {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", description: "" });
  const [isChecked, setIsChecked] = useState(roles.enable ? true : false);
  const [selectedRows, setSelectedRows] = useState(roles.permissions);
  const [errorUpdate, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  
  const validation = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationRole,
  });
  useEffect(() => {
    const initialValues = {
      name: roles.name,
      description: roles.description,
    };
    setValues(initialValues);
    validation.setValues(initialValues);
  }, []);

  const handleSubmit = async () => {
    if (!validation.isValid) return;
    console.log(isChecked)
    const response = await putRequest(id, {
      name: values.name,
      description: values.description,
      enable: isChecked,
      permissions: selectedRows,
    },"roles");
    if (response.ok) {
      router.push({
        pathname: '/pages/roles',
        query: { mensaje: 'Rol actualizado con éxito!!!' }
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
     setMensaje("Error al actualizar el rol: " + errorBody.message);
    }
  };

  const handleChange = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;
    validation.handleChange(event);
    setValues({
      ...values,
      [fieldName]: value,
    });
  };

  /**
   *
   * @param {string} row: nombre de la tabla
   * @param {string} action: nombre de la accion 'READ', 'WRITE', 'DELETE'
   */
  const handleCheckboxChange = (row, action) => {
    const selected = allPermissions.find(
      (obj) => obj.table === row && obj.group === action
    );
    if (!selected) return; // si no existe el permiso no hace nada
    const isChecked = !selectedRows.some(
      (selectedRow) => selectedRow.table === row && selectedRow.group === action
    );
    if (isChecked) {
      // si no encontramos el permiso en el array de permisos seleccionados, lo agregamos
      setSelectedRows([...selectedRows, selected]);
    } else {
      // si lo encontramos, lo eliminamos
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow.id !== selected.id)
      );
    }
  };
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nombre</span>,
      selector: (_, index) => Object.keys(permission)[index],
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Leer</span>,
      cell: (row) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          id="READ"
          name="READ"
          value="option1"
          disabled={
            !allPermissions.some((r) => r.table === row && r.group === "READ")
          }
          onChange={(_) => handleCheckboxChange(row, "READ")}
          checked={selectedRows.some(
            (r) => r.table === row && r.group === "READ"
          )}
        />
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Crear/actualizar</span>,
      cell: (row) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          id="WRITE"
          name="WRITE"
          value="option1"
          disabled={
            !allPermissions.some((r) => r.table === row && r.group === "WRITE")
          }
          onChange={(_) => handleCheckboxChange(row, "WRITE")}
          checked={selectedRows.some(
            (r) => r.table === row && r.group === "WRITE"
          )}
        />
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Inactivar</span>,
      cell: (row) => (
        <input
          className="form-check-input fs-15"
          type="checkbox"
          id="DELETE"
          name="DELETE"
          value="option1"
          disabled={
            !allPermissions.some((r) => r.table === row && r.group === "DELETE")
          }
          onChange={(_) => handleCheckboxChange(row, "DELETE")}
          checked={selectedRows.some(
            (r) => r.table === row && r.group === "DELETE"
          )}
        />
      ),
    },
  ];

  function handleEnableCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

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
                    <ToastEffect
                            submitClicked={true}
                            errorCreate={error}
                            mensaje={error}
                            setSubmitClicked={setSubmitClicked}
                            className="danger"
                          />
                      <Formik validationSchema={ValidationRole}>
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
                            errorCreate={errorUpdate}
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
                                  onChange={handleEnableCheckboxChange}
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
                              <DataTable
                                columns={columns}
                                data={Object.keys(permission)}
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



export default dynamic(() => Promise.resolve(Actualizar), { ssr: false });

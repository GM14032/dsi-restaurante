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
import { Formik, useFormik } from "formik";
import dynamic from "next/dynamic";
import { ValidationRole } from "../../../../constant/validations";
import { RenderInput } from "../../../../Components/Common/RenderInput";
import DataTable from "react-data-table-component";
export async function getServerSideProps({ params }) {
  const { id } = params;
  const responsePermissions = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/permissions/"
  ).catch((error) => console.error(error));
  const allPermissions = await responsePermissions.json();

  const responseRole = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`
  ).catch((error) => console.error(error));
  const roles = await responseRole.json();
  const permission = {};

  allPermissions.forEach(permissions => {
    const { table } = permissions;
    if (!permission[table]) {
      permission[table] = [];
    }
    permission[table].push(permissions);
  });
  
console.log(permission)
  //const permissionRole = roles.permissions.map((permiso) => permiso.name);
  const permissionRole = roles.permissions
  return {
    props: { roles, permission, id, permissionRole, allPermissions },
  };
}

const Actualizar = ({
  roles,
  permission,
  permissionRole,
  id,
  allPermissions,
}) => {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", description: "" });
  const [selectedFilter, setSelectedFilter] = useState(permissionRole);
  const [isChecked, setIsChecked] = useState(roles.enable ? true : false);
 
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSubmit = async () => {
    const permissions = permissionJson.filter((obj) =>
      selectedFilter.includes(obj.name)
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          enable: values.enable,
          permissions,
        }),
      }
    );
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
  const handleChange = (fieldName) => (event) => {
    validation.handleChange(event);
    setValues({
      ...values,
      [fieldName]: event.target.value,
    });
  };

    const handleCheckboxChange = (event, row) => {
      if (!selectedRows.some(selectedRow => selectedRow.id === row.id)) {
        setSelectedRows([...selectedRows, row]);
        console.log("true")
      } else {
        setSelectedRows(selectedRows.filter(selectedRow => selectedRow.id !== row.id));
        console.log("false")
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
          onChange={(event) => handleCheckboxChange(event, row)}
          checked={selectedRows.some(r=> r.id === row.id)}
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
          onChange={(event) => handleCheckboxChange(event, row)}
          checked={selectedRows.some(r=> r.id === row.id)}
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
          onChange={(event) => handleCheckboxChange(event, row)}
          checked={permissionRole.some(permission => permission.group === "DELETE" && permission.table === row)}
     
        />
      ),
    },
  ];
  

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

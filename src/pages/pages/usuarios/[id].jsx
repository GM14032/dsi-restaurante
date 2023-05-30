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
  TabPane,
  Table,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Link from "next/link";
import dynamic from "next/dynamic";
 function Mostrar() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/find/${id}`
      ).catch((error) => console.error(error));
      if (
        response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        const errorBody = response.json();
        console.log(errorBody);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  console.log(data);
  return (
    <Layout title="Mostrar usuarios">
      <Container fluid>
        <BreadCrumb title="Ver detalles de usuario" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 flex-grow-1">Usuarios</h4>
                    <div>
                  <Link
                    href="/pages/usuarios"
                    className="btn btn-primary"
                  >
                    <i className="ri-arrow-left-fill align-bottom"></i> Volver
                  </Link>
                </div>
                  </CardHeader>
                  <CardBody>
                  <Col lg={10}>
                    {data && (
                      <Table className="table-borderless mb-0" style={{ marginLeft: "80px" }}>
                        <tbody>
                          <tr >
                            <th className="ps-0" scope="row"  >
                              Nombre :
                            </th>
                            <td className="text-muted pe-5">{data.name}</td>
                            <th className="ps-0" scope="row">
                              Apellido :
                            </th>
                            <td className="text-muted">{data.lastname}</td>
                          </tr>
                          <tr>
                            <th className="ps-0" scope="row">
                              Email :
                            </th>
                            <td className="text-muted">{data.email}</td>
                            <th className="ps-0" scope="row">
                              Telefono :
                            </th>
                            <td className="text-muted">{data.phone}</td>
                          </tr>
                          <tr>
                            <th className="ps-0" scope="row">
                              Username :
                            </th>
                            <td className="text-muted">{data.username}</td>
                            <th className="ps-0" scope="row">
                              Estado :
                            </th>
                            <td className="text-muted">
                              {data.enable ? "Activo" : "Inactivo"}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-0" scope="row">
                              Fecha de creacion :
                            </th>
                            <td className="text-muted">{data.createAt}</td>
                            <th className="ps-0" scope="row">
                              Ultima actualizacion :
                            </th>
                            <td className="text-muted">{data.updateAt}</td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                  </Col>
                  </CardBody>
                 
                </Card>
                <TabPane tabId="1">
                      <Row>
                        <Col xxl={4}>
                          <Card>
                            <CardBody>
                              <h5 className="card-title mb-3">Roles</h5>
                              <div className="table-responsive">
                                {data && (
                                  <Table className="table-borderless mb-0">
                                    <tbody>
                                      <tr>
                                        <th className="ps-0" scope="row">
                                          Nombre :
                                        </th>
                                        <td className="text-muted">
                                          {data.role?.name}
                                        </td>
                                      </tr>
                                      <tr>
                                        <th className="ps-0" scope="row">
                                          Descripcion :
                                        </th>
                                        <td className="text-muted">
                                          {data.role?.description}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xxl={8}>
                          <Card>
                            <CardBody>
                              <h5 className="card-title mb-3">Permisos</h5>
                              <div className="table-responsive">
                                <Table className="table-striped table-nowrap align-middle mb-0">
                                  {data && (
                                    <tbody>
                                      <tr>
                                        <th className="ps-0" scope="row">
                                          Nombre :
                                        </th>
                                        <th className="ps-0" scope="row">
                                          Descripcion :
                                        </th>
                                      </tr>
                                      {data.role?.permissions.map(
                                        (permissions) => (
                                          <tr>
                                            <td className="text-muted">
                                              {permissions.name}
                                            </td>
                                            <td className="text-muted">
                                              {permissions.description}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  )}
                                </Table>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(Mostrar), { ssr: false });
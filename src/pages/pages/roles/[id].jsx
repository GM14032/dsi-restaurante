import Layout from "@/Layouts";
import dynamic from "next/dynamic";
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
import { getById  } from "@/api";
export async function getServerSideProps({ params }) {
  const { id } = params; 
  const responseRole = await getById(id,"roles");
  if (!responseRole.ok) {
	return {
		props: {},
		notFound: true,
	  };		
  }  
  const data = await responseRole.json();
  return {
    props: { data},
  };
}
 function Mostrar({data}) {
  return (
    <Layout title="Ver rol">
      <Container fluid>
        <BreadCrumb title="Ver detalles del rol" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 flex-grow-1">Rol</h4>
                    <div>
                  <Link
                    href="/pages/roles"
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
                              Id :
                            </th>
                            <td className="text-muted pe-5">{data.id}</td>
                            <th className="ps-0" scope="row"  >
                              Nombre :
                            </th>
                            <td className="text-muted pe-5">{data.name}</td>
                            
                          </tr>
                          
                          <tr>
                          <th className="ps-0" scope="row">
                              descripcion :
                            </th>
                            <td className="text-muted">{data.description}</td>
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
                            <td className="text-muted">{data.create_at}</td>
                            <th className="ps-0" scope="row">
                              Ultima actualizacion :
                            </th>
                            <td className="text-muted">{data.update_at}</td>
                          </tr>
                        </tbody>
                      </Table>
                    )}
                  </Col>
                  </CardBody>
                 
                </Card>
                <TabPane tabId="1">
                      <Row>

                        <Col xxl={12}>
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
                                      {data?.permissions?.map(
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
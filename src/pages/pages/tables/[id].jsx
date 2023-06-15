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
  const responseTable = await getById(id,"table");
  if (!responseTable.ok) {
	return {
		props: {},
		notFound: true,
	  };		
  }  
  const data = await responseTable.json();
  return {
    props: { data},
  };
}
 function Mostrar({data}) {
  return (
    <Layout title="Ver mesa">
      <Container fluid>
        <BreadCrumb title="Ver detalles de mesa" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 flex-grow-1">Mesa</h4>
                    <div>
                  <Link
                    href="/pages/tables"
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
                              capacidad :
                            </th>
                            <td className="text-muted pe-5">{data.capacity}</td>
                            
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
               
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Mostrar), { ssr: false });
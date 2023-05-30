import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Grid, _ } from 'gridjs-react';

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
import Layout from "@/Layouts";
import dynamic from "next/dynamic";
export async function getServerSideProps() {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/permissions/").catch(
    (error) => console.error(error)
  );
  const data = await response.json();
  console.log(data)
  return {
    props: { data },
  };
}
const Permisos = ({ data }) => {
  return (
    <Layout title="Permisos">
      <Container fluid>
        <BreadCrumb title="Permisos" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
		  <Card>
              <CardBody>
			  <CardHeader>
                <h5 className="card-title mb-3">Permisos</h5>{' '}
				</CardHeader>
				
                <Grid
				data={data}
				columns={[
					{
						name: 'Nombre',
						id:'name',							
						formatter: (cell) => _(<span className='fw-semibold'>{cell}</span>),
					},
					{
						name: 'Descripcion',
						id: 'description',					
					  },				
					  {
						name: "Tabla",
						width: "150px",
						minWidth: "150px",
						id: "table",
					  },
					{
						name:'Estado',
						id:'enable',
						formatter: (cell) => _(<span
							className={`badge badge-soft-${
							  cell ? "success" : "danger"
							} fs-13`}
						  >{cell ? 'Activo' : 'Inactivo'}</span>),
						
					}
					
				]}
				search={true}
				sort={true}
				pagination={{ enabled: true, limit: 5 }}
			/>
              </CardBody>
            </Card>
            
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};


export default dynamic(() => Promise.resolve(Permisos), { ssr: false });

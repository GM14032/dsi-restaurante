import React,  { useState,useEffect}from "react";
import { useRouter } from 'next/router';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import decode from "jwt-decode";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import Layout from "@/Layouts";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TableIngredients } from "@/Components/product/TableIngredient";
function Ingredient() {
  const router = useRouter();
  const mensaje = router.query.mensaje || '';
  const [decoded, setDecoded] = useState();
  const [hasPermission, setHasPermission] = useState();
  useEffect(() => {
    if (window && window.localStorage) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decode(token);
        if (decoded !== null) {
          setDecoded(decoded);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (decoded) {
      setHasPermission(decoded.permission.includes("WRITE_INGREDIENT") );
    }
  }, [decoded]);
  return (
    <Layout title="Ingredients">
      {mensaje ?(
      <>
        {toast(mensaje, {
          position: "top-right",
          hideProgressBar: false,
          className: "bg-success text-white",
          progress: undefined,
          toastId: "",
        })}
        <ToastContainer autoClose={2000} limit={1} />
      </>
    ) : null}
      <Container fluid>
        <BreadCrumb title="Ingrediente" pageTitle="Pages" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0 flex-grow-1">Listado de Ingredientes</h4>
                <div>
                {hasPermission && (
                <>
                  <Link
                    href="/pages/products/crear"
                    className="btn btn-primary"
                  >
                    <i className="ri-add-box-line align-bottom"></i> Agregar
                  </Link> </>
              )}
                </div>
              </CardHeader>
              <CardBody>
                <div id="table-gridjs">
                  <TableIngredients/>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

      
      </Container>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Ingredient), { ssr: false });
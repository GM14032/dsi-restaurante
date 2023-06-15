import React, { useState } from "react";
import { useRouter } from "next/router";
import InputMask from "react-input-mask";
import { ValidationUser } from "../../../constant/validations";
import { RenderInput } from "../../../Components/Common/RenderInput";
import { ToastEffect } from "../../../Components/Common/ToastEffect";
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "@/Layouts";
import { Formik, useFormik, Field } from "formik";
import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";
import { postRequest } from "@/api";

const CrearMesas = ({ error }) => {
  const router = useRouter();
  const initialState = {
    capacity: "",
    description: ""
  };

  const [formState, setFormState] = useState(initialState);
  const [errorCreate, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleSubmit = async () => {
    const valid = await validation.validateForm();
    if (Object.keys(valid).length > 0) {
      return;
    }
    const response = await postRequest( {
      capacity: formState.capacity,
      description: formState.description,
    },"table/");
    if (response.ok) {
      router.push({
        pathname: "/pages/tables",
        query: { mensaje: "MESA creada con éxito!!!" },
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
      setMensaje("Error al crear la MESA: " + errorBody.message);
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

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialState,
    validationSchema: ValidationUser,
  });

  return (
    <Layout title="Crear Mesas">
      <Container fluid>
        <BreadCrumb title="Mesas" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Agregar Mesa</h4>
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
                                htmlFor="capacity"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Capacidad
                              </Label>
                            </Col>
                            <Col lg={9}>
                              <RenderInput
                                type="text"
                                validation={validation}
                                fieldName="capacity"
                                placeholder="Ingrese la capacidad"
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
                          

                          <Col lg={11}>
                            <div className="text-end">
                              <button
                                type="button"
                                className="btn btn-light btn-lg"
                                onClick={() =>
                                  (window.location.href = "/pages/tables")
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

export default dynamic(() => Promise.resolve(CrearMesas), { ssr: false });

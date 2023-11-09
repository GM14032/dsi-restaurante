import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/Layouts";
import { ToastEffect } from "../../../../Components/Common/ToastEffect";
import "react-toastify/dist/ReactToastify.css";
import InputMask from "react-input-mask";
import { ValidationIngredient } from "../../../../constant/validations";
import { RenderInput } from "../../../../Components/Common/RenderInput";
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
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { putRequest,getById,getAll } from "@/api";
import { Formik, useFormik, Field } from "formik";
import dynamic from "next/dynamic";

export async function getServerSideProps({ params }) {
  const { id } = params;
  let ingre = null;
  let errors = {};

  const responseUsuario = await getById(id,"ingredients");
  if (!responseUsuario.ok) {
	return {
		props: {},
		notFound: true,
	  };		
  }  
  const responseRoles = await getAll("roles");
  const roles = await responseRoles.json();
 
  if (responseUsuario.ok) {
    ingre = await responseUsuario.json("roles");
  }  else {
    errors.ingre = "Error al cargar el usuario";
  }

  if (!roles) {
    errors.roles = "Error al cargar los roles";
  }

  return {
    props: { roles, ingre, id, errors },
  };
}

const updateingre = ({ roles, ingre, id ,errors }) => {
 const [isChecked, setIsChecked] = useState(roles?.enable ? true : false);
  const router = useRouter();
  const [mensaje, setMensaje] = useState("");
  const initialState = {
    name: "",    
    description:"",
    unit:"",
    isUpdate: true,
  };
  const [values, setValues] = useState(initialState);
  const [errorCreate, setError] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

  const handleSubmit = async () => {
    if (!validation.isValid) return;
    console.log(isChecked)
    const response = await putRequest(id, {
      name: values.name,
      description: values.description,
      unit: values.unit,
    },"ingredients");
    if (response.ok) {
      router.push({
        pathname: '/pages/ingredient',
        query: { mensaje: 'Ingrediente actualizado con éxito!!!' }
      });
    } else {
      const errorBody = await response.json();
      console.log(errorBody);
      setError(true);
      setSubmitClicked(true);
     setMensaje("Error al actualizar el ingrediente: " + errorBody.message);
    }
  };
  useEffect(() => {
    const initialValues = {
      name: ingre?.name,
      description: ingre?.description,
      unit: ingre?.unit,
   
      isUpdate: true,
    };
    setValues(initialValues);
    
  }, []);
  const validation = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationIngredient,
    initialValues: values,
  });
 
 
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;
    validation.handleChange(event);
    setValues({
      ...values,
      [fieldName]: value,
    });
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join(", ");
      setMensaje(errorMessage);
      setTimeout(() => {
        router.push("/pages/ingredient");
      }, 2000);
    }
  }, [errors]);
  return (
    <Layout title="Actualizar Ingrediente">
      <Container fluid>
        <BreadCrumb title="Actualizar" pageTitle="Pages" />
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h4 className="card-title mb-0">Actualizar Ingrediente</h4>
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
                                placeholder="Ingrese el apellido"
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
                                htmlFor="unit"
                                className="form-label"
                                style={{ marginLeft: "80px" }}
                              >
                                Unidad
                              </Label>
                            </Col>
                            <Col lg={9}>
                            <RenderInput
                                type="text"
                                validation={validation}
                                fieldName="unit"
                                placeholder="Ingrese la unidad"
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
                                  (window.location.href = "/pages/ingredient")
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
export default dynamic(() => Promise.resolve(updateingre), { ssr: false });
import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useRouter } from "next/router";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { DefaultModalExample } from "../../../Components/ui-common/UiModalCode";
import Link from 'next/link';
import decode from "jwt-decode";
import { putRequest,getAll } from "@/api";
const TableRoles = () => {
  const [roles, setRoles] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const [decoded, setDecoded] = useState();
  const [hasPermission, setHasPermission] = useState({deleteRol: false, updateRol: false});
  const fetchRoles = async () => {
    try {
      const responseRoles = await getAll("roles");
  const data = await responseRoles.json();
      setRoles(data);
    } catch (error) {
      console.log(error)
    }
   
  };

  useEffect(() => {
    fetchRoles();
    setDataLoaded(true);
  }, []);
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
      const deleteRol = decoded.permission.includes("DELETE_ROLE");
      const updateRol = decoded.permission.includes("WRITE_ROLE");
      setHasPermission({...hasPermission, deleteRol, updateRol});
    }
  }, [decoded]);
  const handleInactivateRol = async () => {
    if (selectedRole) {
      var enable = true;
      const id = selectedRole.id;
      if (selectedRole.enable) enable = false;
      const response = await putRequest(id, {
        enable: enable,
      },"roles");
    
      if (response.ok) {
        const body = response.json();
        console.log(body);
        setmodal_standard(false);
        fetchRoles();
      } else {
        const errorBody = response.json();
        console.log(errorBody);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: <span className="font-weight-bold fs-13">Nombre</span>,
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Descripcion</span>,
        selector: (row) => row.description,
        sortable: true,
      },           
      {
        name: <span className="font-weight-bold fs-13">Estado</span>,
        selector: (row) => (
          <span
            className={`badge badge-soft-${
              row.enable ? "success" : "danger"
            } fs-13`}
          >
            {row.enable ? "Activo" : "Inactivo"}
          </span>
        ),
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Acciones</span>,
        selector: (row) => {
          return (
            <div>
              {hasPermission.deleteRol && (
                <>
                  <Button
                    color={row.enable ? "danger" : "warning"}
                    className="btn-icon"
                    title={row.enable ? "Inactivar rol" : "Activar rol"}
                    onClick={() => {
                      tog_standard();
                      setSelectedRole(row);
                    }}
                  >
                    <i
                      className={`bx bx-${row.enable ? "x" : "plus"}-circle`}
                    />
                  </Button>{" "}
                </>
              )}{" "}
             
              <Link href={`/pages/roles/${row.id}`}>
                <Button color="info" className="btn-icon" title="Ver rol">
                  <i className="bx bxs-show" />
                </Button>
              </Link>{" "}
                {hasPermission.updateRol && (
                  <>
              <Link href={`/pages/roles/actualizar/${row.id}`}>
              <Button
                color="success"
                className="btn-icon"
                title="Actualizar rol"
              >
                {" "}
                <i className=" bx bxs-edit" />{" "}
              </Button></Link></>)}
            </div>
          );
        },

        sortable: true,
      },
    ],
    [hasPermission]
  );

  function tog_standard() {
    setmodal_standard(!modal_standard);
  }

  return (
    dataLoaded && (
      <div>
        <DataTable
          columns={columns}
          data={roles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 15, 20]}
        />
        <div className="d-none code-view">
          <pre className="language-markup" style={{ height: "275px" }}>
            <DefaultModalExample />
          </pre>
        </div>
        <Modal
          id="myModal"
          isOpen={modal_standard}
          toggle={() => {
            tog_standard();
          }}
        >
          <ModalHeader
            className="modal-title"
            id="myModalLabel"
            toggle={() => {
              tog_standard();
            }}
          >
            {selectedRole?.enable ? "Inactivar " : "Activar "}roles
          </ModalHeader>
          <ModalBody>
            <h5 className="fs-15">
              ¿Desea {selectedRole?.enable ? "inactivar " : "activar "}el
              rol{" "}
              <b>
                {selectedRole?.name}
              </b>
              ?
            </h5>
          </ModalBody>
          <div className="modal-footer">
            <Button
              color="light"
              onClick={() => {
                tog_standard();
              }}
            >
              Cancelar
            </Button>
            <Button color="primary" onClick={handleInactivateRol}>
              Aceptar
            </Button>
          </div>
        </Modal>
      </div>
    )
  );
};

export { TableRoles };

import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { DefaultModalExample } from "../../../Components/ui-common/UiModalCode";
import Link from "next/link";
import decode from "jwt-decode";
import { putRequest,getAll  } from "@/api";
const TableUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const [decoded, setDecoded] = useState();
  const [hasPermission, setHasPermission] = useState({deleteUser: false, updateUser: false});
  const fetchUsers = async () => {
    const response = await getAll("users");
    const data = await response.json();
    setUsers(data);
  };
  useEffect(() => {
    fetchUsers();
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
      const deleteUser = decoded.permission.includes("DELETE_USER");
      const updateUser = decoded.permission.includes("WRITE_USER");
      setHasPermission({...hasPermission, deleteUser, updateUser});
    }
  }, [decoded]);
  const handleInactivateUser = async () => {
    if (selectedUser) {
      var enable = true;
      const id = selectedUser.id;
      if (selectedUser.enable) enable = false;
      const response = await putRequest(id, {
        enable: enable,
      },"users");
     
      if (response.ok) {
        setmodal_standard(false);
        fetchUsers();
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
        name: <span className="font-weight-bold fs-13">Apellido</span>,
        selector: (row) => row.lastname,
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Email</span>,
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Telefono</span>,
        selector: (row) => row.phone,
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Username</span>,
        selector: (row) => row.username,
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
              {hasPermission.deleteUser && (
                <>
                  <Button
                    color={row.enable ? "danger" : "warning"}
                    className="btn-icon"
                    title={row.enable ? "Inactivar usuario" : "Activar usuario"}
                    onClick={() => {
                      tog_standard();
                      setSelectedUser(row);
                    }}
                  >
                    <i
                      className={`bx bx-${row.enable ? "x" : "plus"}-circle`}
                    />
                  </Button>{" "}
                </>
              )}
                {hasPermission.updateUser && (
                  <>
              <Link href={`/pages/usuarios/actualizar/${row.id}`}>
                <Button
                  color="success"
                  className="btn-icon"
                  title="Actualizar usuario"
                >
                  {" "}
                  <i className=" bx bxs-edit" />{" "}
                </Button>
              </Link>{" "}
              <Link href={`/pages/usuarios/${row.id}`}>
                <Button color="info" className="btn-icon" title="Ver usuario">
                  <i className="bx bxs-show" />
                </Button>
              </Link></>)}{" "}
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
          data={users}
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
            {selectedUser?.enable ? "Inactivar " : "Activar "}usuarios
          </ModalHeader>
          <ModalBody>
            <h5 className="fs-15">
              ¿Desea {selectedUser?.enable ? "inactivar " : "activar "}el
              usuario{" "}
              <b>
                {selectedUser?.name} {selectedUser?.lastname}
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
            <Button color="primary" onClick={handleInactivateUser}>
              Aceptar
            </Button>
          </div>
        </Modal>
      </div>
    )
  );
};
export { TableUsuarios };

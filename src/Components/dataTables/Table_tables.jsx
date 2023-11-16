import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { DefaultModalExample } from "../ui-common/UiModalCode";
import Link from 'next/link';
import decode from "jwt-decode";
import { putRequest,getAll } from "@/api";
const Table_tables = ({ stateSelected = 0, startDate = '', endDate = '' }) => {
  const [tables, setTables] = useState([]);
  const [tableFiltered, setTableFiltered] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedRole, setSelectedTable] = useState(null);
  const [modal_standard, setmodal_standard] = useState(false);
  const [decoded, setDecoded] = useState();
  const [hasPermission, setHasPermission] = useState({deleteTable: false, updateTable: false});
  const fetchTables = async () => {
    try {
      setDataLoaded(false);
      const responseRoles = await getAll("table",`${startDate}${endDate}`);
  const data = await responseRoles.json();
     setTables(data);
    } catch (error) {
			setTables([]);
		} finally {
			setDataLoaded(true);
		}
   
  };

  useEffect(() => {
    fetchTables();
  }, [startDate, endDate]);
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
      const deleteTable = decoded.permission.includes("DELETE_TABLE");
      const updateTable = decoded.permission.includes("WRITE_TABLE");
      setHasPermission({...hasPermission, deleteTable, updateTable});
    }
  }, [decoded]);
  const handleInactivateTable = async () => {
    if (selectedTable) {
      var enable = true;
      const id = selectedTable.id;
      if (selectedTable.enable) enable = false;
      const response = await putRequest(id, {
        enable: enable,
      },'tables');
    
      if (response.ok) {
        const body = response.json();
        console.log(body);
        setmodal_standard(false);
        fetchTables();
      } else {
        const errorBody = response.json();
        console.log(errorBody);
      }
    }
  };
  useEffect(() => {
		setTableFiltered(
			tables.filter(
				(table) => table.id === stateSelected || !stateSelected
			)
		);
	}, [tables, stateSelected]);
  const columns = useMemo(
    () => [
      {
        name: <span className="font-weight-bold fs-13">Capacidad</span>,
        selector: (row) => row.capacity,
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Descripcion</span>,
        selector: (row) => row.description,
        sortable: true,
      },
      {
        name: <span className="font-weight-bold fs-13">Acciones</span>,
        selector: (row) => {
          return (
            <div>
              {hasPermission.deleteTable && (
                <>
                  <Button
                    color={row.capacity ? "danger" : "warning"}
                    className="btn-icon"
                    title={row.capacity ? "Inactivar rol" : "Activar rol"}
                    onClick={() => {
                      tog_standard();
                      setSelectedTable(row);
                    }}
                  >
                    <i
                      className={`bx bx-${row.capacity ? "x" : "plus"}-circle`}
                    />
                  </Button>{" "}
                </>
              )}{" "}
             
              <Link href={`/pages/tables/${row.id}`}>
                <Button color="info" className="btn-icon" title="Ver Mesa">
                  <i className="bx bxs-show" />
                </Button>
              </Link>{" "}
                {hasPermission.updateTable && (
                  <>
              <Link href={`/pages/tables/actualizar/${row.id}`}>
              <Button
                color="success"
                className="btn-icon"
                title="Actualizar mesa"
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
          data={tableFiltered}
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
            <Button color="primary" onClick={handleInactivateTable}>
              Aceptar
            </Button>
          </div>
        </Modal>
      </div>
    )
  );
};
export { Table_tables };
import { Table } from "@/components/Table";
import { Container } from "muni-ui"
import { useEffect, useState } from "react";
import { TableData } from "./TableData";
import { useNavigate } from "react-router-dom";
import MuniSpinner from "@/components/MuniSpinner";
import { getActas } from "@/services/ActaService";
import TableBackPagination from "@/components/TableBackPagination";

export const ListadoActas = () => {

    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [actas, setActas] = useState([]);

    const [filtro, setFiltro] = useState({
        estado_id: null,
        busqueda: '',
    });
    const [debouncedFiltro, setDebouncedFiltro] = useState(filtro);
    const [rowCount, setRowCount] = useState(0);
    const [page, setPage] = useState(0);
    const pageSize = 100; // Cantidad de filas por página

    useEffect(() => {

        getActas(setActas, setIsLoading);

    }, [])


    return (
        <Container title={'Listado de Actas'} linkBack="#/">
            {isLoading ? (
                <MuniSpinner />
            ) : (
                <TableBackPagination search={false}
                    data={TableData(actas, nav)}
                    // name="actas"
                    paginationMode="server"
                    rowCount={rowCount}
                    page={page}
                    pageSize={pageSize}
                    setPage={setPage}
                // loading={isLoading}
                />
            )}
        </Container>
    )
}

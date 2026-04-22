import { Table } from "@/components/Table";
import { Container } from "muni-ui"
import { useState } from "react";
import { TableData } from "./TableData";
import { useNavigate } from "react-router-dom";
import MuniSpinner from "@/components/MuniSpinner";

export const ListadoActas = () => {

    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [actas = [], setActas] = useState();

    return (
        <Container title={'Listado de Actas'} linkBack={'/'}>
            {isLoading ? (
                <MuniSpinner />
            ) : (
                <Table data={TableData(actas, nav)} search />
            )}
        </Container>
    )
}

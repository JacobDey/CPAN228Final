import {useParams} from "react-router";
import SSSNavbar from "../components/SSSNavbar.jsx";

function SSSCardDetails(){
    const {id} = useParams();

    return(
        <>
            <h1>This page will eventually fetch card details by id from the database</h1>
            <p>ID: {id}</p>
        </>
    )
}

export default SSSCardDetails;
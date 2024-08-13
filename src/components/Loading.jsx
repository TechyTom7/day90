import "../styles/Loading.css"

export default function Loading(props) {
    return (
        <div id="loading-container">
            <h1>{props.children || "Loading"}</h1>
        </div>
    )
}

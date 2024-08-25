import { useState, useEffect } from "react";
import Loading from "./Loading";

export default function Transaction() {

    useEffect(() => {
        // Create a new script element

        const script = document.createElement('script');
        script.src = "//tinder.thrivecart.com/embed/v2/thrivecart.js";
        script.async = true;
        script.id = "tc-cxotransform-286-BE9DPJ";

        // Append the script to the document body (or another appropriate location)
        document.body.appendChild(script);


        // Cleanup: Remove the script when the component unmounts
        return () => {
            document.body.removeChild(script);

        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <div className="tc-v2-embeddable-target"
             data-thrivecart-account="cxotransform"
             data-thrivecart-tpl="v2"
             data-thrivecart-product="286"
             data-thrivecart-embeddable="tc-cxotransform-286-BE9DPJ">
        </div>
    );
}

export function closeNav(){
    document.getElementById("grid-container")!.style.cssText = "grid-template-columns:0px 80px 1fr;";
    document.getElementById("nav-open-icon")!.style.cssText = "display:block;";
    document.getElementById("nav-close-icon")!.style.cssText = "display:none;";
}

export function openNav(){
    document.getElementById("grid-container")!.style.cssText = "grid-template-columns:200px 0px 1fr;"; /* change css properties if changing grid columns */
    document.getElementById("nav-close-icon")!.style.cssText = "display:block;";
    document.getElementById("nav-open-icon")!.style.cssText = "display:none;";
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
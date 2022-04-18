const formulario = document.getElementById("agregar-gasto");

class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante()
    }
    calcularRestante(){
       // this.gastos.forEach(gasto)
        const gastado = this.gastos.reduce((total,gasto)=>total+gasto.cantidad,0)
        const resultado = this.presupuesto - gastado
        this.restante = resultado
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto=>gasto.id !== id);
        this.calcularRestante()
    }
}
class UI{
    mostrarPresupuesto(presupuesto){
        const total = document.getElementById("total");
        const restante = document.getElementById("restante");
        total.textContent = presupuestoClass.presupuesto
        restante.textContent = presupuestoClass.restante
    }
    mostrarMensaje(mensaje,tipo){
        const pMensaje = document.createElement("p");
        pMensaje.textContent = mensaje;
        pMensaje.classList.add("alert");
        if(tipo==="error"){
            pMensaje.classList.add("alert-danger");
        }else{
            pMensaje.classList.add("alert-success");
        }
        const contenedorPadre = document.querySelector(".primario");
        contenedorPadre.insertBefore(pMensaje,formulario);
        setTimeout(() => {
            pMensaje.remove()
        }, 3000);
    }
    gastoHTML(gastos){
        this.limpiarHTML();
        gastos.forEach(gasto=>{
            const divListaGasto = document.querySelector(".list-group");
            const div = document.createElement("div");
            div.classList.add("d-flex","justify-content-between","mt-2");
            div.innerHTML=`
                <p>${gasto.gasto}</p>
                <p>${gasto.cantidad}</p>
            `
            const btnEliminarGasto = document.createElement("button");
            btnEliminarGasto.classList.add("btn","btn-danger")
            btnEliminarGasto.textContent = "Borrar X"
            btnEliminarGasto.onclick = ()=>{
                eliminarGasto(gasto.id)
            }
            div.appendChild(btnEliminarGasto)
            divListaGasto.appendChild(div);
        })
    }
    limpiarHTML(){
        const divListaGasto = document.querySelector(".list-group");
        while(divListaGasto.firstChild){
            divListaGasto.removeChild(divListaGasto.firstChild)
        }
    }
    mostrarRestante(restanteTotal){
        const restante = document.getElementById("restante");
        restante.textContent = restanteTotal
    }
    cambiarColorRestante(restanteTotal,presupuesto){
        const valor1 = presupuesto*0.5;
        const valor2 = presupuesto*0.25;
        const restante = document.getElementById("restante").parentElement.parentElement;
        const btnAgregar = document.querySelector(".btn-agregar");
        if(restanteTotal<=0){
            restante.classList.remove("alert-warning","alert-success");
            restante.classList.add("alert-danger");
            btnAgregar.disabled = true;
            this.mostrarMensaje("El presupuesto se ha agotado","error");
            return
        }
        if(restanteTotal<= valor2){
            restante.classList.remove("alert-warning","alert-success");
            restante.classList.add("alert-danger");
            btnAgregar.disabled = false;
            return
        }
        if(restanteTotal<= valor1){
            restante.classList.remove("alert-danger","alert-success");
            restante.classList.add("alert-warning");
            btnAgregar.disabled = false;
            return;
        }
        if(restanteTotal>valor1){
            restante.classList.remove("alert-danger","alert-warning");
            restante.classList.add("alert-success");
            btnAgregar.disabled = false;
            return
        }
        
    }
}


const ui = new UI();
let presupuesto;

cargarEventListeners();
function cargarEventListeners(){
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto);
    formulario.addEventListener("submit",agregarGasto);
    
}

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");
    if(presupuestoUsuario === "" || preguntarPresupuesto === null || preguntarPresupuesto <= 0 || isNaN(presupuestoUsuario)){
        window.location.reload();
        return;
    }
    presupuestoClass = new Presupuesto(presupuestoUsuario);
    ui.mostrarPresupuesto(presupuesto);
    
}

function agregarGasto(e){
    e.preventDefault()
    const inputGasto = document.getElementById("gasto").value
    const inputCantidad = Number(document.getElementById("cantidad").value);
    if(inputCantidad === "" || inputGasto === ""){
        ui.mostrarMensaje("Ambos campos son obligatorios","error");
        return
    }else if(isNaN(inputCantidad)){
        ui.mostrarMensaje("La cantidad no es valida","error");
        return
    }
    ui.mostrarMensaje("Gasto agregado correctamente");
    const gastoObj = {
        gasto: inputGasto,
        cantidad:inputCantidad,
        id: Date.now()
    }
    formulario.reset()
    presupuestoClass.nuevoGasto(gastoObj)
    const {gastos,restante,presupuesto} = presupuestoClass;
    ui.gastoHTML(gastos);
    ui.mostrarRestante(restante);
    ui.cambiarColorRestante(restante,presupuesto);
}

function eliminarGasto(id){
    presupuestoClass.eliminarGasto(id);
    const {gastos,restante,presupuesto} = presupuestoClass
    ui.gastoHTML(gastos)
    ui.mostrarRestante(restante)
    ui.cambiarColorRestante(restante,presupuesto)
}

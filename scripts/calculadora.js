import { maquinaCalculadora } from './maquina.js';

document.getElementsByName("button").forEach(f => (f.addEventListener("click", pegaElementoValue)));
document.getElementsByName("historico-temp").forEach(f => (f.addEventListener("dblclick", voltaInput)));
document.addEventListener('keypress', eventoTecladoKeyPress);
document.addEventListener('keydown', eventoTecladoKeyDown);

let lastExp;
let statusFalha = false;
const visorContainer = document.getElementById("visorContainer");
const visor = document.getElementById("visor");
const visorTemp = document.getElementById("visor-temp");
const historico = document.getElementById("historico-list");

visor.addEventListener('focus', visorFocus);
visor.addEventListener('focusout', visorFocusOut);



function visorFocus(){
    visorContainer.classList.add("visor-active");
}

function visorFocusOut(){
    visorContainer.classList.remove("visor-active");
}

export function voltaInput(e) {
    visor.value = e.toElement.innerText;
    visorTemp.value = "result: 0";
    preCalcular();
}

function eventoTecladoKeyDown(evt) {
    if (evt.target.className !== "visor-input") {
        switch (evt.keyCode) {
            case 8:
                actionCalcular("CE");
                break;
            case 27:
                visor.value = "";
                visorTemp.value = "";
                break;
        }
    }

}

function eventoTecladoKeyPress(keyEvent) {

    const key = keyEvent.keyCode;
    const keyName = keyEvent.key;

    try {
        if (key == 47) {
            actionCalcular('÷');
        } else if ((key > 47 && key <= 57)
            || key == 37
            || key == 42 || key == 45
            || key == 43 || key == 40
            || key == 41
        ) {
            actionCalcular(keyName);
        } else if (key == 13 || key == 43) {
            actionCalcular('=');
        } else if (key == 46 || key == 44) {
            actionCalcular('.');
        } else {
            keyEvent.preventDefault();
        }
    } catch (error) {

    }
}

function pegaElementoValue(elementEvent) {

    actionCalcular(elementEvent.toElement.innerHTML);
}

function actionCalcular(entrada) {
    var value = visor.value;
    switch (entrada) {
        case "CE":
            if (value.length > 0) {
                visor.value = value.substring(0, value.length - 1);
            }
            break;
        case "=":
            preCalcular();
            if (statusFalha) return false;
            
            var temp = calcular();
            if(lastExp == visor.value) return false;
            lastExp = temp;
            salvarExpressao(temp);
            visor.value = temp;
            
            break;
        default:
            visor.value += entrada;
            preCalcular();
    }

}

function salvarExpressao(valor) {
    var element =  '<div style="display: inline-flex;">' +
        '<span type="text" class="historico-temp" style="width: 200px;" readonly>'+visor.value+'</span>' +
        '<span type="text" class="historico-temp" style="width: 90px;" readonly>'+valor+'</span>' +
        '</div>';

    historico.innerHTML = historico.getInnerHTML() + element;
    historico.scrollTop = historico.scrollHeight; // move scroll bar pro ultimo elemento adicionado*
}

function calcular() {
    var result = preCalcular();
    visorTemp.innerText = visor.value;
    return result;
}

function preCalcular() {
    var value = NaN;
    try {
        statusFalha = false;
        value = maquinaCalculadora(visor.value);
        visorContainer.classList.remove("errorOperation");
    } catch (e) {
        console.log(e);
        statusFalha = true;
        visorContainer.classList.add("errorOperation");
    }

    visorTemp.innerHTML = "result: " + value;
    return value;
}


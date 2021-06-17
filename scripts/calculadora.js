// import {maquinaCalculadora} from './maquina.js';
import {trataExpressao} from "./tratamento.js";

let lastExp;
let statusFalha = false;
const visorContainer = document.getElementById("visorContainer");
const visor = document.getElementById("visor");
const visorTemp = document.getElementById("visorTemp");
const historico = document.getElementById("historicoList");

visor.addEventListener('focus', visorFocus);
visor.addEventListener('focusout', visorFocusOut);

document.getElementsByName("button").forEach(f => (f.addEventListener("click", pegaElementoValue)));
// document.getElementsByName("historico-temp").forEach(f => (f.addEventListener("dblclick", recuperaDadosHistoricoInput)));
document.addEventListener('keypress', eventoTecladoKeyPress);
document.addEventListener('keydown', eventoTecladoKeyDown);


function visorFocus() {
    visorContainer.classList.add("visor-active");
}

function visorFocusOut() {
    visorContainer.classList.remove("visor-active");
}

export function recuperaDadosHistoricoInput(e) {
    visor.value = e.toElement.innerText;
    visorTemp.value = "result: 0";
    preCalcular();
}

function eventoTecladoKeyDown(evt) {
    if (evt.target.className != "visor" && evt.keyCode == 8) { // Tecla Backspace
        actionCalcular("CE");
        evt.preventDefault();
    } else if (evt.keyCode == 27) { // Tecla ESC limpa os campos
        visor.value = "";
        visorTemp.value = "";
    }
}

function eventoTecladoKeyPress(keyEvent) {

    const key = keyEvent.keyCode;
    const keyName = keyEvent.key;

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

            const temp = calcular();
            if (lastExp == visor.value) return false;
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
    var element = '<div style="display: inline-flex;">' +
        '<span type="text" class="historico-temp" name="historico-temp" style="width: 200px;">' + visor.value + '</span>' +
        '<span type="text" class="historico-temp" name="historico-temp" style="width: 90px;">' + valor + '</span>' +
        '</div>';

    historico.innerHTML = historico.getInnerHTML() + element;
    historico.scrollTop = historico.scrollHeight; // move scroll bar pro ultimo elemento adicionado*
    /**
     * Adiciona evento DoubleClick nos inputs name historico-temp
     */
    document.getElementsByName("historico-temp").forEach(f => (f.addEventListener("dblclick", recuperaDadosHistoricoInput)));
}

function calcular() {
    var result = preCalcular();
    visorTemp.innerText = visor.value;
    return result;
}

function preCalcular() {
    let value = NaN;
    try {
        statusFalha = false;
        const expresao = trataExpressao(visor.value)
        value = eval(expresao);
        visorContainer.classList.remove("error-operation");
    } catch (e) {
        console.log(e.message);
        statusFalha = true;
        visorContainer.classList.add("error-operation");
    }

    visorTemp.innerHTML = "result: " + value;
    return value;
}

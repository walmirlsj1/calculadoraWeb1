import { maquinaCalculadora } from './maquina.js';

var visorTemp = document.getElementById("visor-temp");
var visor = document.getElementById("visor-input");
var historico = document.getElementById("historico-list");
document.getElementsByName("button").forEach(f => (f.addEventListener("click", pegaElementoValue)));
document.addEventListener('keypress', processaTeclado);
document.addEventListener('keydown', processaTecladoEspecial);

var lastExp;

let statusFalha = false;
function processaTecladoEspecial(evt) {
    if (evt.target.className != "visor-input") {
        switch (evt.keyCode) {
            case '8':
                actionCalcular("CE");
                break;
            case 27:
                visor.value = "";
                visorTemp.value = "";
                break;
        }
    }

}
function processaTeclado(keyEvent) {

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
    // visor.value
    
    var element =  '<div style="display: inline-flex;">' +
        '<span type="text" class="historico-temp" value="' + visor.value + '" style="width: 200px;" readonly>'+visor.value+'</span>' +
        '<span type="text" class="historico-temp" value="' + valor + '" style="width: 90px;" readonly>'+valor+'</span>' +
        '</div>';

    historico.innerHTML = historico.getInnerHTML() + element;
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
        visor.classList.remove("errorOperation")
    } catch (e) {
        console.log(e);
        statusFalha = true;
        visor.classList.add("errorOperation")
    }

    visorTemp.innerHTML = "result: " + value;
    return value;
}


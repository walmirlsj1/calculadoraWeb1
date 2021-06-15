
// document.getElementById("button").addEventListener("click", teste);
var visorTemp = document.getElementById("visor-temp");
var visor = document.getElementById("visor-input");
document.getElementsByName("button").forEach(f => (f.addEventListener("click", pegaElementoValue)));
// document.getElementById("visor-input").("keyup", preCalcular);
document.addEventListener('keyup', processaTeclado);
// document.getElementById("visor-input").addEventListener("keyDown", preCalcular);
let statusFalha = false;

function processaTeclado(keyEvent) {
    // teste()
    // 96 - 105 111 106 109 107 57 48 53 [0-9] / * - + ( ) %
    // 110 108 . , // converte pra ponto
    // 13 187 enter = funcao igual
    const key = eval(keyEvent.keyCode);
    const keyName = keyEvent.key;
    keyEvent.preventDefault();
    
    console.log("keyCode: " + key)
    if ((key > 95 && key <= 105)
        || key == 111
        || key == 106
        || key == 109
        || key == 107
        || key == 57
        || key == 48
        || key == 53) {
        teste(keyName);
    } else if (key == 13 || key == 187) {
        teste('=');
    } else if (key == 108 || key == 110) {
        teste('.');
    } else if(key == 8){
        teste("CE");
    } else if(key == 27){
        visor.value = "";
        visorTemp.value = "";
    }
}

function pegaElementoValue(elementEvent) {
    
    teste(elementEvent.toElement.innerHTML);
}

function teste(entrada) {
    //event1.toElement.innerHTML
    // visor.value(event1.toElement.innerHTML);

    var value = visor.value;
    switch (entrada) {
        case "CE":
            if (value.length > 0) {
                visor.value = value.substring(0, value.length - 1);
                preCalcular();
            }
            break;
        case "=":
            // var temp = value;
            preCalcular();
            if (statusFalha) return false;
            visor.value = calcular();
            // visorTemp.innerHTML = "ans: " + temp;
            break;
        // case "":
        default:
            visor.value += entrada;
            preCalcular();
    }
    
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
        value = calc(visor.value);
        visor.classList.remove("errorOperation")
    } catch (e) {
        console.log(e);
        statusFalha = true;
        visor.classList.add("errorOperation")
    }

    visorTemp.innerHTML = "result: " + value;
    return value;
}

var stack = [];
var fita = [];
var p = 0;

function calc(fita) {
    // this.fita = fita;
    fita = fita.replace('÷', '/');

    this.fita = fita;
    stack = [];
    p = 0;
    var calcula = false;

    calcula = E();

    var texto = "Exp " + fita + " valida: " + calcula;
    if (p < fita.length && calcula) {
        texto += " até a posicao: " + (p);
        // console.log(texto);

        throw new Error("texto");
    }
    // alert(texto);
    var result = stack.pop();
    return result;// 
    // console.log(texto + " resultado " + stack.pop());
    // console.log("---");
    // return true;
}

function calcula(op) {
    var v1 = stack.pop();
    var v2 = stack.pop();
    console.log(v1, v2, op);
    var result = 0;
    switch (op) {
        case '*':
            result = v2 * v1;
            break;
        case '/':
            result = v2 / v1;
            break;
        case '+':
            result = v2 + v1;
            break;
        case '-':
            result = v2 - v1;
            break;
        case '%':
            stack.push(v2);
            result = v1 / 100;
            break;
        default:
    }
    // console.log(op)
    // if (signal != '') result = 0 - result;
    stack.push(result);

}

function E() {
    if (T()) {
        var pp = p;
        if (match('+') || match('-')) {
            if (!E()) return false;
            calcula(fita[pp]);
        }

        return true;
    }
    return false;
}

function T() {
    if (F()) {
        var pp = p;
        if (match('*') || match('/')) {
            if (!T()) return false;
            calcula(fita[pp]);
        }
        return true;
    }
    return false;
}

function F() {
    if (match('-') && (fita[p] == '(' || p == 1) && F()) {
        // corrige signal negativo 14/06/2021
        stack.push(0 - stack.pop());
        return true;
    } else {
        if (match('(')) {
            E();
            return match(')');;
        }
    }
    var n = Num();
    if (match('%')) {
        calcula('%');
    }
    return n;
}

function Num() {
    var s = 0;
    var contadorDir = 0;
    var valor = 0.0;
    var valorDir = 0.0;
    var erro = false;
    var signal = 1.0;
    var f = false; // float?

    while (true) {
        switch (s) {
            case 0:
                if (fita[p] >= '0' && fita[p] <= '9')
                    s = 2;
                else if (fita[p] == '+') s = 1;
                else if (fita[p] == '-') {
                    s = 1;
                    signal = -1.0;
                } else if (fita[p] == '.') {
                    s = 3;
                    f = true;
                } else
                    erro = true; //return false;
                break;
            case 1:
                if (fita[p] >= '0' && fita[p] <= '9')
                    s = 2;
                else if (fita[p] == '.') {
                    s = 3;
                    f = true;
                } else erro = true; //return false;
                break;
            case 2:
                if (fita[p] >= '0' && fita[p] <= '9')
                    s = 2;
                else if (fita[p] == '.') {
                    s = 3;
                    f = true;
                } else {
                    stack.push(valor * signal);
                    return true;
                }
                break;
            case 3:
                if (fita[p] >= '0' && fita[p] <= '9')
                    s = 4;
                else erro = true; //return false;;
                break;
            case 4:
                if (fita[p] >= '0' && fita[p] <= '9') {
                    s = 4;
                } else {
                    stack.push((valor + (valorDir / Math.pow(10, contadorDir))) * signal);
                    return true;
                }
                break;
        }
        if (erro) {
            throw new Error("Erro: Numero era esperado na posição: " + (p + 1) + " contem: '" + fita[p] + "'");
        }
        if (fita[p] != '-' && fita[p] != '+' && fita[p] != '.' && !f) {
            valor *= 10;
            valor += fita[p] - '0';
        } else if (f && fita[p] != '.') {
            contadorDir++;
            valorDir *= 10;
            valorDir += fita[p] - '0';
        }
        p++;
    }
}


function match(valor) {
    if (valor == fita[p]) {
        p++;
        return true;
    }
    return false;
}
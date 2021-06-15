// document.getElementById("button").addEventListener("click", teste);
document.getElementsByName("button").forEach(f => (f.addEventListener("click", teste)));
var visor = document.getElementById("visor-input");
document.getElementById("visor-input").addEventListener("change", testarExpressao)
function teste(event1) {
    //event1.toElement.innerHTML
    // visor.value(event1.toElement.innerHTML);
    var entrada = event1.toElement.innerHTML;
    var value = visor.value;
    switch (entrada) {
        case "CE":
            if (value.length > 0)
                value = value.substring(0, value.length - 1);
            break;
        case "=":
            value = testarExpressao(value);
            break;
        default:
            value += entrada;
    }
    visor.value = value;
}
function testarExpressao(entrada) {
    var value = NaN;
    try {
        value = calc(entrada);
        visor.classList.remove("errorOperation")
    } catch (e) {
        console.log(e);
        visor.classList.add("errorOperation")
    }
    return value;
}

var stack = [];
var fita = [];
var p = 0;

function calc(fita) {
    // this.fita = fita;
    this.fita = fita;
    stack = [];
    p = 0;
    var calcula = false;

    calcula = E();

    var texto = "Exp " + fita + " valida: " + calcula;
    if (p < fita.length && calcula) {
        texto += " até a posicao: " + (p);
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
        default:
    }
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
    var signal = '';
    if (match('-') && (fita[p] == '(' || p == 1) && F()) {
        // corrige signal negativo 14/06/2021
        stack.push(0 - stack.pop());
        return true;
    } else
        if (match('(')) {
            E();

            return match(')');;
        }
    return Num();
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
                if (fita[p] >= '0' && fita[p] <= '9')
                    s = 4;
                else {
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
function validarCalculadora() {

}
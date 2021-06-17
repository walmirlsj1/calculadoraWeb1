export { maquinaCalculadora };
let stack = [];
let fita = [];
let p = 0;

function maquinaCalculadora(fita1) {
    fita = fita1.replaceAll('÷', '/');

    stack = [];
    p = 0;
    let calcula = false;

    calcula = expressao();

    let texto = "Exp " + fita + " valida: " + calcula;
    if (p < fita.length && calcula) {
        texto += " até a posicao: " + (p);
        throw new Error(texto);
    }
    return stack.pop();
}

function calcula(op) {
    const v1 = stack.pop();
    const v2 = stack.pop();

    let result = 0;
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
    stack.push(result);

}

function expressao() {
    if (termo()) {
        const pp = p;
        if (match('+') || match('-')) {
            if (!expressao()) return false;
            calcula(fita[pp]);
        }

        return true;
    }
    return false;
}

function termo() {
    if (fator()) {
        const pp = p;
        if (match('*') || match('/')) {
            if (!termo()) return false;
            calcula(fita[pp]);
        }
        return true;
    }
    return false;
}

function fator() {
    if (match('-') && (fita[p] == '(' || p == 1) && fator()) {
        // corrige signal negativo 14/06/2021
        stack.push(0 - stack.pop());
        return true;
    } else {
        if (match('(')) {
            expressao();
            return match(')');;
        }
    }
    const n = numero();
    if (match('%')) {
        calcula('%');
    }
    return n;
}

function numero() {
    let estado = 0;
    let contadorDir = 0;
    let valor = 0.0;
    let valorDir = 0.0;
    let erro = false;
    let signal = 1.0;
    let f = false; // float?

    while (true) {
        switch (estado) {
            case 0:
                if (fita[p] >= '0' && fita[p] <= '9')
                    estado = 2;
                else if (fita[p] == '+') estado = 1;
                else if (fita[p] == '-') {
                    estado = 1;
                    signal = -1.0;
                } else if (fita[p] == '.') {
                    estado = 3;
                    f = true;
                } else
                    erro = true;
                break;
            case 1:
                if (fita[p] >= '0' && fita[p] <= '9')
                    estado = 2;
                else if (fita[p] == '.') {
                    estado = 3;
                    f = true;
                } else erro = true;
                break;
            case 2:
                if (fita[p] >= '0' && fita[p] <= '9')
                    estado = 2;
                else if (fita[p] == '.') {
                    estado = 3;
                    f = true;
                } else {
                    stack.push(valor * signal);
                    return true;
                }
                break;
            case 3:
                if (fita[p] >= '0' && fita[p] <= '9')
                    estado = 4;
                else erro = true; //return false;;
                break;
            case 4:
                if (fita[p] >= '0' && fita[p] <= '9') {
                    estado = 4;
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
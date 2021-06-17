export {trataExpressao};

function trataExpressao(expressao) {
    /**
     * Trata o texto da expressao
     * substitui '÷' por '/'
     * verifica se existe numeros com sinal de porcentagem
     * se existir substitui a porcentagem por num/100
     *
     */
    expressao = expressao.replaceAll('÷', '/');

    const regexp = RegExp(/[0-9]+\%/g, 'g');

    const listaItemPorcentagem = expressao.match(regexp);

    if (listaItemPorcentagem != null && listaItemPorcentagem.length > 0) {
        listaItemPorcentagem.forEach(v =>
            expressao = expressao
                .replace(v, v.replace(/[0-9]/g, '') + "/100")
        );
    }
    return expressao;
}

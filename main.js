const calcularResultado = (expresion) => {
    const elementos = dividirExpresion(expresion);
    const resultado = evaluarElementos(elementos);
    return resultado;
};

const dividirExpresion = (expresion) => {
    return expresion.match(/(\d+|[-+*/()])/g);
};

const evaluarElementos = (elementos) => {
    const salida = [];
    const operadores = [];
    const precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };

    elementos.forEach(elemento => {
        if (!isNaN(elemento)) {
            salida.push(parseFloat(elemento));
        } else if (elemento === '(') {
            operadores.push(elemento);
        } else if (elemento === ')') {
            while (operadores.length && operadores[operadores.length - 1] !== '(') {
                salida.push(operadores.pop());
            }
            operadores.pop();
        } else {
            while (
                operadores.length &&
                precedencia[elemento] <= precedencia[operadores[operadores.length - 1]]
            ) {
                salida.push(operadores.pop());
            }
            operadores.push(elemento);
        }
    });

    while (operadores.length) {
        salida.push(operadores.pop());
    }

    return calcularPostfijo(salida);
};

const calcularPostfijo = (postfijo) => {
    const pilaResultados = [];
    const pasos = [];

    postfijo.forEach(elemento => {
        if (typeof elemento === 'number') {
            pilaResultados.push(elemento);
        } else {
            const b = pilaResultados.pop();
            const a = pilaResultados.pop();
            let operacion;

            switch (elemento) {
                case '+':
                    operacion = a + b;
                    break;
                case '-':
                    operacion = a - b;
                    break;
                case '*':
                    operacion = a * b;
                    break;
                case '/':
                    operacion = a / b;
                    break;
            }

            pilaResultados.push(operacion);
            pasos.push(`Calcular: ${a} ${elemento} ${b} = ${operacion}`);
        }
    });

    pasos.push(`Resultado Final: ${pilaResultados[0]}`);
    return pasos;
};

document.getElementById('btnCalcular').addEventListener('click', () => {
    const entrada = document.getElementById('entradaExpresion').value.trim();

    if (!entrada) {
        swal("Error", "La expresión no puede estar vacía.", "error");
        return;
    }

    if (/[^0-9+\-*/() ]/.test(entrada)) {
        swal("Error", "La expresión solo puede contener números y operadores matemáticos.", "error");
        return;
    }

    const pasos = calcularResultado(entrada);
    const resultadoDiv = document.getElementById('resultado');

    if (pasos.length > 0) {
        resultadoDiv.innerHTML = pasos.join('<br>');
        swal("Éxito", "La operación se ha realizado con éxito.", "success");
    } else {
        swal("Error", "No se pudo calcular la expresión.", "error");
    }
});

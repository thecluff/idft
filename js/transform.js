function dft(inpReal, inpImag) {
    var k,
        n,
        angle,
        outReal = [],
        outImag = [],
        sumReal,
        sumImag,
        nn,
        sin = [],
        cos = [],
        N = inpReal.length,
        twoPiByN = Math.PI / N * 2;

    for (k = 0; k < N; k++) {
        angle = twoPiByN * k;
        sin.push(Math.sin(angle));
        cos.push(Math.cos(angle));
    }

    for (k = 0; k < N; k++) {
        sumReal = 0;
        sumImag = 0;
        nn = 0;
        for (n = 0; n < N; n++) {
            sumReal +=  inpReal[n] * cos[nn] + inpImag[n] * sin[nn];
            sumImag += -inpReal[n] * sin[nn] + inpImag[n] * cos[nn];
            nn = (nn + k) % N;
        }
        outReal.push(sumReal);
        outImag.push(sumImag);
    }
    return [outReal, outImag];
}

function idft(inpReal, inpImag) {
    var k,
        n,
        angle,
        outReal = [],
        outImag = [],
        sumReal,
        sumImag,
        kk,
        sin = [],
        cos = [],
        N = inpReal.length,
        twoPiByN = Math.PI / N * 2;

    for (n = 0; n < N; n++) {
        angle = twoPiByN * n;
        sin.push(Math.sin(angle));
        cos.push(Math.cos(angle));
    }

    for (n = 0; n < N; n++) {
        sumReal = 0;
        sumImag = 0;
        kk = 0;
        for (k = 0; k < N; k++) {
            sumReal +=  inpReal[k] * cos[kk] - inpImag[k] * sin[kk];
            sumImag +=  inpReal[k] * sin[kk] + inpImag[k] * cos[kk];
            kk = (kk + n) % N;
        }
        outReal.push(sumReal / N);
        outImag.push(sumImag / N);
    }
    return [outReal, outImag];
}
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import size from 'lodash/size';
import reduce from 'lodash/reduce';
import QrCode from 'qrcode-generator';
import Square from './figures/square';
import Vector from './figures/vector';

const makeTable = (data, typeNumber = 5, errorCorrectionLevel = 'L') => {
    const qr = QrCode(typeNumber, errorCorrectionLevel);
    qr.addData(data);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const qrTable = {};
    for (let i = 0; i < moduleCount; i += 1) {
        for (let j = 0; j < moduleCount; j += 1) {
            qrTable[i] = { ...qrTable[i], [j]: qr.isDark(i, j) };
        }
    }
    return qrTable;
};

const makeAnkers = (table, margin) => reduce(table, (resultAcc, row, i) => {
    const points = reduce(row, (acc, cell, j) => (cell ? {
        ...acc, [j]: new Vector(j * margin, i * margin),
    } : acc), {});
    return { ...resultAcc, [i]: points };
}, {});

export default (data, width, updating = true) => {
    const table = makeTable(data);
    const sqSize = width / size(table);
    const ankers = makeAnkers(table, sqSize);
    const squares = map(ankers,
        row => map(row,
            (point) => {
                const sq = new Square(updating ? point.x
                    : width * Math.random(), updating ? point.y
                    : -sqSize * 2, sqSize, point);
                sq.setSpeed(5);
                return sq;
            }));
    return flattenDeep(squares);
};

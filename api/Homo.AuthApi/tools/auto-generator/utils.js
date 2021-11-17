module.exports = {
    camelToSnake: (s) => {
        return s.replace(/[\w]([A-Z])/g, function (m) {
            return m[0] + '-' + m[1];
        }).toLowerCase();
    },
    snakeToCamel: (s) => {
        return s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });
    },
    snakeToFirstUpperCamel: (s) => {
        const tempReuslt =  s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });
        return tempReuslt.substring(0,1).toUpperCase() + tempReuslt.substring(1);
    },
    snakeToFirstLowerCamel: (s) => {
        const tempReulst =  s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });
        return tempReulst.substring(0,1).toLowerCase() + tempReulst.substring(1);
    },
    firstToUpperCase: (s) => {
        return s.substring(0,1).toUpperCase() + s.substring(1);
    },
    firstToLowerCase: (s) => {
        return s.substring(0,1).toLowerCase() + s.substring(1);
    }
}
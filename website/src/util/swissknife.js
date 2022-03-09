export const Swissknife = {
    getQueryString: (key) => {
        if (!location.search || location.search.substring(1).length === 0) {
            return '';
        }
        const queryStrings = location.search.substring(1).split('&');
        const result = queryStrings.find((qs) => {
            if (qs.indexOf(`${key}=`) === 0) {
                return true;
            } else {
                return false;
            }
        });
        if (result) {
            return decodeURIComponent(result.split('=')[1]);
        }
        return '';
    },
    removeEmptyQueryString: (url) => {
        if (url.indexOf('?') === -1) {
            return url;
        }
        const location = url.substring(0, url.indexOf('?') + 1);
        const queryString = url.substring(url.indexOf('?') + 1);
        const queryArray = queryString.split('&');
        const newQueryArray = [];
        for (let i = 0; i < queryArray.length; i++) {
            if (queryArray[i].split('=')[1] === '') {
                continue;
            }
            newQueryArray.push(queryArray[i]);
        }

        return location + newQueryArray.join('&');
    },
    copyText: (text) => {
        const tempElement = document.createElement('textarea');
        tempElement.value = text;
        tempElement.style.opacity = 0;
        tempElement.style.position = 'fixed';
        tempElement.style.top = 0;
        document.body.appendChild(tempElement);
        tempElement.select();
        document.execCommand('copy');
        document.body.removeChild(tempElement);
    },
    convertVariableToQueryString: (data) => {
        const newQueryStringArray = [];
        for (const key in data) {
            newQueryStringArray.push(`${key}=${encodeURIComponent(data[key])}`);
        }
        return newQueryStringArray.join('&');
    },
    convertUniversalObjectToKeyValueArray: (obj) => {
        const result = [{
            key: '請選擇',
            value: '',
            ttt: ''
        }];
        for (const key in obj.labels) {
            result.push({
                key: obj.labels[key],
                value: key,
                ttt: key
            });
        }
        return result;
    },
    convertNumberWithComma (num) {
        if (num.toString().length <= 3) {
            return num.toString();
        }
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatNumberInput: (elRoot, selector) => {
        elRoot.querySelectorAll(selector).forEach((elInput) => {
            elInput.addEventListener('keydown', (e) => {
                if (
                    Number.isNaN(Number(e.key)) &&
                    e.key.toLowerCase() !== 'tab' &&
                    e.key.toLowerCase().indexOf('arrow') === -1 &&
                    e.key.toLowerCase() !== 'backspace' &&
                    e.key.toLowerCase() !== '.' &&
                    e.ctrlKey === false &&
                    e.metaKey === false
                ) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
            elInput.addEventListener('keyup', (e) => {
                if (Number.isNaN(Number(e.key)) && e.key.toLowerCase() !== 'backspace') {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                const elInputSelf = e.currentTarget;
                const value = elInputSelf.value;
                if (value.length === 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                if (Number(value.replace(/,/gi, '')) === 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                elInputSelf.value = Number(value.replace(/,/gi, '')).toLocaleString('en-US');
            });
        });
    },
    paddingLeft: (source, length, paddingString) => {
        const result = [source];
        for (let i = 0; i < length - source.length; i++) {
            result.unshift(paddingString);
        }
        return result.join('');
    },
    convertQueryStringToVariable: (queryString) => {
        if (queryString.indexOf('?') !== -1) {
            queryString = queryString.substring(queryString.indexOf('?') + 1);
        }
        const tempResult = queryString.split('&');
        const result = {};
        for (let i = 0; i < tempResult.length; i++) {
            const queryStringItem = tempResult[i].split('=');
            const key = queryStringItem[0];
            if (queryStringItem[1]) {
                const value = queryStringItem[1];
                result[key] = value;
            } else {
                result[key] = '';
            }
        }
        return result;
    },
    appendQueryString: (url, key, value) => {
        let urlPrefix = url;
        const questionSignPosition = url.indexOf('?');
        if (questionSignPosition !== -1) {
            urlPrefix = url.substring(0, questionSignPosition);
            const queryString = url.substring(questionSignPosition + 1);
            const queryStringObj = Swissknife.convertQueryStringToVariable(queryString);
            queryStringObj[key] = value;
            return urlPrefix + '?' + Swissknife.convertVariableToQueryString(queryStringObj);
        }
        return `${url}?${key}=${value}`;
    },
    removeUndefinedPropertyTemplateString: (variable, template) => {
        const regex = /({[\w|-|_]+})/g;
        let m;
        let newTemplate = template;
        while ((m = regex.exec(template)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            const variableKey = m[0].substring(1, m[0].length - 1);
            if (variable[variableKey] === undefined) {
                newTemplate = newTemplate.replace(new RegExp(m[0], 'gi'), '');
            }
        }
        return newTemplate;
    },
    GenerateRandomText: (size) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < size; i++) {
            result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
        }
        return result;
    },
    CamelToUnderscoreSnake (string) {
        return string.replace(/[\w]([A-Z])/g, function (m) {
            return m[0] + '_' + m[1];
        }).toLowerCase();
    }
};

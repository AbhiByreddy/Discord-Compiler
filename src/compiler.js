function compileLangauge(language, code) {
    if (language === 'JavaScript'){
        return `code: ${code}`;
    }else if (language === "Python"){
        return `code: ${code}`;
    }
}
module.exports = compileLangauge;
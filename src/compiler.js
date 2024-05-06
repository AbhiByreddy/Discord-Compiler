function compileLangauge(language, code) {
    if (language === 'JavaScript'){
        return 'compile JS!';
    }else if (language === "Python"){
        return 'compile Python!';
    }
}
module.exports = compileLangauge;
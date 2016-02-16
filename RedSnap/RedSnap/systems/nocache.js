
//Edge caches GET requests so we need to nocache whenver Angular GETS new data in regards to friends and the like
module.exports = function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}
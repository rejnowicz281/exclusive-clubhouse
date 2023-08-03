import debug from "debug";

const logger = debug("app:errorHandler");

const errorHandler = function (err, req, res, next) {
    logger(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", { title: err.status || "An error has occured" });
};

export default errorHandler;

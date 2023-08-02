import debug from "debug";

const logger = debug("app:indexController");

export const home = (req, res) => {
    res.render("index", { title: "Home" });
};

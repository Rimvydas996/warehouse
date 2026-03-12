const app = require("./api/index");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Local server running on port ${PORT}`);
});

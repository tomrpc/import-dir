import importDir from "./index.js";

(async () => {
  var dir = await importDir("./f", { recurse: true });

  // var a = await dir.a("333");
  // await dir.a.a("sd");
  console.dir(dir.b.c.a("sdsd"));
})();

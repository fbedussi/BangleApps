(function(back) {
  const s = require("Storage");
  const apps = s
    .list(/\.info$/)
    .map(app => {
      var a = s.readJSON(app, 1);
      return (
        a && {
          name: a.name,
          type: a.type,
          icon: a.icon,
          sortorder: a.sortorder,
          src: a.src
        }
      );
    })
    .filter(
      app => app && (app.type == "app" || app.type == "clock" || !app.type)
    )
    .sort((a, b) => {
      var n = (0 | a.sortorder) - (0 | b.sortorder);
      if (n) return n; // do sortorder first
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

  const settings = s.readJSON("settings.json", 1) || {};

  function save(key, value) {
    settings[key] = value;
    require("Storage").write("settings.json", settings);
  }

  function showApps(btn, apps) {
    const btnMenu = {
      "": {
        title: `Apps for ${btn}`
      },
      "< Back": () => showMenu(mainMenu)
    };

    if (apps.length > 0) {
      apps.reduce((menu, app) => {
        menu[app.name] = () => save(btn, app);
        return menu;
      }, btnMenu);
    } else {
      btnMenu["...No Apps..."] = {
        value: undefined,
        format: () => "",
        onchange: () => {}
      };
    }
    /* return  */ E.showMenu(btnMenu);
  }

  const mainMenu = {
    "": { title: "BigClock Settings" },
    "< Back": back,
    BTN1: () => showApps("BTN1", apps),
    BTN3: () => showApps("BTN3", apps)
  };
  E.showMenu(mainMenu);
});

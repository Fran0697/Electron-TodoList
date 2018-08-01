const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
    console.log("app is ready");
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on("close", () => { app.quit() });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow() {
    addWindow = new BrowserWindow({ width: 300, height: 200, title: "Add new Todo" });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on("closed", () => { addWindow = null });
};

ipcMain.on("addNewTodo", (event, todo) => {
    mainWindow.webContents.send("AddNewTodo", todo);
    addWindow.close();
});


const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Todo",
                accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
                click() { createAddWindow(); }
            },
            {
                label:"Delete Todo List",
                accelerator: process.platform === "darwin" ? "Command+W" : "Ctrl+W",
                click() { mainWindow.webContents.send("deleteTodoList"); }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === "darwin") {
    menuTemplate.unshift({});
}
if (process.env.NODE_ENV !== "production") {
    menuTemplate.push(
        {
            label: "Developer",
            submenu: [
                {role: "reload"},
                {
                    label: "Toggle Developer Tools",
                    accelerator: process.platform === "darwin" ? "Command+D" : "Ctrl+D",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                }
            ]
        }
    )

}